"""Services and MCP actions for the Fuzzy System integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .const import (
    CONF_DEFAULT,
    CONF_ENTITY_ID,
    CONF_INPUTS,
    DATA_ENTRIES,
    DATA_YAML_SYSTEMS,
    DOMAIN,
    SOURCE_CONFIG_ENTRY,
    SOURCE_YAML,
)
from .fuzzy_engine import FuzzySystemEngine

_LOGGER = logging.getLogger(__name__)

SERVICE_SIMULATE = "simulate"
SERVICE_EXPLAIN = "explain"

SIMULATE_SCHEMA = vol.Schema(
    {
        vol.Required("system_id"): cv.string,
        vol.Required("inputs"): vol.Schema({cv.string: vol.Coerce(float)}),
    }
)

EXPLAIN_SCHEMA = vol.Schema(
    {
        vol.Required("system_id"): cv.string,
    }
)


def get_system_data(
    hass: HomeAssistant,
    system_id: str | None = None,
    entry_id: str | None = None,
) -> dict[str, Any] | None:
    """Find system configuration and engine by system_id or entry_id."""
    domain_data = hass.data.get(DOMAIN, {})
    yaml_systems: dict[str, Any] = domain_data.get(DATA_YAML_SYSTEMS, {})
    entries: dict[str, Any] = domain_data.get(DATA_ENTRIES, {})

    # 1. Lookup by entry_id if provided
    if entry_id and entry_id in entries:
        info = dict(entries[entry_id])
        info["source"] = SOURCE_CONFIG_ENTRY
        info["entry_id"] = entry_id
        return info

    if not system_id:
        return None

    # 2. Exact match in YAML systems
    if system_id in yaml_systems:
        info = dict(yaml_systems[system_id])
        info["source"] = SOURCE_YAML
        info["entry_id"] = None
        info.setdefault("system_id", system_id)
        return info

    # 3. Exact match in config entries
    for e_id, entry_info in entries.items():
        if (
            entry_info.get("system_id") == system_id
            or entry_info.get("config", {}).get("system_id") == system_id
        ):
            info = dict(entry_info)
            info["source"] = SOURCE_CONFIG_ENTRY
            info["entry_id"] = e_id
            info.setdefault("system_id", system_id)
            return info

    # 4. Case-insensitive fallback
    sys_lower = system_id.lower()
    for name, data in yaml_systems.items():
        if name.lower() == sys_lower:
            info = dict(data)
            info["source"] = SOURCE_YAML
            info["entry_id"] = None
            info.setdefault("system_id", name)
            return info
    for e_id, entry_info in entries.items():
        if (
            entry_info.get("system_id", "").lower() == sys_lower
            or entry_info.get("config", {}).get("system_id", "").lower() == sys_lower
        ):
            info = dict(entry_info)
            info["source"] = SOURCE_CONFIG_ENTRY
            info["entry_id"] = e_id
            info.setdefault("system_id", entry_info.get("system_id") or system_id)
            return info

    return None


def _get_live_inputs(hass: HomeAssistant, config: dict[str, Any]) -> dict[str, float]:
    """Collect current live sensor states from Home Assistant for input variables."""
    live_inputs: dict[str, float] = {}
    inputs_cfg = config.get(CONF_INPUTS, {})
    for var_name, var_cfg in inputs_cfg.items():
        entity_id = var_cfg.get(CONF_ENTITY_ID)
        default_val = float(var_cfg.get(CONF_DEFAULT, 0.0))
        if not entity_id:
            live_inputs[var_name] = default_val
            continue

        state_obj = hass.states.get(entity_id)
        if state_obj and state_obj.state not in (None, "unknown", "unavailable"):
            try:
                live_inputs[var_name] = float(state_obj.state)
            except ValueError:
                live_inputs[var_name] = default_val
        else:
            live_inputs[var_name] = default_val

    return live_inputs


def _simulate_system(
    system_id: str, inputs: dict[str, float], engine: FuzzySystemEngine
) -> ServiceResponse:
    """Run simulation calculation and format response payload."""
    eval_results = engine.evaluate(inputs)

    outputs: dict[str, float] = {}
    dominant_terms: dict[str, str] = {}
    term_memberships: dict[str, dict[str, float]] = {}
    all_rule_strengths: list[dict[str, Any]] = []

    for out_name, out_data in eval_results.items():
        outputs[out_name] = out_data["defuzzified_value"]
        dominant_terms[out_name] = out_data["dominant_term"]
        term_memberships[out_name] = out_data["term_memberships"]
        if out_data.get("rule_strengths"):
            all_rule_strengths.extend(out_data["rule_strengths"])

    # Deduplicate rule strengths by raw rule string
    seen_rules: set[str] = set()
    dedup_rules: list[dict[str, Any]] = []
    for r in all_rule_strengths:
        rule_text = r["rule"]
        if rule_text not in seen_rules:
            seen_rules.add(rule_text)
            dedup_rules.append(r)

    out_summary = ", ".join(f"{k} = {v} ({dominant_terms.get(k, '')})" for k, v in outputs.items())
    active_count = sum(1 for r in dedup_rules if r["firing_strength"] > 0)
    summary = f"Fuzzy system '{system_id}' simulated: {out_summary}. {active_count} rule(s) fired."

    return {
        "system_id": system_id,
        "inputs": inputs,
        "outputs": outputs,
        "dominant_terms": dominant_terms,
        "term_memberships": term_memberships,
        "rule_strengths": dedup_rules,
        "summary": summary,
    }


def _explain_system(
    system_id: str, live_inputs: dict[str, float], engine: FuzzySystemEngine
) -> ServiceResponse:
    """Evaluate current inputs and build natural language explanation."""
    eval_results = engine.evaluate(live_inputs)

    outputs: dict[str, float] = {}
    dominant_terms: dict[str, str] = {}
    all_rule_strengths: list[dict[str, Any]] = []

    for out_name, out_data in eval_results.items():
        outputs[out_name] = out_data["defuzzified_value"]
        dominant_terms[out_name] = out_data["dominant_term"]
        if out_data.get("rule_strengths"):
            all_rule_strengths.extend(out_data["rule_strengths"])

    seen_rules: set[str] = set()
    active_rules: list[dict[str, Any]] = []
    for r in sorted(all_rule_strengths, key=lambda x: x["firing_strength"], reverse=True):
        rule_text = r["rule"]
        if rule_text not in seen_rules and r["firing_strength"] > 0:
            seen_rules.add(rule_text)
            active_rules.append(r)

    input_str = ", ".join(f"{k}: {v}" for k, v in live_inputs.items())
    out_str = ", ".join(f"{k} is {v} ({dominant_terms.get(k, '')})" for k, v in outputs.items())

    if active_rules:
        top_rule = active_rules[0]
        explanation = (
            f"Fuzzy system '{system_id}' is currently calculating {out_str} given live inputs ({input_str}). "
            f"The primary driving factor is rule '{top_rule['rule']}', firing with strength {top_rule['firing_strength']}."
        )
    else:
        explanation = (
            f"Fuzzy system '{system_id}' is calculating {out_str} with live inputs ({input_str}). "
            "No rules fired with positive strength, so defuzzifier outputted baseline."
        )

    return {
        "system_id": system_id,
        "live_inputs": live_inputs,
        "outputs": outputs,
        "dominant_terms": dominant_terms,
        "active_rules": active_rules,
        "explanation": explanation,
    }


async def async_setup_services(hass: HomeAssistant) -> None:
    """Register MCP and automation actions for fuzzy systems."""

    async def _async_simulate(call: ServiceCall) -> ServiceResponse:
        system_id: str = call.data["system_id"]
        inputs: dict[str, float] = call.data["inputs"]
        sys_data = get_system_data(hass, system_id)
        if not sys_data:
            raise ServiceValidationError(
                f"Fuzzy system '{system_id}' not found.",
                translation_domain=DOMAIN,
                translation_key="system_not_found",
                translation_placeholders={"system_id": system_id},
            )
        return _simulate_system(system_id, inputs, sys_data["engine"])

    async def _async_explain(call: ServiceCall) -> ServiceResponse:
        system_id: str = call.data["system_id"]
        sys_data = get_system_data(hass, system_id)
        if not sys_data:
            raise ServiceValidationError(
                f"Fuzzy system '{system_id}' not found.",
                translation_domain=DOMAIN,
                translation_key="system_not_found",
                translation_placeholders={"system_id": system_id},
            )
        live_inputs = _get_live_inputs(hass, sys_data.get("config", {}))
        return _explain_system(system_id, live_inputs, sys_data["engine"])

    hass.services.async_register(
        DOMAIN,
        SERVICE_SIMULATE,
        _async_simulate,
        schema=SIMULATE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_EXPLAIN,
        _async_explain,
        schema=EXPLAIN_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    _LOGGER.info("Registered Fuzzy System MCP/automation actions: simulate, explain")
