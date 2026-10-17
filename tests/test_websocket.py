"""Tests for Fuzzy System WebSocket API commands."""


from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.fuzzy_system.const import (
    CONF_DEFUZZIFIER,
    CONF_DESCRIPTION,
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
    SOURCE_CONFIG_ENTRY,
    SOURCE_YAML,
    WS_TYPE_DELETE_SYSTEM,
    WS_TYPE_GET_SYSTEM,
    WS_TYPE_INSTANTIATE_TEMPLATE,
    WS_TYPE_LIST_SYSTEMS,
    WS_TYPE_LIST_TEMPLATES,
    WS_TYPE_SAVE_SYSTEM,
    WS_TYPE_SIMULATE,
)


async def test_ws_list_systems(
    hass: HomeAssistant, enable_custom_integrations, hass_ws_client
) -> None:
    """Test listing systems returns both YAML and ConfigEntry sources."""
    yaml_config = {
        DOMAIN: {
            "systems": {
                "yaml_thermostat": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "temp": {
                            "entity_id": "sensor.temp",
                            "range": [10.0, 30.0],
                            "terms": {
                                "cold": {"type": "trimf", "params": [10, 10, 20]},
                            },
                        }
                    },
                    "outputs": {
                        "heat": {
                            "range": [0.0, 100.0],
                            "terms": {
                                "on": {"type": "trimf", "params": [0, 100, 100]},
                            },
                        }
                    },
                    "rules": ["IF temp IS cold THEN heat IS on"],
                }
            }
        }
    }
    assert await async_setup_component(hass, DOMAIN, yaml_config)
    await hass.async_block_till_done()

    # Add a ConfigEntry
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="ui_fan",
        title="UI Fan",
        data={
            CONF_SYSTEM_ID: "ui_fan",
            CONF_NAME: "UI Fan",
            CONF_DESCRIPTION: "Visual fan controller",
            CONF_INFERENCE: INFERENCE_MAMDANI,
            CONF_DEFUZZIFIER: DEF_COG,
            CONF_EXPOSE_SYSTEM_SENSOR: True,
            CONF_INPUTS: {
                "humidity": {
                    "entity_id": "sensor.humidity",
                    "range": [0.0, 100.0],
                    "terms": {
                        "high": {"type": "trimf", "params": [60, 100, 100]},
                    },
                }
            },
            CONF_OUTPUTS: {
                "speed": {
                    "range": [0.0, 100.0],
                    "terms": {
                        "fast": {"type": "trimf", "params": [50, 100, 100]},
                    },
                }
            },
            CONF_RULES: ["IF humidity IS high THEN speed IS fast"],
        },
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": WS_TYPE_LIST_SYSTEMS})
    msg = await client.receive_json()

    assert msg["success"]
    result = msg["result"]
    assert len(result) == 2

    by_id = {item["system_id"]: item for item in result}
    assert "yaml_thermostat" in by_id
    assert by_id["yaml_thermostat"]["source"] == SOURCE_YAML
    assert by_id["yaml_thermostat"]["entry_id"] is None
    assert by_id["yaml_thermostat"]["rule_count"] == 1

    assert "ui_fan" in by_id
    assert by_id["ui_fan"]["source"] == SOURCE_CONFIG_ENTRY
    assert by_id["ui_fan"]["entry_id"] == entry.entry_id
    assert by_id["ui_fan"]["rule_count"] == 1


async def test_ws_get_system(
    hass: HomeAssistant, enable_custom_integrations, hass_ws_client
) -> None:
    """Test retrieving system configuration by system_id or entry_id."""
    yaml_config = {
        DOMAIN: {
            "systems": {
                "yaml_sys": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "t": {
                            "entity_id": "sensor.t",
                            "range": [0, 10],
                            "terms": {"c": {"type": "trimf", "params": [0, 0, 5]}},
                        }
                    },
                    "outputs": {
                        "o": {
                            "range": [0, 10],
                            "terms": {"h": {"type": "trimf", "params": [5, 10, 10]}},
                        }
                    },
                    "rules": ["IF t IS c THEN o IS h"],
                }
            }
        }
    }
    assert await async_setup_component(hass, DOMAIN, yaml_config)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)

    # 1. Get YAML system by system_id
    await client.send_json({"id": 2, "type": WS_TYPE_GET_SYSTEM, "system_id": "yaml_sys"})
    msg = await client.receive_json()
    assert msg["success"]
    assert msg["result"]["system_id"] == "yaml_sys"
    assert msg["result"]["source"] == SOURCE_YAML

    # 2. Get non-existent system
    await client.send_json({"id": 3, "type": WS_TYPE_GET_SYSTEM, "system_id": "non_existent"})
    msg_err = await client.receive_json()
    assert not msg_err["success"]
    assert msg_err["error"]["code"] == "not_found"

    # 3. Missing arguments
    await client.send_json({"id": 4, "type": WS_TYPE_GET_SYSTEM})
    msg_inval = await client.receive_json()
    assert not msg_inval["success"]
    assert msg_inval["error"]["code"] == "invalid_parameters"


