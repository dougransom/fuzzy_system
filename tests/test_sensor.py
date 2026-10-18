"""Integration tests for the Fuzzy System sensor platform."""

import pytest
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.setup import async_setup_component
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


async def test_fuzzy_sensor_metadata(hass: HomeAssistant, enable_custom_integrations):
    """Test setting custom name, icon, and unit_of_measurement on output sensors."""
    meta_config = {
        DOMAIN: {
            "systems": {
                "climate": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "temp": {
                            "entity_id": "sensor.test_temp",
                            "range": [0.0, 40.0],
                            "terms": {
                                "low": {"type": "trimf", "params": [0, 0, 20]},
                                "high": {"type": "trimf", "params": [20, 40, 40]},
                            },
                        }
                    },
                    "outputs": {
                        "speed": {
                            "name": "Custom Fan Speed",
                            "icon": "mdi:fan",
                            "unit_of_measurement": "%",
                            "range": [0.0, 100.0],
                            "terms": {
                                "slow": {"type": "trimf", "params": [0, 0, 50]},
                                "fast": {"type": "trimf", "params": [50, 100, 100]},
                            },
                        }
                    },
                    "rules": [
                        "IF temp IS high THEN speed IS fast",
                        "IF temp IS low THEN speed IS slow",
                    ],
                }
            }
        }
    }

    hass.states.async_set("sensor.test_temp", "35.0")
    assert await async_setup_component(hass, DOMAIN, meta_config)
    await hass.async_block_till_done()

    # The custom name creates sensor.custom_fan_speed
    state = hass.states.get("sensor.custom_fan_speed")
    assert state is not None
    assert state.attributes.get("friendly_name") == "Custom Fan Speed"
    assert state.attributes.get("icon") == "mdi:fan"
    assert state.attributes.get("unit_of_measurement") == "%"

    set_state = hass.states.get("sensor.custom_fan_speed_set")
    assert set_state is not None
    assert set_state.attributes.get("friendly_name") == "Custom Fan Speed Set"
    assert set_state.attributes.get("icon") == "mdi:chart-bell-curve-cumulative"


async def test_fuzzy_system_reload_service(hass: HomeAssistant, enable_custom_integrations):
    """Test that the reload service is registered and can be called."""
    base_config = {
        DOMAIN: {
            "systems": {
                "thermostat": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "temp": {
                            "entity_id": "sensor.reload_temp",
                            "range": [0.0, 50.0],
                            "terms": {
                                "cold": {"type": "trimf", "params": [0, 0, 25]},
                                "hot": {"type": "trimf", "params": [25, 50, 50]},
                            },
                        }
                    },
                    "outputs": {
                        "power": {
                            "range": [0.0, 100.0],
                            "terms": {
                                "low": {"type": "trimf", "params": [0, 0, 50]},
                                "high": {"type": "trimf", "params": [50, 100, 100]},
                            },
                        }
                    },
                    "rules": ["IF temp IS hot THEN power IS high"],
                }
            }
        }
    }

    hass.states.async_set("sensor.reload_temp", "40.0")
    assert await async_setup_component(hass, DOMAIN, base_config)
    await hass.async_block_till_done()

    assert hass.services.has_service(DOMAIN, "reload")

    from unittest.mock import patch

    # 1. Successful reload
    with patch(
        "custom_components.fuzzy_system.async_integration_yaml_config",
        return_value=base_config,
    ):
        await hass.services.async_call(DOMAIN, "reload", blocking=True)
        await hass.async_block_till_done()

    # 2. Empty reload config
    with patch(
        "custom_components.fuzzy_system.async_integration_yaml_config",
        return_value=None,
    ):
        await hass.services.async_call(DOMAIN, "reload", blocking=True)
        await hass.async_block_till_done()


