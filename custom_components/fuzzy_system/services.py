"""Services and MCP actions for the Fuzzy System integration."""

from __future__ import annotations

import asyncio
import logging
import os
from typing import Any

import voluptuous as vol
import yaml
from homeassistant import config_entries
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .const import (
    CONF_DEFAULT,
    CONF_ENTITY_ID,
    CONF_INPUTS,
    CONF_OUTPUTS,
    CONF_RULES,
    DATA_ENTRIES,
    DATA_YAML_SYSTEMS,
    DOMAIN,
    SERVICE_ADD_TO_DASHBOARD,
    SERVICE_EXPLAIN,
    SERVICE_GENERATE_CARD,
    SERVICE_GET_SYSTEM,
    SERVICE_INSTANTIATE_TEMPLATE,
    SERVICE_LIST_SYSTEMS,
    SERVICE_LIST_TEMPLATES,
    SERVICE_SIMULATE,
    SOURCE_CONFIG_ENTRY,
    SOURCE_YAML,
)
from .fuzzy_engine import FuzzySystemEngine
from .templates import get_templates, instantiate_template

_LOGGER = logging.getLogger(__name__)

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

LIST_SYSTEMS_SCHEMA = vol.Schema({})

GET_SYSTEM_SCHEMA = vol.Schema(
    {
        vol.Required("system_id"): cv.string,
    }
)

GENERATE_CARD_SCHEMA = vol.Schema(
    {
        vol.Required("system_id"): cv.string,
        vol.Optional("title"): cv.string,
        vol.Optional("show_graph", default=True): cv.boolean,
        vol.Optional("show_inputs", default=True): cv.boolean,
        vol.Optional("show_rules", default=True): cv.boolean,
    }
)

ADD_TO_DASHBOARD_SCHEMA = vol.Schema(
    {
        vol.Required("system_id"): cv.string,
        vol.Optional("dashboard_path"): vol.Any(None, cv.string),
        vol.Optional("view_title"): vol.Any(None, cv.string),
        vol.Optional("card_title"): cv.string,
        vol.Optional("show_graph", default=True): cv.boolean,
        vol.Optional("show_inputs", default=True): cv.boolean,
        vol.Optional("show_rules", default=True): cv.boolean,
    }
)

LIST_TEMPLATES_SCHEMA = vol.Schema({})

