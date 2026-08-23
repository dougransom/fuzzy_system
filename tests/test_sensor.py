"""Integration tests for the Fuzzy System sensor platform."""

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.fuzzy_system.const import DOMAIN


@pytest.fixture
def sample_config():
    """Sample YAML configuration for Fuzzy System component."""
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


async def test_fuzzy_sensor_setup(hass: HomeAssistant, enable_custom_integrations, sample_config):
    """Test setting up fuzzy system sensors and updating state on input changes."""
    # Set initial state for room temperature sensor
    hass.states.async_set("sensor.room_temperature", "28.0")

    # Set up component
    assert await async_setup_component(hass, DOMAIN, sample_config)
    await hass.async_block_till_done()

    # Get defuzzified output entity
    state = hass.states.get("sensor.fuzzy_thermostat_cooling")
    assert state is not None
    assert float(state.state) > 50.0  # Cooling should be high for 28 deg C

    # Get pre-defuzzified set entity
    set_state = hass.states.get("sensor.fuzzy_thermostat_cooling_set")
    assert set_state is not None
    assert set_state.state == "high"

    # Verify state attributes
    attrs = state.attributes
    assert attrs["system"] == "thermostat"
    assert attrs["inference_type"] == "mamdani"
    assert attrs["defuzzifier"] == "cog"
    assert attrs["dominant_term"] == "high"
    assert "term_activations" in attrs
    assert "term_memberships" in attrs
    assert "rule_strengths" in attrs

    # Change temperature input to cold (16 deg C)
    hass.states.async_set("sensor.room_temperature", "16.0")
    await hass.async_block_till_done()

    # Check updated defuzzified state & set state
    updated_state = hass.states.get("sensor.fuzzy_thermostat_cooling")
    assert float(updated_state.state) < 50.0

    updated_set_state = hass.states.get("sensor.fuzzy_thermostat_cooling_set")
    assert updated_set_state is not None
    assert updated_set_state.state == "off"


async def test_fan_simulator_setup(hass: HomeAssistant, enable_custom_integrations):
    """Test fan simulator system with multi-input fuzzy logic."""
    fan_config = {
        DOMAIN: {
            "systems": {
                "fan_simulator": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "temperature": {
                            "entity_id": "input_number.sim_room_temperature",
                            "range": [15, 35],
                            "terms": {
                                "cold": {"type": "trimf", "params": [15, 15, 22]},
                                "hot": {"type": "trimf", "params": [26, 35, 35]},
                            },
                        },
                        "humidity": {
                            "entity_id": "input_number.sim_room_humidity",
                            "range": [20, 90],
                            "terms": {
                                "dry": {"type": "trapmf", "params": [20, 20, 35, 45]},
                                "humid": {"type": "trapmf", "params": [65, 75, 90, 90]},
                            },
                        },
                    },
                    "outputs": {
                        "fan_speed": {
                            "range": [0, 100],
                            "terms": {
                                "off": {"type": "trimf", "params": [0, 0, 25]},
                                "high": {"type": "trimf", "params": [75, 100, 100]},
                            },
                        }
                    },
                    "rules": [
                        "IF temperature IS cold AND humidity IS dry THEN fan_speed IS off",
                        "IF temperature IS hot OR humidity IS humid THEN fan_speed IS high",
                    ],
                }
            }
        }
    }

    # Set hot temperature (32 C) and humid (80%)
    hass.states.async_set("input_number.sim_room_temperature", "32.0")
    hass.states.async_set("input_number.sim_room_humidity", "80.0")

    assert await async_setup_component(hass, DOMAIN, fan_config)
    await hass.async_block_till_done()

    # Output should be high
    speed_state = hass.states.get("sensor.fuzzy_fan_simulator_fan_speed")
    assert speed_state is not None
    assert float(speed_state.state) > 70.0

    set_state = hass.states.get("sensor.fuzzy_fan_simulator_fan_speed_set")
    assert set_state is not None
    assert set_state.state == "high"

    # Verify System Status Sensor
    sys_status = hass.states.get("sensor.fuzzy_system_fan_simulator")
    assert sys_status is not None
    assert sys_status.state == "OK"
    assert sys_status.attributes["rule_count"] == 2
    assert sys_status.attributes["active_rule_count"] == 1
    assert "outputs" in sys_status.attributes
    assert sys_status.attributes["outputs"]["fan_speed"] > 70.0
