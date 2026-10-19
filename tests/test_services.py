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


async def test_explain_service_invalid_system_id(
    hass: HomeAssistant, enable_custom_integrations, sample_service_config
) -> None:
    """Test explain error handling when system_id is not found."""
    assert await async_setup_component(hass, DOMAIN, sample_service_config)
    await hass.async_block_till_done()

    with pytest.raises(HomeAssistantError, match="Fuzzy system 'unknown_system' not found"):
        await hass.services.async_call(
            DOMAIN,
            "explain",
            {"system_id": "unknown_system"},
            blocking=True,
            return_response=True,
        )


async def test_explain_no_rules_fired(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test explain service when input values result in no rules firing."""
    config = {
        DOMAIN: {
            "systems": {
                "sparse_system": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "temp": {
                            "entity_id": "sensor.sparse_temp",
                            "range": [0.0, 50.0],
                            "terms": {
                                "extreme_hot": {"type": "trimf", "params": [45, 50, 50]},
                            },
                            "default": 10.0,
                        }
                    },
                    "outputs": {
                        "cooling": {
                            "range": [0.0, 100.0],
                            "terms": {
                                "max": {"type": "trimf", "params": [50, 100, 100]},
                            },
                        }
                    },
                    "rules": ["IF temp IS extreme_hot THEN cooling IS max"],
                }
            }
        }
    }
    assert await async_setup_component(hass, DOMAIN, config)
    await hass.async_block_till_done()

    hass.states.async_set("sensor.sparse_temp", "10.0")
    await hass.async_block_till_done()

    response = await hass.services.async_call(
        DOMAIN,
        "explain",
        {"system_id": "sparse_system"},
        blocking=True,
        return_response=True,
    )
    assert response is not None
    assert "No rules fired" in response["explanation"]


async def test_services_live_inputs_fallbacks_and_case_insensitivity(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test live inputs fallback for non-numeric, unavailable, or missing entity_id and case-insensitive lookup."""
    config = {
        DOMAIN: {
            "systems": {
                "HVAC_Control": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "inputs": {
                        "temp_invalid": {
                            "entity_id": "sensor.corrupted_state",
                            "range": [0.0, 50.0],
                            "terms": {"warm": {"type": "trimf", "params": [10, 25, 40]}},
                            "default": 22.0,
                        },
                        "temp_unavailable": {
                            "entity_id": "sensor.unavail_state",
                            "range": [0.0, 50.0],
                            "terms": {"warm": {"type": "trimf", "params": [10, 25, 40]}},
                            "default": 20.0,
                        },
                    },
                    "outputs": {
                        "fan": {
                            "range": [0.0, 100.0],
                            "terms": {"medium": {"type": "trimf", "params": [0, 50, 100]}},
                        }
                    },
                    "rules": [
                        "IF temp_invalid IS warm THEN fan IS medium",
                    ],
                }
            }
        }
    }
    assert await async_setup_component(hass, DOMAIN, config)
    await hass.async_block_till_done()

    # Corrupted non-numeric state
    hass.states.async_set("sensor.corrupted_state", "not_a_number")
    # Unavailable state
    hass.states.async_set("sensor.unavail_state", "unavailable")
    await hass.async_block_till_done()

    # Case-insensitive resolution: hvac_control instead of HVAC_Control
    response = await hass.services.async_call(
        DOMAIN,
        "explain",
        {"system_id": "hvac_control"},
        blocking=True,
        return_response=True,
    )
    assert response is not None
    assert response["live_inputs"]["temp_invalid"] == 22.0
    assert response["live_inputs"]["temp_unavailable"] == 20.0

    # Test _get_live_inputs directly when entity_id is missing or empty
    from custom_components.fuzzy_system.services import _get_live_inputs

    custom_cfg = {"inputs": {"var_without_entity": {"default": 33.0}}}
    live_res = _get_live_inputs(hass, custom_cfg)
    assert live_res["var_without_entity"] == 33.0