async def test_ws_save_system_create_and_delete(
    hass: HomeAssistant, enable_custom_integrations, hass_ws_client
) -> None:
    """Test saving a new system via WebSocket and subsequently deleting it."""
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)

    save_payload = {
        "id": 10,
        "type": WS_TYPE_SAVE_SYSTEM,
        CONF_SYSTEM_ID: "greenhouse_vent",
        CONF_NAME: "Greenhouse Ventilation",
        CONF_DESCRIPTION: "Automatic greenhouse roof vents",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "temperature": {
                "entity_id": "sensor.greenhouse_temp",
                "range": [10.0, 45.0],
                "terms": {
                    "warm": {"type": "trimf", "params": [18.0, 25.0, 32.0]},
                    "hot": {"type": "trimf", "params": [28.0, 45.0, 45.0]},
                },
            }
        },
        CONF_OUTPUTS: {
            "vent_angle": {
                "name": "Vent Opening Angle",
                "range": [0.0, 90.0],
                "terms": {
                    "closed": {"type": "trimf", "params": [0.0, 0.0, 20.0]},
                    "open": {"type": "trimf", "params": [40.0, 90.0, 90.0]},
                },
            }
        },
        CONF_RULES: ["IF temperature IS hot THEN vent_angle IS open"],
    }

    # Save new system
    await client.send_json(save_payload)
    res = await client.receive_json()
    assert res["success"]
    entry_id = res["result"]["entry_id"]
    assert res["result"]["system_id"] == "greenhouse_vent"

    # Verify sensor entity created dynamically in Home Assistant
    state = hass.states.get("sensor.vent_opening_angle")
    assert state is not None
    assert state.attributes.get("friendly_name") == "Vent Opening Angle"

    # Delete system
    await client.send_json({"id": 11, "type": WS_TYPE_DELETE_SYSTEM, "entry_id": entry_id})
    del_res = await client.receive_json()
    assert del_res["success"]

    # Verify entity is cleaned up
    state_after = hass.states.get("sensor.vent_opening_angle")
    assert state_after is None


async def test_ws_save_system_yaml_locked(
    hass: HomeAssistant, enable_custom_integrations, hass_ws_client
) -> None:
    """Test that saving a system with an ID matching a YAML system is rejected."""
    yaml_config = {
        DOMAIN: {
            "systems": {
                "locked_yaml": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "x": {
                            "entity_id": "sensor.x",
                            "range": [0, 10],
                            "terms": {"t": {"type": "trimf", "params": [0, 5, 10]}},
                        }
                    },
                    "outputs": {
                        "y": {
                            "range": [0, 10],
                            "terms": {"t": {"type": "trimf", "params": [0, 5, 10]}},
                        }
                    },
                    "rules": ["IF x IS t THEN y IS t"],
                }
            }
        }
    }
    assert await async_setup_component(hass, DOMAIN, yaml_config)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)

    await client.send_json(
        {
            "id": 20,
            "type": WS_TYPE_SAVE_SYSTEM,
            CONF_SYSTEM_ID: "locked_yaml",
            CONF_INPUTS: {
                "x": {
                    "range": [0, 10],
                    "terms": {"t": {"type": "trimf", "params": [0, 5, 10]}},
                }
            },
            CONF_OUTPUTS: {
                "y": {
                    "range": [0, 10],
                    "terms": {"t": {"type": "trimf", "params": [0, 5, 10]}},
                }
            },
            CONF_RULES: ["IF x IS t THEN y IS t"],
        }
    )
    res = await client.receive_json()
    assert not res["success"]
    assert res["error"]["code"] == "yaml_locked"


