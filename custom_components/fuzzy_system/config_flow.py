"""Config flow for Fuzzy System integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import config_validation as cv

from .const import (
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
    VALID_DEFUZZIFIERS,
)

_LOGGER = logging.getLogger(__name__)


class FuzzySystemConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Fuzzy System Integration."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Handle initial step when added via UI."""
        errors: dict[str, str] = {}

        if user_input is not None:
            raw_id = user_input.get(CONF_SYSTEM_ID, "")
            system_id = cv.slugify(raw_id) if raw_id else ""
            if not system_id:
                errors["base"] = "invalid_system_id"
            else:
                # Check if system_id exists in YAML
                yaml_systems = self.hass.data.get(DOMAIN, {}).get(DATA_YAML_SYSTEMS, {})
                if system_id in yaml_systems:
                    errors["base"] = "id_exists_yaml"
                else:
                    await self.async_set_unique_id(system_id)
                    self._abort_if_unique_id_configured()

                    system_name = user_input.get(CONF_NAME) or system_id.replace("_", " ").title()
                    entry_data = (
                        {**user_input, CONF_SYSTEM_ID: system_id}
                        if CONF_INPUTS in user_input and CONF_OUTPUTS in user_input
                        else {
                            CONF_SYSTEM_ID: system_id,
                            CONF_NAME: system_name,
                            CONF_DESCRIPTION: "",
                            CONF_INFERENCE: user_input.get(CONF_INFERENCE, INFERENCE_MAMDANI),
                            CONF_DEFUZZIFIER: user_input.get(CONF_DEFUZZIFIER, DEF_COG),
                            CONF_EXPOSE_SYSTEM_SENSOR: True,
                            CONF_INPUTS: {},
                            CONF_OUTPUTS: {},
                            CONF_RULES: [],
                        }
                    )
                    return self.async_create_entry(title=system_name, data=entry_data)

        schema = vol.Schema(
            {
                vol.Required(CONF_SYSTEM_ID): cv.string,
                vol.Optional(CONF_NAME): cv.string,
                vol.Optional(CONF_INFERENCE, default=INFERENCE_MAMDANI): vol.In(
                    [INFERENCE_MAMDANI, INFERENCE_SUGENO]
                ),
                vol.Optional(CONF_DEFUZZIFIER, default=DEF_COG): vol.In(VALID_DEFUZZIFIERS),
            }
        )

        return self.async_show_form(
            step_id="user",
            data_schema=schema,
            errors=errors,
        )

    async def async_step_import(self, import_config: dict[str, Any]) -> FlowResult:
        """Handle automatic import from configuration.yaml."""
        system_id = cv.slugify(import_config.get(CONF_SYSTEM_ID, "yaml_imported"))
        await self.async_set_unique_id(system_id)
        self._abort_if_unique_id_configured()

        title = import_config.get(CONF_NAME) or system_id.replace("_", " ").title()
        return self.async_create_entry(title=title, data=import_config)

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> FuzzySystemOptionsFlowHandler:
        """Get options flow handler."""
        return FuzzySystemOptionsFlowHandler(config_entry)


class FuzzySystemOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle options flow for Fuzzy System config entries."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self._config_entry = config_entry

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Manage fuzzy system options and provide editor links."""
        if user_input is not None:
            updated_data = dict(self._config_entry.data)
            updated_data[CONF_DESCRIPTION] = user_input.get(CONF_DESCRIPTION, "")
            updated_data[CONF_EXPOSE_SYSTEM_SENSOR] = user_input.get(
                CONF_EXPOSE_SYSTEM_SENSOR, True
            )
            self.hass.config_entries.async_update_entry(
                self._config_entry,
                data=updated_data,
            )
            await self.hass.config_entries.async_reload(self._config_entry.entry_id)
            return self.async_create_entry(title="", data={})

        current_data = self._config_entry.data
        schema = vol.Schema(
            {
                vol.Optional(
                    CONF_DESCRIPTION,
                    default=current_data.get(CONF_DESCRIPTION, ""),
                ): cv.string,
                vol.Optional(
                    CONF_EXPOSE_SYSTEM_SENSOR,
                    default=current_data.get(CONF_EXPOSE_SYSTEM_SENSOR, True),
                ): cv.boolean,
            }
        )

        return self.async_show_form(
            step_id="init",
            data_schema=schema,
            description_placeholders={
                "system_id": current_data.get(CONF_SYSTEM_ID, self._config_entry.title),
                "editor_url": f"/fuzzy-system?entry_id={self._config_entry.entry_id}",
            },
        )