async def test_list_and_get_system_services(
    hass: HomeAssistant, enable_custom_integrations, sample_service_config
) -> None:
    """Test fuzzy_system.list_systems and fuzzy_system.get_system MCP actions."""
    assert await async_setup_component(hass, DOMAIN, sample_service_config)
    await hass.async_block_till_done()

    # Call list_systems
    list_res = await hass.services.async_call(
        DOMAIN,
        "list_systems",
        {},
        blocking=True,
        return_response=True,
    )
    assert list_res is not None
    assert "systems" in list_res
    assert list_res["count"] >= 1
    system_entry = next((s for s in list_res["systems"] if s["system_id"] == "thermostat"), None)
    assert system_entry is not None
    assert system_entry["inference"] == "mamdani"
    assert "temperature" in system_entry["inputs"]
    assert "cooling" in system_entry["outputs"]

    # Call get_system
    get_res = await hass.services.async_call(
        DOMAIN,
        "get_system",
        {"system_id": "thermostat"},
        blocking=True,
        return_response=True,
    )
    assert get_res is not None
    assert get_res["system_id"] == "thermostat"
    assert "temperature" in get_res["live_inputs"]
    assert "cooling" in get_res["outputs"]


async def test_dashboard_card_services(
    hass: HomeAssistant, enable_custom_integrations, sample_service_config, tmp_path
) -> None:
    """Test generate_dashboard_card and add_to_dashboard services."""
    assert await async_setup_component(hass, DOMAIN, sample_service_config)
    await hass.async_block_till_done()

    # 1. Generate dashboard card config and YAML
    gen_res = await hass.services.async_call(
        DOMAIN,
        "generate_dashboard_card",
        {"system_id": "thermostat", "title": "Living Room Comfort"},
        blocking=True,
        return_response=True,
    )
    assert gen_res is not None
    assert gen_res["card"]["type"] == "custom:fuzzy-system-card"
    assert gen_res["card"]["system_id"] == "thermostat"
    assert gen_res["card"]["title"] == "Living Room Comfort"
    assert "custom:fuzzy-system-card" in gen_res["yaml"]

    # 2. Add to dashboard fallback when storage not initialized
    add_fallback_res = await hass.services.async_call(
        DOMAIN,
        "add_to_dashboard",
        {"system_id": "thermostat", "view_title": "Comfort View"},
        blocking=True,
        return_response=True,
    )
    assert add_fallback_res is not None
    assert "yaml" in add_fallback_res
    assert "card" in add_fallback_res

    # 3. Add to dashboard when mock Lovelace storage is present
    class MockLovelaceStorage:
        def __init__(self):
            self.saved_config = None

        async def async_load(self, force=False):
            return {"views": [{"title": "Overview", "cards": []}]}

        async def async_save(self, config):
            self.saved_config = config

    mock_storage = MockLovelaceStorage()
    hass.data["lovelace"] = {"dashboards": {None: mock_storage}}

    add_storage_res = await hass.services.async_call(
        DOMAIN,
        "add_to_dashboard",
        {"system_id": "thermostat", "view_title": "Fuzzy Automation"},
        blocking=True,
        return_response=True,
    )
    assert add_storage_res is not None
    assert add_storage_res["success"] is True
    assert add_storage_res["view"] == "Fuzzy Automation"
    assert mock_storage.saved_config is not None
    # Verify view was created and card was added
    new_view = next((v for v in mock_storage.saved_config["views"] if v["title"] == "Fuzzy Automation"), None)
    assert new_view is not None
    view_cards = new_view["cards"]
    assert len(view_cards) == 1
    assert view_cards[0]["system_id"] == "thermostat"

    # 4. Add to existing view when view_title matches
    mock_storage.saved_config = None

    async def mock_load_existing(force=False):
        return {"views": [{"title": "Existing View", "cards": []}]}

    mock_storage.async_load = mock_load_existing
    add_existing_res = await hass.services.async_call(
        DOMAIN,
        "add_to_dashboard",
        {"system_id": "thermostat", "view_title": "Existing View"},
        blocking=True,
        return_response=True,
    )
    assert add_existing_res["success"] is True
    assert add_existing_res["view"] == "Existing View"
    assert len(mock_storage.saved_config["views"]) == 1
    assert len(mock_storage.saved_config["views"][0]["cards"]) == 1

    # 5. Add to default view when view_title is not specified and views exist
    mock_storage.saved_config = None

    async def mock_load_first(force=False):
        return {"views": [{"title": "First View", "cards": []}]}

    mock_storage.async_load = mock_load_first
    add_default_res = await hass.services.async_call(
        DOMAIN,
        "add_to_dashboard",
        {"system_id": "thermostat"},
        blocking=True,
        return_response=True,
    )
    assert add_default_res["success"] is True
    assert add_default_res["view"] == "First View"
    assert len(mock_storage.saved_config["views"][0]["cards"]) == 1

    # 6. Add when view_title is not specified and views is empty
    mock_storage.saved_config = None

    async def mock_load_empty(force=False):
        return {"views": []}

    mock_storage.async_load = mock_load_empty
    add_empty_views_res = await hass.services.async_call(
        DOMAIN,
        "add_to_dashboard",
        {"system_id": "thermostat"},
        blocking=True,
        return_response=True,
    )
    assert add_empty_views_res["success"] is True
    assert add_empty_views_res["view"] == "Fuzzy Systems"
    assert len(mock_storage.saved_config["views"]) == 1
    assert mock_storage.saved_config["views"][0]["title"] == "Fuzzy Systems"

    # 7. Add with custom dashboard_path
    mock_custom_storage = MockLovelaceStorage()
    hass.data["lovelace"]["dashboards"]["custom_dash"] = mock_custom_storage
    add_custom_dash_res = await hass.services.async_call(
        DOMAIN,
        "add_to_dashboard",
        {"system_id": "thermostat", "dashboard_path": "custom_dash", "view_title": "Custom View"},
        blocking=True,
        return_response=True,
    )
    assert add_custom_dash_res["success"] is True
    assert mock_custom_storage.saved_config is not None

    # 8. Storage save failure handles exception gracefully
    async def failing_save(config):
        raise OSError("Disk write failed")

    mock_storage.async_save = failing_save
    add_fail_res = await hass.services.async_call(
        DOMAIN,
        "add_to_dashboard",
        {"system_id": "thermostat"},
        blocking=True,
        return_response=True,
    )
    assert add_fail_res["success"] is False
    assert "Disk write failed" in add_fail_res["error"]
    assert "instruction" in add_fail_res

    # 9. Add when dashboard is in YAML mode
    temp_yaml = tmp_path / "ui-lovelace.yaml"
    temp_yaml.write_text("views:\n  - title: YAML View\n    cards: []\n", encoding="utf-8")

    class MockLovelaceYAML:
        mode = "yaml"
        path = str(temp_yaml)
        _cache = None

        def _config_updated(self):
            pass

    mock_yaml_storage = MockLovelaceYAML()
    hass.data["lovelace"]["dashboards"]["yaml_dash"] = mock_yaml_storage
    add_yaml_res = await hass.services.async_call(
        DOMAIN,
        "add_to_dashboard",
        {"system_id": "thermostat", "dashboard_path": "yaml_dash", "view_title": "YAML View"},
        blocking=True,
        return_response=True,
    )
    assert add_yaml_res["success"] is True
    assert add_yaml_res["view"] == "YAML View"
    saved_yaml = temp_yaml.read_text(encoding="utf-8")
    assert "custom:fuzzy-system-card" in saved_yaml
    assert "thermostat" in saved_yaml




async def test_templates_services(
    hass: HomeAssistant, enable_custom_integrations, sample_service_config
) -> None:
    """Test list_templates and instantiate_template MCP actions."""
    assert await async_setup_component(hass, DOMAIN, sample_service_config)
    await hass.async_block_till_done()

    # 1. list_templates
    templates_res = await hass.services.async_call(
        DOMAIN,
        "list_templates",
        {},
        blocking=True,
        return_response=True,
    )
    assert templates_res is not None
    assert "templates" in templates_res
    assert len(templates_res["templates"]) >= 1

    # 2. instantiate_template
    instantiate_res = await hass.services.async_call(
        DOMAIN,
        "instantiate_template",
        {
            "template_id": "smart_fan_controller",
            "system_id": "mcp_fan_control",
            "name": "MCP Climate System",
            "entity_mappings": {"room_temperature": "sensor.hallway_temp"},
        },
        blocking=True,
        return_response=True,
    )
    assert instantiate_res is not None
    assert instantiate_res["success"] is True
    assert instantiate_res["system_id"] == "mcp_fan_control"
    assert "entry_id" in instantiate_res