async def test_ws_save_system_update(
    hass: HomeAssistant, enable_custom_integrations, hass_ws_client
) -> None:
    """Test updating an existing config entry via WebSocket save endpoint."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="updatable_sys",
        title="Original Title",
        data={
            CONF_SYSTEM_ID: "updatable_sys",
            CONF_NAME: "Original Title",
            CONF_INFERENCE: INFERENCE_MAMDANI,
            CONF_DEFUZZIFIER: DEF_COG,
            CONF_INPUTS: {
                "x": {
                    "entity_id": "sensor.x",
                    "range": [0, 10],
                    "terms": {"t": {"type": "trimf", "params": [0, 5, 10]}},
                }
            },
            CONF_OUTPUTS: {
                "y": {
                    "range": [0, 10],
                    "terms": {"t": {"type": "trimf", "params": [0, 5, 10]}},
                }
            },
            CONF_RULES: ["IF x IS t THEN y IS t"],
        },
    )
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)

    await client.send_json(
        {
            "id": 30,
            "type": WS_TYPE_SAVE_SYSTEM,
            "entry_id": entry.entry_id,
            CONF_SYSTEM_ID: "updatable_sys",
            CONF_NAME: "Updated Title",
            CONF_DESCRIPTION: "Now with two rules",
            CONF_INFERENCE: INFERENCE_MAMDANI,
            CONF_DEFUZZIFIER: DEF_COG,
            CONF_INPUTS: {
                "x": {
                    "entity_id": "sensor.x",
                    "range": [0, 10],
                    "terms": {
                        "t1": {"type": "trimf", "params": [0, 0, 5]},
                        "t2": {"type": "trimf", "params": [5, 10, 10]},
                    },
                }
            },
            CONF_OUTPUTS: {
                "y": {
                    "range": [0, 10],
                    "terms": {
                        "o1": {"type": "trimf", "params": [0, 0, 5]},
                        "o2": {"type": "trimf", "params": [5, 10, 10]},
                    },
                }
            },
            CONF_RULES: [
                "IF x IS t1 THEN y IS o1",
                "IF x IS t2 THEN y IS o2",
            ],
        }
    )
    res = await client.receive_json()
    assert res["success"]
    assert res["result"]["entry_id"] == entry.entry_id

    # Verify entry data updated
    updated_entry = hass.config_entries.async_get_entry(entry.entry_id)
    assert updated_entry.title == "Updated Title"
    assert len(updated_entry.data[CONF_RULES]) == 2


async def test_ws_simulate(
    hass: HomeAssistant, enable_custom_integrations, hass_ws_client
) -> None:
    """Test dry-run simulation WebSocket endpoint."""
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)

    sim_payload = {
        "id": 40,
        "type": WS_TYPE_SIMULATE,
        "system_config": {
            "inference": "mamdani",
            "defuzzifier": "cog",
            "inputs": {
                "temp": {
                    "range": [10.0, 35.0],
                    "terms": {
                        "cool": {"type": "trimf", "params": [10, 10, 22]},
                        "hot": {"type": "trimf", "params": [22, 35, 35]},
                    },
                }
            },
            "outputs": {
                "fan": {
                    "range": [0.0, 100.0],
                    "terms": {
                        "low": {"type": "trimf", "params": [0, 0, 50]},
                        "high": {"type": "trimf", "params": [50, 100, 100]},
                    },
                }
            },
            "rules": [
                "IF temp IS hot THEN fan IS high",
                "IF temp IS cool THEN fan IS low",
            ],
        },
        "inputs": {"temp": 30.0},
    }

    await client.send_json(sim_payload)
    res = await client.receive_json()

    assert res["success"]
    sim_data = res["result"]
    assert "defuzzified_values" in sim_data
    assert sim_data["defuzzified_values"]["fan"] > 50.0
    assert sim_data["dominant_terms"]["fan"] == "high"
    assert len(sim_data["rule_strengths"]) == 2
    assert "explainability" in sim_data


async def test_ws_templates(
    hass: HomeAssistant, enable_custom_integrations, hass_ws_client
) -> None:
    """Test listing templates and instantiating a template."""
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()

    client = await hass_ws_client(hass)

    # 1. List templates
    await client.send_json({"id": 50, "type": WS_TYPE_LIST_TEMPLATES})
    list_res = await client.receive_json()
    assert list_res["success"]
    templates = list_res["result"]
    assert len(templates) == 4
    template_ids = [t["template_id"] for t in templates]
    assert "smart_fan_controller" in template_ids
    assert "iaq_ventilation" in template_ids
    assert "intelligent_irrigation" in template_ids
    assert "solar_excess_diversion" in template_ids

    # 2. Instantiate template
    await client.send_json(
        {
            "id": 51,
            "type": WS_TYPE_INSTANTIATE_TEMPLATE,
            "template_id": "smart_fan_controller",
            CONF_SYSTEM_ID: "master_bedroom_fan",
        }
    )
    inst_res = await client.receive_json()
    assert inst_res["success"]
    config = inst_res["result"]
    assert config[CONF_SYSTEM_ID] == "master_bedroom_fan"
    assert "occupancy_probability" in config[CONF_INPUTS]
    assert "fan_speed" in config[CONF_OUTPUTS]


async def test_ws_non_admin_rejected(
    hass: HomeAssistant, enable_custom_integrations, hass_ws_client, hass_read_only_access_token
) -> None:
    """Test that non-admin clients are rejected with unauthorized error."""
    assert await async_setup_component(hass, DOMAIN, {})
    await hass.async_block_till_done()

    client = await hass_ws_client(hass, access_token=hass_read_only_access_token)
    await client.send_json({"id": 60, "type": WS_TYPE_LIST_SYSTEMS})
    res = await client.receive_json()
    assert not res["success"]
    assert res["error"]["code"] == "unauthorized"
