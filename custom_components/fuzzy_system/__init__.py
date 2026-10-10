"""The Fuzzy System custom component."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant.const import SERVICE_RELOAD
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.discovery import async_load_platform
from homeassistant.helpers.entity_platform import async_get_platforms
from homeassistant.helpers.reload import async_integration_yaml_config
from homeassistant.helpers.service import async_register_admin_service
from homeassistant.helpers.typing import ConfigType

from .const import (
    CONF_DEFAULT,
    CONF_DEFUZZIFIER,
    CONF_ENTITY_ID,
    CONF_EXPOSE_SYSTEM_SENSOR,
    CONF_ICON,
    CONF_INFERENCE,
    CONF_INPUTS,
    CONF_NAME,
    CONF_OUTPUTS,
    CONF_RANGE,
    CONF_RESOLUTION,
    CONF_RULES,
    CONF_SYSTEMS,
    CONF_TERMS,
    CONF_UNIT_OF_MEASUREMENT,
    DEF_COG,
    DOMAIN,
    INFERENCE_MAMDANI,
    VALID_DEFUZZIFIERS,
    VALID_HEDGES,
    VALID_INFERENCE_TYPES,
)
from .fuzzy_engine import FuzzySystemEngine

_LOGGER = logging.getLogger(__name__)

TERM_SCHEMA = vol.Schema(
    {
        vol.Required("type"): cv.string,
        vol.Required("params"): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Optional("hedge"): vol.In(VALID_HEDGES),
    }
)

INPUT_VAR_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_ENTITY_ID): cv.entity_id,
        vol.Required(CONF_RANGE): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Required(CONF_TERMS): vol.Schema({cv.string: TERM_SCHEMA}),
        vol.Optional(CONF_DEFAULT, default=0.0): vol.Coerce(float),
        vol.Optional(CONF_RESOLUTION, default=100): vol.Coerce(int),
    }
)

OUTPUT_VAR_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_RANGE): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Required(CONF_TERMS): vol.Schema({cv.string: TERM_SCHEMA}),
        vol.Optional(CONF_RESOLUTION, default=100): vol.Coerce(int),
        vol.Optional(CONF_DEFUZZIFIER): vol.In(VALID_DEFUZZIFIERS),
        vol.Optional(CONF_NAME): cv.string,
        vol.Optional(CONF_ICON): cv.icon,
        vol.Optional(CONF_UNIT_OF_MEASUREMENT): cv.string,
    }
)

SYSTEM_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_INFERENCE, default=INFERENCE_MAMDANI): vol.In(VALID_INFERENCE_TYPES),
        vol.Optional(CONF_DEFUZZIFIER, default=DEF_COG): vol.In(VALID_DEFUZZIFIERS),
        vol.Optional(CONF_EXPOSE_SYSTEM_SENSOR, default=True): cv.boolean,
        vol.Required(CONF_INPUTS): vol.Schema({cv.string: INPUT_VAR_SCHEMA}),
        vol.Required(CONF_OUTPUTS): vol.Schema({cv.string: OUTPUT_VAR_SCHEMA}),
        vol.Required(CONF_RULES): vol.All(cv.ensure_list, [cv.string]),
    }
)

CONFIG_SCHEMA = vol.Schema(
    {
        DOMAIN: vol.Schema(
            {
                vol.Required(CONF_SYSTEMS): vol.Schema({cv.string: SYSTEM_SCHEMA}),
            }
        )
    },
    extra=vol.ALLOW_EXTRA,
)


async def _async_setup_fuzzy_systems(
    hass: HomeAssistant, domain_config: dict[str, Any], full_config: ConfigType
) -> None:
    """Build engines and load sensor platforms."""
    systems_config = domain_config[CONF_SYSTEMS]
    hass.data[DOMAIN] = {}

    for sys_name, sys_cfg in systems_config.items():
        engine = FuzzySystemEngine(
            name=sys_name,
            inference_type=sys_cfg[CONF_INFERENCE],
            defuzzifier=sys_cfg[CONF_DEFUZZIFIER],
        )

        # Build Input Variables
        for input_name, input_cfg in sys_cfg[CONF_INPUTS].items():
            engine.add_input_variable(
                name=input_name,
                var_range=input_cfg[CONF_RANGE],
                terms=input_cfg[CONF_TERMS],
                resolution=input_cfg.get(CONF_RESOLUTION, 100),
            )

        # Build Output Variables
        for output_name, output_cfg in sys_cfg[CONF_OUTPUTS].items():
            engine.add_output_variable(
                name=output_name,
                var_range=output_cfg[CONF_RANGE],
                terms=output_cfg[CONF_TERMS],
                resolution=output_cfg.get(CONF_RESOLUTION, 100),
                defuzzifier=output_cfg.get(CONF_DEFUZZIFIER),
            )

        # Add Rules
        for rule_str in sys_cfg[CONF_RULES]:
            engine.add_rule(rule_str)

        hass.data[DOMAIN][sys_name] = {
            "engine": engine,
            "config": sys_cfg,
        }

        _LOGGER.info("Configured Fuzzy System '%s' with %d rules", sys_name, len(engine.rules))

    # Load sensor platform
    await async_load_platform(hass, "sensor", DOMAIN, {}, full_config)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Fuzzy System component and register reload service."""
    async def _reload_config(call: ServiceCall) -> None:
        """Reload Fuzzy System integration from YAML."""
        reload_config = await async_integration_yaml_config(hass, DOMAIN)
        if not reload_config or DOMAIN not in reload_config:
            _LOGGER.warning("No configuration found for %s during reload", DOMAIN)
            return

        # Reset entity platforms
        reset_platforms = async_get_platforms(hass, DOMAIN)
        for reset_platform in reset_platforms:
            await reset_platform.async_reset()

        await _async_setup_fuzzy_systems(hass, reload_config[DOMAIN], reload_config)
        hass.bus.async_fire(f"event_{DOMAIN}_reloaded", context=call.context)
        _LOGGER.info("Fuzzy System integration reloaded successfully")

    async_register_admin_service(hass, DOMAIN, SERVICE_RELOAD, _reload_config)

    if DOMAIN in config:
        await _async_setup_fuzzy_systems(hass, config[DOMAIN], config)

    return True


async def async_setup_entry(hass: HomeAssistant, entry) -> bool:
    """Set up Fuzzy System from a config entry UI."""
    return True


async def async_unload_entry(hass: HomeAssistant, entry) -> bool:
    """Unload a config entry UI."""
    return True
