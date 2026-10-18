"""Diagnostics support for the Fuzzy System integration."""

from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from . import FuzzyConfigEntry
from .const import CONF_INPUTS

TO_REDACT: set[str] = set()


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: FuzzyConfigEntry
) -> dict[str, Any]:
    """Return diagnostics for a fuzzy system config entry."""
    data = entry.runtime_data
    engine = data.engine
    config_inputs = data.config.get(CONF_INPUTS, {})

    inputs_diag: dict[str, Any] = {}
    for var_name, var in engine.input_vars.items():
        var_cfg = config_inputs.get(var_name, {})
        entity_id = var_cfg.get("entity_id")
        state = hass.states.get(entity_id) if entity_id else None
        inputs_diag[var_name] = {
            "entity_id": entity_id,
            "range": [var.min_val, var.max_val],
            "resolution": var.resolution,
            "state": state.state if state else None,
            "terms": {
                term_name: {
                    "type": term.mf_type,
                    "params": list(term.params),
                    "hedge": term.hedge,
                }
                for term_name, term in var.terms.items()
            },
        }

    outputs_diag: dict[str, Any] = {}
    for out_name, out_var in engine.output_vars.items():
        outputs_diag[out_name] = {
            "range": [out_var.min_val, out_var.max_val],
            "resolution": out_var.resolution,
            "defuzzifier": out_var.defuzzifier or engine.defuzzifier,
            "terms": {
                term_name: {
                    "type": term.mf_type,
                    "params": list(term.params),
                    "hedge": term.hedge,
                }
                for term_name, term in out_var.terms.items()
            },
        }

    return {
        "entry": {
            "entry_id": entry.entry_id,
            "title": entry.title,
            "data": async_redact_data(dict(entry.data), TO_REDACT),
        },
        "engine": {
            "system_id": data.system_id,
            "inference": engine.inference_type,
            "defuzzifier": engine.defuzzifier,
            "rule_count": len(engine.rules),
            "rules": [str(rule) for rule in engine.rules],
            "inputs": inputs_diag,
            "outputs": outputs_diag,
        },
    }