async def test_sensor_rate_limiter_and_status_unavailable(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test rate limiter 0 budget and system status sensor with unavailable input."""
    from custom_components.fuzzy_system.sensor import SystemRateLimiter

    rl = SystemRateLimiter(max_updates=0, period=0.0)
    assert rl.can_update() is True

    # Setup system where input entity is unavailable
    bad_config = {
        DOMAIN: {
            "systems": {
                "faulty_sys": {
                    "inference": "mamdani",
                    "inputs": {
                        "t": {
                            "entity_id": "sensor.missing_temp",
                            "range": [0, 40],
                            "terms": {"warm": {"type": "trimf", "params": [10, 20, 30]}},
                        }
                    },
                    "outputs": {
                        "fan": {
                            "range": [0, 100],
                            "terms": {"fast": {"type": "trimf", "params": [0, 50, 100]}},
                        }
                    },
                    "rules": ["IF t IS warm THEN fan IS fast"],
                }
            }
        }
    }
    hass.states.async_set("sensor.missing_temp", "unavailable")
    assert await async_setup_component(hass, DOMAIN, bad_config)
    await hass.async_block_till_done()

    status_state = hass.states.get("sensor.fuzzy_system_faulty_sys")
    assert status_state is not None
    assert status_state.state == "Input Unavailable"


async def test_config_entry_sensor_lifecycle(hass: HomeAssistant, enable_custom_integrations):
    """Test full sensor entity lifecycle driven by a ConfigEntry."""
    hass.states.async_set("sensor.office_temperature", "29.0")

    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="office_comfort",
        title="Office Comfort",
        data={
            CONF_SYSTEM_ID: "office_comfort",
            CONF_NAME: "Office Comfort",
            CONF_INFERENCE: INFERENCE_MAMDANI,
            CONF_DEFUZZIFIER: DEF_COG,
            CONF_EXPOSE_SYSTEM_SENSOR: True,
            CONF_INPUTS: {
                "temperature": {
                    "entity_id": "sensor.office_temperature",
                    "range": [15.0, 35.0],
                    "terms": {
                        "cool": {"type": "trimf", "params": [15, 15, 22]},
                        "hot": {"type": "trimf", "params": [24, 35, 35]},
                    },
                }
            },
            CONF_OUTPUTS: {
                "fan": {
                    "range": [0.0, 100.0],
                    "terms": {
                        "low": {"type": "trimf", "params": [0, 0, 50]},
                        "high": {"type": "trimf", "params": [50, 100, 100]},
                    },
                }
            },
            CONF_RULES: [
                "IF temperature IS hot THEN fan IS high",
                "IF temperature IS cool THEN fan IS low",
            ],
        },
    )
    entry.add_to_hass(hass)

    # Set up integration entry
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Output sensor verification
    out_state = hass.states.get("sensor.fuzzy_office_comfort_fan")
    assert out_state is not None
    assert float(out_state.state) > 60.0

    # Set sensor verification
    set_state = hass.states.get("sensor.fuzzy_office_comfort_fan_set")
    assert set_state is not None
    assert set_state.state == "high"

    # Status sensor verification
    status_state = hass.states.get("sensor.fuzzy_system_office_comfort")
    assert status_state is not None
    assert status_state.state == "OK"
    assert status_state.attributes["active_rule_count"] == 1

    # Reactivity: change input temperature to cool (18 C)
    hass.states.async_set("sensor.office_temperature", "18.0")
    await hass.async_block_till_done()

    updated_out = hass.states.get("sensor.fuzzy_office_comfort_fan")
    assert float(updated_out.state) < 40.0
    updated_set = hass.states.get("sensor.fuzzy_office_comfort_fan_set")
    assert updated_set.state == "low"

    # Unload entry: sensors should be removed/unloaded
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()

    unloaded_out = hass.states.get("sensor.fuzzy_office_comfort_fan")
    assert unloaded_out.state == "unavailable"


async def test_missing_input_entity_repair_issue_lifecycle(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test that missing input entities generate repair issues and clear when resolved."""
    issue_registry = ir.async_get(hass)

    config_data = {
        CONF_SYSTEM_ID: "repair_test",
        CONF_NAME: "Repair Test",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "temp": {
                "entity_id": "sensor.uncreated_temperature",
                "range": [0.0, 50.0],
                "default": 25.0,
                "terms": {
                    "low": {"type": "trimf", "params": [0, 0, 25]},
                    "high": {"type": "trimf", "params": [25, 50, 50]},
                },
            }
        },
        CONF_OUTPUTS: {
            "cooling": {
                "range": [0.0, 100.0],
                "terms": {
                    "off": {"type": "trimf", "params": [0, 0, 50]},
                    "on": {"type": "trimf", "params": [50, 100, 100]},
                },
            }
        },
        CONF_RULES: ["IF temp IS high THEN cooling IS on"],
    }

    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="repair_test",
        title="Repair Test",
        data=config_data,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    # Issue should exist for sensor.uncreated_temperature
    issue_id = "missing_input_repair_test_sensor.uncreated_temperature"
    assert issue_registry.async_get_issue(DOMAIN, issue_id) is not None

    # Now create the entity with a state update
    hass.states.async_set("sensor.uncreated_temperature", "30.0")
    await hass.async_block_till_done()

    # Issue should now be resolved/deleted
    assert issue_registry.async_get_issue(DOMAIN, issue_id) is None


async def test_diagnostic_entity_categories(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test that set sensors and status sensors are tagged with EntityCategory.DIAGNOSTIC."""
    from homeassistant.helpers import entity_registry as er

    hass.states.async_set("sensor.office_temperature", "22.0")
    config_data = {
        CONF_SYSTEM_ID: "cat_test",
        CONF_NAME: "Cat Test",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "temp": {
                "entity_id": "sensor.office_temperature",
                "range": [0.0, 50.0],
                "default": 20.0,
                "terms": {
                    "low": {"type": "trimf", "params": [0, 0, 25]},
                    "high": {"type": "trimf", "params": [25, 50, 50]},
                },
            }
        },
        CONF_OUTPUTS: {
            "cooling": {
                "range": [0.0, 100.0],
                "terms": {
                    "off": {"type": "trimf", "params": [0, 0, 50]},
                    "on": {"type": "trimf", "params": [50, 100, 100]},
                },
            }
        },
        CONF_RULES: ["IF temp IS high THEN cooling IS on"],
    }

    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="cat_test",
        title="Cat Test",
        data=config_data,
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    ent_reg = er.async_get(hass)
    # Output sensor is normal
    output_entry = ent_reg.async_get("sensor.fuzzy_cat_test_cooling")
    assert output_entry is not None
    assert output_entry.entity_category is None

    # Set sensor is DIAGNOSTIC
    set_entry = ent_reg.async_get("sensor.fuzzy_cat_test_cooling_set")
    assert set_entry is not None
    assert set_entry.entity_category == EntityCategory.DIAGNOSTIC

    # Status sensor is DIAGNOSTIC
    status_entry = ent_reg.async_get("sensor.fuzzy_system_cat_test")
    assert status_entry is not None
    assert status_entry.entity_category == EntityCategory.DIAGNOSTIC

