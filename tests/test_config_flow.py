"""Tests for the Fuzzy System config flow and options flow."""

from unittest.mock import patch

from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
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
    DATA_YAML_SYSTEMS,
    DEF_COG,
    DOMAIN,
    INFERENCE_MAMDANI,
    INFERENCE_SUGENO,
)


async def test_flow_user_init(hass: HomeAssistant, enable_custom_integrations) -> None:
    """Test user step shows initial form."""
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "user"
    assert result["errors"] == {}


async def test_flow_user_creates_starter_system(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test creating starter fuzzy system through config flow."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "user"},
        data={
            CONF_SYSTEM_ID: "living_room_fan",
            CONF_NAME: "Living Room Fan",
            CONF_INFERENCE: INFERENCE_MAMDANI,
            CONF_DEFUZZIFIER: DEF_COG,
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "Living Room Fan"
    assert result["data"][CONF_SYSTEM_ID] == "living_room_fan"
    assert result["data"][CONF_INFERENCE] == INFERENCE_MAMDANI
    assert result["data"][CONF_DEFUZZIFIER] == DEF_COG
    assert result["data"][CONF_INPUTS] == {}
    assert result["data"][CONF_OUTPUTS] == {}
    assert result["data"][CONF_RULES] == []


async def test_flow_user_creates_full_system(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test creating full fuzzy system directly via flow input."""
    full_data = {
        CONF_SYSTEM_ID: "full_thermostat",
        CONF_NAME: "Thermostat System",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_INPUTS: {
            "temp": {
                "entity_id": "sensor.temp",
                "range": [0.0, 40.0],
                "terms": {
                    "cold": {"type": "trimf", "params": [0, 0, 20]},
                    "hot": {"type": "trimf", "params": [20, 40, 40]},
                },
            }
        },
        CONF_OUTPUTS: {
            "heat": {
                "range": [0.0, 100.0],
                "terms": {
                    "low": {"type": "trimf", "params": [0, 0, 50]},
                    "high": {"type": "trimf", "params": [50, 100, 100]},
                },
            }
        },
        CONF_RULES: ["IF temp IS cold THEN heat IS high"],
    }

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "user"},
        data=full_data,
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "Thermostat System"
    assert result["data"][CONF_SYSTEM_ID] == "full_thermostat"
    assert len(result["data"][CONF_RULES]) == 1


async def test_flow_user_blocks_yaml_duplicate_id(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test that creating a UI system with an ID matching a YAML system is rejected."""
    hass.data[DOMAIN] = {
        DATA_YAML_SYSTEMS: {
            "climate_control": {"engine": None, "config": {}},
        }
    }

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "user"},
        data={
            CONF_SYSTEM_ID: "climate_control",
            CONF_NAME: "New Climate Control",
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"]["base"] == "id_exists_yaml"


async def test_flow_user_aborts_on_duplicate_entry(
    hass: HomeAssistant, enable_custom_integrations
) -> None:
    """Test aborting when unique ID already exists in config entries."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="existing_system",
        title="Existing System",
        data={CONF_SYSTEM_ID: "existing_system"},
    )
    entry.add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "user"},
        data={
            CONF_SYSTEM_ID: "existing_system",
            CONF_NAME: "Duplicate Attempt",
        },
    )
    assert result["type"] == FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_options_flow(hass: HomeAssistant, enable_custom_integrations) -> None:
    """Test options flow allows updating metadata and reload."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="test_opts",
        title="Test Opts",
        data={
            CONF_SYSTEM_ID: "test_opts",
            CONF_NAME: "Test Opts",
            CONF_DESCRIPTION: "Initial description",
            CONF_EXPOSE_SYSTEM_SENSOR: True,
            CONF_INFERENCE: INFERENCE_MAMDANI,
            CONF_DEFUZZIFIER: DEF_COG,
            CONF_INPUTS: {},
            CONF_OUTPUTS: {},
            CONF_RULES: [],
        },
    )
    entry.add_to_hass(hass)

    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "init"

    with patch.object(hass.config_entries, "async_reload") as mock_reload:
        result2 = await hass.config_entries.options.async_configure(
            result["flow_id"],
            user_input={
                CONF_DESCRIPTION: "Updated description via options",
                CONF_EXPOSE_SYSTEM_SENSOR: False,
            },
        )
        assert result2["type"] == FlowResultType.CREATE_ENTRY
        assert entry.data[CONF_DESCRIPTION] == "Updated description via options"
        assert entry.data[CONF_EXPOSE_SYSTEM_SENSOR] is False
        mock_reload.assert_called_once_with(entry.entry_id)


async def test_flow_user_invalid_system_id(hass: HomeAssistant, enable_custom_integrations) -> None:
    """Test rejecting empty or invalid slug system_id."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "user"},
        data={
            CONF_SYSTEM_ID: "",
            CONF_NAME: "Invalid System",
        },
    )
    assert result["type"] == FlowResultType.FORM
    assert result["errors"]["base"] == "invalid_system_id"


async def test_flow_import_step(hass: HomeAssistant, enable_custom_integrations) -> None:
    """Test importing configuration via import step."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": "import"},
        data={
            CONF_SYSTEM_ID: "yaml_imported_sys",
            CONF_NAME: "YAML Imported System",
            CONF_INFERENCE: INFERENCE_MAMDANI,
            CONF_DEFUZZIFIER: DEF_COG,
            CONF_INPUTS: {},
            CONF_OUTPUTS: {},
            CONF_RULES: [],
        },
    )
    assert result["type"] == FlowResultType.CREATE_ENTRY
    assert result["title"] == "YAML Imported System"
    assert result["data"][CONF_SYSTEM_ID] == "yaml_imported_sys"


async def test_reconfigure_flow(hass: HomeAssistant, enable_custom_integrations) -> None:
    """Test reconfiguring an existing fuzzy system."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id="reconfig_test",
        title="Original Title",
        data={
            CONF_SYSTEM_ID: "reconfig_test",
            CONF_NAME: "Original Title",
            CONF_INFERENCE: INFERENCE_MAMDANI,
            CONF_DEFUZZIFIER: DEF_COG,
            CONF_INPUTS: {},
            CONF_OUTPUTS: {},
            CONF_RULES: [],
        },
    )
    entry.add_to_hass(hass)

    result = await entry.start_reconfigure_flow(hass)
    assert result["type"] == FlowResultType.FORM
    assert result["step_id"] == "reconfigure"

    result2 = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        user_input={
            CONF_NAME: "Reconfigured Title",
            CONF_INFERENCE: INFERENCE_SUGENO,
            CONF_DEFUZZIFIER: "wtaverage",
        },
    )
    assert result2["type"] == FlowResultType.ABORT
    assert result2["reason"] == "reconfigure_successful"
    await hass.async_block_till_done()
    assert entry.title == "Reconfigured Title"
    assert entry.data[CONF_INFERENCE] == INFERENCE_SUGENO
    assert entry.data[CONF_DEFUZZIFIER] == "wtaverage"

