"""Tests for the Fuzzy System diagnostics platform."""

import pytest
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.fuzzy_system.const import (
    CONF_DEFUZZIFIER,
    CONF_EXPOSE_SYSTEM_SENSOR,
    CONF_INFERENCE,
    CONF_INPUTS,
    CONF_NAME,
    CONF_OUTPUTS,
    CONF_RULES,
    CONF_SYSTEM_ID,
    DEF_COG,
    DOMAIN,
    INFERENCE_MAMDANI,
)
from custom_components.fuzzy_system.diagnostics import async_get_config_entry_diagnostics


@pytest.fixture
def mock_entry_data():
    """Mock config entry data for diagnostics test."""
    return {
        CONF_SYSTEM_ID: "diag_system",
        CONF_NAME: "Diagnostics Test System",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "temp": {
                "entity_id": "sensor.test_temp",
                "range": [0.0, 100.0],
                "default": 20.0,
                "terms": {
                    "low": {"type": "trimf", "params": [0, 0, 50]},
                    "high": {"type": "trimf", "params": [50, 100, 100]},
                },
            }
        },
        CONF_OUTPUTS: {
            "power": {
                "range": [0.0, 100.0],
                "defuzzifier": "cog",
                "terms": {
                    "low": {"type": "trimf", "params": [0, 0, 50]},
                    "high": {"type": "trimf", "params": [50, 100, 100]},
                },
            }
        },
        CONF_RULES: ["IF temp IS low THEN power IS high"],
    }


async def test_diagnostics(
    hass: HomeAssistant, enable_custom_integrations: None, mock_entry_data: dict
) -> None:
    """Test generating diagnostics dictionary for a configured entry."""
    hass.states.async_set("sensor.test_temp", "22.5")

    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="diag_system",
        title="Diagnostics Test System",
        data=mock_entry_data,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    diag = await async_get_config_entry_diagnostics(hass, entry)

    assert "entry" in diag
    assert diag["entry"]["entry_id"] == entry.entry_id
    assert diag["entry"]["title"] == "Diagnostics Test System"
    assert "data" in diag["entry"]

    assert "engine" in diag
    engine_diag = diag["engine"]
    assert engine_diag["system_id"] == "diag_system"
    assert engine_diag["inference"] == INFERENCE_MAMDANI
    assert engine_diag["defuzzifier"] == DEF_COG
    assert engine_diag["rule_count"] == 1
    assert "temp" in engine_diag["inputs"]
    assert engine_diag["inputs"]["temp"]["state"] == "22.5"
    assert engine_diag["inputs"]["temp"]["entity_id"] == "sensor.test_temp"
    assert "power" in engine_diag["outputs"]
    assert engine_diag["outputs"]["power"]["defuzzifier"] == "cog"
