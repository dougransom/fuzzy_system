"""Config flow for Fuzzy System integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


class FuzzySystemConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Fuzzy System Integration."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Handle initial step when added via UI."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Fuzzy System Integration", data={})

        return self.async_show_form(
            step_id="user",
            data_schema=None,
            description_placeholders={},
        )

    async def async_step_import(self, import_config: dict[str, Any]) -> FlowResult:
        """Handle automatic import from configuration.yaml."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        return self.async_create_entry(title="Fuzzy System Integration", data={})