INSTANTIATE_TEMPLATE_SCHEMA = vol.Schema(
    {
        vol.Required("template_id"): cv.string,
        vol.Required("system_id"): cv.string,
        vol.Optional("name"): cv.string,
        vol.Optional("entity_mappings"): vol.Schema({cv.string: cv.string}),
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


def _generate_card_config(
    system_id: str,
    title: str | None = None,
    show_graph: bool = True,
    show_inputs: bool = True,
    show_rules: bool = True,
) -> dict[str, Any]:
    """Generate custom:fuzzy-system-card dictionary and formatted YAML."""
    card_config: dict[str, Any] = {
        "type": "custom:fuzzy-system-card",
        "system_id": system_id,
        "show_graph": show_graph,
        "show_inputs": show_inputs,
        "show_rules": show_rules,
    }
    if title:
        card_config["title"] = title

    yaml_str = yaml.dump(card_config, sort_keys=False).strip()
    return {
        "system_id": system_id,
        "card": card_config,
        "yaml": yaml_str,
    }


def _insert_card_into_views(
    views: list[dict[str, Any]], card_config: dict[str, Any], view_title: str | None
) -> str:
    """Insert card configuration into views list, creating or finding the target view."""
    if view_title:
        target_view = next(
            (
                v
                for v in views
                if isinstance(v, dict)
                and (v.get("title") == view_title or v.get("path") == view_title)
            ),
            None,
        )
        if target_view is None:
            target_view = {
                "title": view_title,
                "path": view_title.lower().replace(" ", "-"),
                "cards": [],
            }
            views.append(target_view)
        target_view.setdefault("cards", []).append(card_config)
        return str(target_view.get("title") or target_view.get("path") or view_title)

    if views and isinstance(views[0], dict):
        views[0].setdefault("cards", []).append(card_config)
        return str(views[0].get("title") or views[0].get("path") or "First View")

    new_view = {
        "title": "Fuzzy Systems",
        "path": "fuzzy-systems",
        "cards": [card_config],
    }
    views.append(new_view)
    return "Fuzzy Systems"


def _resolve_dashboard_storage(hass: HomeAssistant, norm_path: str | None) -> Any:
    """Locate the target Lovelace dashboard storage or YAML instance."""
    lovelace_data = hass.data.get("lovelace")
    dashboards: dict[Any, Any] = {}
    if lovelace_data:
        if isinstance(lovelace_data, dict):
            dashboards = lovelace_data.get("dashboards", {})
        elif hasattr(lovelace_data, "dashboards"):
            dashboards = getattr(lovelace_data, "dashboards", {})

    dashboard_storage = dashboards.get(norm_path) if norm_path else None
    if dashboard_storage is None:
        dashboard_storage = dashboards.get("lovelace") or dashboards.get(None)
    if dashboard_storage is None and dashboards:
        dashboard_storage = next(iter(dashboards.values()), None)
    return dashboard_storage


def _resolve_yaml_path(
    hass: HomeAssistant, dashboard_storage: Any, norm_path: str | None
) -> str | None:
    """Determine the file path if the dashboard is YAML-based."""
    if dashboard_storage is not None:
        if getattr(dashboard_storage, "mode", None) == "yaml" or hasattr(dashboard_storage, "path"):
            return getattr(dashboard_storage, "path", None)
    default_yaml_file = hass.config.path("ui-lovelace.yaml")
    if (norm_path in (None, "lovelace") or dashboard_storage is None) and os.path.exists(default_yaml_file):
        return default_yaml_file
    return None


async def _async_save_to_yaml_dashboard(
    hass: HomeAssistant,
    dashboard_storage: Any,
    yaml_file_path: str,
    card_config: dict[str, Any],
    view_title: str | None,
) -> str:
    """Append card to YAML dashboard file on disk and invalidate cache."""
    def _update_yaml_file() -> str:
        content: dict[str, Any] = {}
        if os.path.exists(yaml_file_path):
            with open(yaml_file_path, "r", encoding="utf-8") as f:
                content = yaml.safe_load(f) or {}
        if not isinstance(content, dict):
            content = {"views": []}
        views = content.setdefault("views", [])
        if not isinstance(views, list):
            views = content["views"] = []

        view_name = _insert_card_into_views(views, card_config, view_title)

        with open(yaml_file_path, "w", encoding="utf-8") as f:
            yaml.dump(content, f, sort_keys=False, default_flow_style=False, allow_unicode=True)
        return view_name

    target_view_name = await hass.async_add_executor_job(_update_yaml_file)

    if hasattr(dashboard_storage, "_cache"):
        dashboard_storage._cache = None
    if hasattr(dashboard_storage, "_config_updated"):
        dashboard_storage._config_updated()

    return target_view_name


async def _async_save_to_storage_dashboard(
    dashboard_storage: Any,
    card_config: dict[str, Any],
    view_title: str | None,
) -> str:
    """Append card into Lovelace storage collection and save."""
    current_config = await dashboard_storage.async_load(False)
    if not isinstance(current_config, dict):
        current_config = {"views": []}
    views = current_config.setdefault("views", [])
    if not isinstance(views, list):
        views = current_config["views"] = []

    target_view_name = _insert_card_into_views(views, card_config, view_title)
    await dashboard_storage.async_save(current_config)
    return target_view_name


async def _async_add_to_dashboard(
    hass: HomeAssistant,
    system_id: str,
    dashboard_path: str | None = None,
    view_title: str | None = None,
    card_title: str | None = None,
    show_graph: bool = True,
    show_inputs: bool = True,
    show_rules: bool = True,
) -> ServiceResponse:
    """Insert a fuzzy-system-card into Lovelace storage or YAML dashboard."""
    card_info = _generate_card_config(
        system_id=system_id,
        title=card_title,
        show_graph=show_graph,
        show_inputs=show_inputs,
        show_rules=show_rules,
    )
    card_config = card_info["card"]
    yaml_str = card_info["yaml"]

    norm_path = None if dashboard_path in (None, "", "default", "lovelace") else dashboard_path
    dashboard_storage = _resolve_dashboard_storage(hass, norm_path)
    yaml_file_path = _resolve_yaml_path(hass, dashboard_storage, norm_path)

    if yaml_file_path:
        try:
            view_name = await _async_save_to_yaml_dashboard(
                hass, dashboard_storage, yaml_file_path, card_config, view_title
            )
            return {
                "success": True,
                "system_id": system_id,
                "dashboard_path": dashboard_path or "default",
                "view": view_name,
                "card": card_config,
                "yaml": yaml_str,
                "message": f"Successfully added Fuzzy System card for '{system_id}' to YAML dashboard view '{view_name}'.",
            }
        except Exception as err:
            _LOGGER.warning("Could not append card to YAML dashboard file '%s': %s", yaml_file_path, err)
            return {
                "success": False,
                "system_id": system_id,
                "dashboard_path": dashboard_path or "default",
                "card": card_config,
                "yaml": yaml_str,
                "error": str(err),
                "instruction": "Could not modify YAML dashboard file. Copy and paste the returned YAML into your Lovelace dashboard.",
            }

    if dashboard_storage is None or not hasattr(dashboard_storage, "async_save"):
        return {
            "success": False,
            "system_id": system_id,
            "dashboard_path": dashboard_path or "default",
            "card": card_config,
            "yaml": yaml_str,
            "error": "Lovelace storage dashboard was not found or is managed in YAML mode.",
            "instruction": "Copy and paste the returned YAML block into your Lovelace dashboard configuration.",
        }

    try:
        view_name = await _async_save_to_storage_dashboard(
            dashboard_storage, card_config, view_title
        )
        return {
            "success": True,
            "system_id": system_id,
            "dashboard_path": dashboard_path or "default",
            "view": view_name,
            "card": card_config,
            "yaml": yaml_str,
            "message": f"Successfully added Fuzzy System card for '{system_id}' to dashboard view '{view_name}'.",
        }
    except Exception as err:
        _LOGGER.warning("Could not auto-save to Lovelace dashboard: %s", err)
        return {
            "success": False,
            "system_id": system_id,
            "dashboard_path": dashboard_path or "default",
            "card": card_config,
            "yaml": yaml_str,
            "error": str(err),
            "instruction": "Automatic dashboard save failed. Copy and paste the returned YAML into your Lovelace dashboard.",
        }


def _list_systems(hass: HomeAssistant) -> ServiceResponse:
    """List summary of all fuzzy systems registered in Home Assistant."""
    domain_data = hass.data.get(DOMAIN, {})
    yaml_systems: dict[str, Any] = domain_data.get(DATA_YAML_SYSTEMS, {})
    entries: dict[str, Any] = domain_data.get(DATA_ENTRIES, {})

    systems: list[dict[str, Any]] = []

    for sys_id, sys_info in yaml_systems.items():
        cfg = sys_info.get("config", {})
        systems.append(
            {
                "system_id": sys_id,
                "name": cfg.get("name", sys_id),
                "description": cfg.get("description", ""),
                "source": SOURCE_YAML,
                "entry_id": None,
                "inference": cfg.get("inference", "mamdani"),
                "defuzzifier": cfg.get("defuzzifier", "cog"),
                "input_count": len(cfg.get(CONF_INPUTS, {})),
                "output_count": len(cfg.get(CONF_OUTPUTS, {})),
                "rule_count": len(cfg.get(CONF_RULES, [])),
                "inputs": list(cfg.get(CONF_INPUTS, {}).keys()),
                "outputs": list(cfg.get(CONF_OUTPUTS, {}).keys()),
            }
        )

    for entry_id, entry_info in entries.items():
        sys_id = entry_info.get("system_id", entry_id)
        cfg = entry_info.get("config", {})
        systems.append(
            {
                "system_id": sys_id,
                "name": cfg.get("name", sys_id),
                "description": cfg.get("description", ""),
                "source": SOURCE_CONFIG_ENTRY,
                "entry_id": entry_id,
                "inference": cfg.get("inference", "mamdani"),
                "defuzzifier": cfg.get("defuzzifier", "cog"),
                "input_count": len(cfg.get(CONF_INPUTS, {})),
                "output_count": len(cfg.get(CONF_OUTPUTS, {})),
                "rule_count": len(cfg.get(CONF_RULES, [])),
                "inputs": list(cfg.get(CONF_INPUTS, {}).keys()),
                "outputs": list(cfg.get(CONF_OUTPUTS, {}).keys()),
            }
        )

    systems.sort(key=lambda s: str(s.get("name", "")))
    return {"systems": systems, "count": len(systems)}


def _get_system(hass: HomeAssistant, system_id: str) -> ServiceResponse:
    """Retrieve full configuration and current outputs for a fuzzy system."""
    sys_data = get_system_data(hass, system_id)
    if not sys_data:
        raise ServiceValidationError(
            f"Fuzzy system '{system_id}' not found.",
            translation_domain=DOMAIN,
            translation_key="system_not_found",
            translation_placeholders={"system_id": system_id},
        )

    cfg = dict(sys_data.get("config", {}))
    live_inputs = _get_live_inputs(hass, cfg)
    engine: FuzzySystemEngine = sys_data["engine"]
    eval_results = engine.evaluate(live_inputs)

    outputs: dict[str, float] = {}
    dominant_terms: dict[str, str] = {}
    for out_name, out_data in eval_results.items():
        outputs[out_name] = out_data["defuzzified_value"]
        dominant_terms[out_name] = out_data["dominant_term"]

    return {
        "system_id": sys_data.get("system_id") or system_id,
        "name": cfg.get("name", system_id),
        "source": sys_data.get("source"),
        "entry_id": sys_data.get("entry_id"),
        "config": cfg,
        "live_inputs": live_inputs,
        "outputs": outputs,
        "dominant_terms": dominant_terms,
    }


async def _async_instantiate_template(
    hass: HomeAssistant,
    template_id: str,
    system_id: str,
    name: str | None = None,
    entity_mappings: dict[str, str] | None = None,
) -> ServiceResponse:
    """Instantiate a starter template and register it as a UI ConfigEntry."""
    try:
        sys_dict = instantiate_template(template_id, system_id)
        if name:
            sys_dict["name"] = name
    except Exception as err:
        raise ServiceValidationError(
            f"Failed to instantiate template '{template_id}': {err}",
            translation_domain=DOMAIN,
            translation_key="template_error",
        ) from err

    if entity_mappings and "inputs" in sys_dict:
        for var_name, ent_id in entity_mappings.items():
            if var_name in sys_dict["inputs"]:
                sys_dict["inputs"][var_name]["entity_id"] = ent_id

    flow_result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": config_entries.SOURCE_USER},
        data=sys_dict,
    )
    if flow_result.get("type") == FlowResultType.CREATE_ENTRY:
        entry = flow_result["result"]
        return {
            "success": True,
            "system_id": system_id,
            "entry_id": entry.entry_id,
            "message": f"Successfully created fuzzy system '{system_id}' from template '{template_id}'.",
        }

    errors = flow_result.get("errors") or flow_result.get("reason") or flow_result.get("type")
    raise ServiceValidationError(
        f"Could not create config entry for system '{system_id}': {errors}",
        translation_domain=DOMAIN,
        translation_key="entry_creation_failed",
    )


async def _handle_service_simulate(hass: HomeAssistant, call: ServiceCall) -> ServiceResponse:
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


async def _handle_service_explain(hass: HomeAssistant, call: ServiceCall) -> ServiceResponse:
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


async def _handle_service_add_to_dashboard(hass: HomeAssistant, call: ServiceCall) -> ServiceResponse:
    return await _async_add_to_dashboard(
        hass=hass,
        system_id=call.data["system_id"],
        dashboard_path=call.data.get("dashboard_path"),
        view_title=call.data.get("view_title"),
        card_title=call.data.get("card_title"),
        show_graph=call.data.get("show_graph", True),
        show_inputs=call.data.get("show_inputs", True),
        show_rules=call.data.get("show_rules", True),
    )


async def _handle_service_instantiate_template(hass: HomeAssistant, call: ServiceCall) -> ServiceResponse:
    return await _async_instantiate_template(
        hass=hass,
        template_id=call.data["template_id"],
        system_id=call.data["system_id"],
        name=call.data.get("name"),
        entity_mappings=call.data.get("entity_mappings"),
    )


def _make_service_callback(func, hass: HomeAssistant):
    """Wrap function or coroutine into an async service callback for Home Assistant."""

    async def _async_callback(call: ServiceCall) -> ServiceResponse:
        res = func(hass, call)
        if asyncio.iscoroutine(res):
            return await res
        return res

    return _async_callback


async def async_setup_services(hass: HomeAssistant) -> None:
    """Register MCP and automation actions for fuzzy systems."""
    hass.services.async_register(
        DOMAIN,
        SERVICE_SIMULATE,
        _make_service_callback(_handle_service_simulate, hass),
        schema=SIMULATE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_EXPLAIN,
        _make_service_callback(_handle_service_explain, hass),
        schema=EXPLAIN_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_LIST_SYSTEMS,
        _make_service_callback(lambda h, c: _list_systems(h), hass),
        schema=LIST_SYSTEMS_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_SYSTEM,
        _make_service_callback(lambda h, c: _get_system(h, c.data["system_id"]), hass),
        schema=GET_SYSTEM_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_GENERATE_CARD,
        _make_service_callback(
            lambda h, c: _generate_card_config(
                system_id=c.data["system_id"],
                title=c.data.get("title"),
                show_graph=c.data.get("show_graph", True),
                show_inputs=c.data.get("show_inputs", True),
                show_rules=c.data.get("show_rules", True),
            ),
            hass,
        ),
        schema=GENERATE_CARD_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_ADD_TO_DASHBOARD,
        _make_service_callback(_handle_service_add_to_dashboard, hass),
        schema=ADD_TO_DASHBOARD_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_LIST_TEMPLATES,
        _make_service_callback(lambda h, c: {"templates": get_templates()}, hass),
        schema=LIST_TEMPLATES_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_INSTANTIATE_TEMPLATE,
        _make_service_callback(_handle_service_instantiate_template, hass),
        schema=INSTANTIATE_TEMPLATE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    _LOGGER.info(
        "Registered Fuzzy System MCP/automation actions: simulate, explain, list_systems, get_system, generate_dashboard_card, add_to_dashboard, list_templates, instantiate_template"
    )
