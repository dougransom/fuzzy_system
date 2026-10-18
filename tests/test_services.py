"""Tests for Fuzzy System MCP actions / services (simulate and explain)."""

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.fuzzy_system.const import (
    CONF_DEFUZZIFIER,
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


@pytest.fixture
def sample_service_config():
    """Sample YAML configuration for service tests."""
    return {
        DOMAIN: {
            "systems": {
                "thermostat": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "temperature": {
                            "entity_id": "sensor.room_temperature",
                            "range": [15.0, 30.0],
                            "terms": {
                                "cold": {"type": "trimf", "params": [15, 15, 22.5]},
                                "hot": {"type": "trimf", "params": [22.5, 30, 30]},
                            },
                            "default": 20.0,
                        }
                    },
                    "outputs": {
                        "cooling": {
                            "range": [0.0, 100.0],
                            "terms": {
                                "off": {"type": "trimf", "params": [0, 0, 50]},
                                "high": {"type": "trimf", "params": [50, 100, 100]},
                            },
                        }
                    },
                    "rules": [
                        "IF temperature IS hot THEN cooling IS high",
                        "IF temperature IS cold THEN cooling IS off",
                    ],
                }
            }
        }
    }


async def test_simulate_service_yaml_system(
    hass: HomeAssistant, enable_custom_integrations, sample_service_config
) -> None:
    """Test fuzzy_system.simulate action on a YAML system."""
    assert await async_setup_component(hass, DOMAIN, sample_service_config)
    await hass.async_block_till_done()

    # Simulate hypothetical cold temperature
    response = await hass.services.async_call(
        DOMAIN,
        "simulate",
        {"system_id": "thermostat", "inputs": {"temperature": 16.0}},
        blocking=True,
        return_response=True,
    )

    assert response is not None
    assert response["system_id"] == "thermostat"
    assert "cooling" in response["outputs"]
    assert response["outputs"]["cooling"] < 35.0
    assert response["dominant_terms"]["cooling"] == "off"
    assert len(response["rule_strengths"]) == 2
    assert "Fuzzy system 'thermostat' simulated" in response["summary"]


async def test_explain_service_yaml_system(
    hass: HomeAssistant, enable_custom_integrations, sample_service_config
) -> None:
    """Test fuzzy_system.explain action on a YAML system with live entity states."""
    assert await async_setup_component(hass, DOMAIN, sample_service_config)
    await hass.async_block_till_done()

    # Set room temperature to hot
    hass.states.async_set("sensor.room_temperature", "28.5")
    await hass.async_block_till_done()

    response = await hass.services.async_call(
        DOMAIN,
        "explain",
        {"system_id": "thermostat"},
        blocking=True,
        return_response=True,
    )

    assert response is not None
    assert response["system_id"] == "thermostat"
    assert response["live_inputs"]["temperature"] == 28.5
    assert response["outputs"]["cooling"] > 65.0
    assert response["dominant_terms"]["cooling"] == "high"
    assert len(response["active_rules"]) >= 1
    assert "cooling is high" in response["active_rules"][0]["rule"].lower()
    assert "temperature: 28.5" in response["explanation"]


async def test_simulate_service_config_entry_system(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test fuzzy_system.simulate action on a UI ConfigEntry system."""
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()

    entry_data = {
        CONF_SYSTEM_ID: "ui_pump",
        CONF_NAME: "UI Water Pump",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_INPUTS: {
            "level": {
                "entity_id": "sensor.water_level",
                "range": [0.0, 100.0],
                "terms": {
                    "low": {"type": "trimf", "params": [0, 0, 50]},
                    "high": {"type": "trimf", "params": [50, 100, 100]},
                },
            }
        },
        CONF_OUTPUTS: {
            "pump": {
                "range": [0.0, 100.0],
                "terms": {
                    "idle": {"type": "trimf", "params": [0, 0, 50]},
                    "active": {"type": "trimf", "params": [50, 100, 100]},
                },
            }
        },
        CONF_RULES: [
            "IF level IS high THEN pump IS active",
            "IF level IS low THEN pump IS idle",
        ],
    }

    mock_entry = MockConfigEntry(domain=DOMAIN, data=entry_data, unique_id="ui_pump_123")
    mock_entry.add_to_hass(hass)
    await hass.config_entries.async_setup(mock_entry.entry_id)
    await hass.async_block_till_done()

    response = await hass.services.async_call(
        DOMAIN,
        "simulate",
        {"system_id": "ui_pump", "inputs": {"level": 85.0}},
        blocking=True,
        return_response=True,
    )

    assert response is not None
    assert response["system_id"] == "ui_pump"
    assert response["outputs"]["pump"] > 60.0
    assert response["dominant_terms"]["pump"] == "active"


async def test_service_invalid_system_id(
    hass: HomeAssistant, enable_custom_integrations, sample_service_config
) -> None:
    """Test error handling when system_id is not found."""
    assert await async_setup_component(hass, DOMAIN, sample_service_config)
    await hass.async_block_till_done()

    with pytest.raises(HomeAssistantError, match="Fuzzy system 'non_existent' not found"):
        await hass.services.async_call(
            DOMAIN,
            "simulate",
            {"system_id": "non_existent", "inputs": {"temperature": 20.0}},
            blocking=True,
            return_response=True,
        )
