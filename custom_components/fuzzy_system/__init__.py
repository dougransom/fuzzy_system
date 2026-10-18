"""The Fuzzy System custom component."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components import panel_custom
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import SERVICE_RELOAD, Platform
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
    CONF_EPSILON,
    CONF_EXPOSE_SYSTEM_SENSOR,
    CONF_ICON,
    CONF_INFERENCE,
    CONF_INPUTS,
    CONF_MAX_UPDATES_PER_PERIOD,
    CONF_NAME,
    CONF_OUTPUTS,
    CONF_RANGE,
    CONF_RESOLUTION,
    CONF_RULES,
    CONF_SYSTEM_ID,
    CONF_SYSTEMS,
    CONF_TERMS,
    CONF_UNIT_OF_MEASUREMENT,
    CONF_UPDATE_PERIOD,
    DATA_ENTRIES,
    DATA_YAML_SYSTEMS,
    DEF_COG,
    DEFAULT_EPSILON,
    DEFAULT_MAX_UPDATES_PER_PERIOD,
    DEFAULT_UPDATE_PERIOD,
    DOMAIN,
    INFERENCE_MAMDANI,
    VALID_DEFUZZIFIERS,
    VALID_HEDGES,
    VALID_INFERENCE_TYPES,
)
from .fuzzy_engine import FuzzySystemEngine
from .websocket import async_setup_websocket

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR]

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
        vol.Optional(CONF_EPSILON): vol.All(vol.Coerce(float), vol.Range(min=0.0)),
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
        vol.Optional(CONF_MAX_UPDATES_PER_PERIOD, default=DEFAULT_MAX_UPDATES_PER_PERIOD): vol.All(
            vol.Coerce(int), vol.Range(min=1)
        ),
        vol.Optional(CONF_UPDATE_PERIOD, default=DEFAULT_UPDATE_PERIOD): vol.All(
            vol.Coerce(float), vol.Range(min=0.001)
        ),
        vol.Optional(CONF_EPSILON, default=DEFAULT_EPSILON): vol.All(
            vol.Coerce(float), vol.Range(min=0.0)
        ),
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


def _init_domain_data(hass: HomeAssistant) -> None:
    """Initialize domain storage structures in hass.data."""
    domain_store = hass.data.setdefault(DOMAIN, {})
    domain_store.setdefault(DATA_YAML_SYSTEMS, {})
    domain_store.setdefault(DATA_ENTRIES, {})


async def _async_setup_fuzzy_systems(
    hass: HomeAssistant, domain_config: dict[str, Any], full_config: ConfigType
) -> None:
    """Build engines and load sensor platforms for YAML-configured systems."""
    systems_config = domain_config[CONF_SYSTEMS]
    _init_domain_data(hass)

    for sys_name, sys_cfg in systems_config.items():
        engine = FuzzySystemEngine.from_dict({**sys_cfg, "name": sys_name})
        sys_data = {
            "engine": engine,
            "config": sys_cfg,
        }
        hass.data[DOMAIN][DATA_YAML_SYSTEMS][sys_name] = sys_data
        # Retain direct key mapping for backward compatibility
        hass.data[DOMAIN][sys_name] = sys_data

        _LOGGER.info("Configured Fuzzy System '%s' with %d rules", sys_name, len(engine.rules))

    # Load sensor platform for YAML systems
    await async_load_platform(hass, Platform.SENSOR, DOMAIN, {}, full_config)


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Register static path, extra JS URL, and custom sidebar panel."""
    frontend_dist_dir = Path(__file__).parent / "frontend" / "dist"
    panel_file = frontend_dist_dir / "fuzzy-system-panel.js"
    if not panel_file.exists():
        return

    if hasattr(hass, "http"):
        try:
            await hass.http.async_register_static_paths(
                [
                    StaticPathConfig(
                        "/fuzzy_system_frontend",
                        str(frontend_dist_dir),
                        cache_headers=False,
                    )
                ]
            )
        except Exception as err:
            _LOGGER.debug("Could not register static path: %s", err)

    mtime_hash = int(panel_file.stat().st_mtime)
    try:
        add_extra_js_url(hass, f"/fuzzy_system_frontend/fuzzy-system-panel.js?v={mtime_hash}")
    except Exception as err:
        _LOGGER.debug("Could not add extra js url: %s", err)

    try:
        panels = hass.data.get("frontend_panels", {})
        if "fuzzy-system" not in panels:
            await panel_custom.async_register_panel(
                hass,
                frontend_url_path="fuzzy-system",
                webcomponent_name="fuzzy-system-panel",
                sidebar_title="Fuzzy Systems",
                sidebar_icon="mdi:chart-bell-curve-cumulative",
                module_url=f"/fuzzy_system_frontend/fuzzy-system-panel.js?v={mtime_hash}",
                require_admin=True,
            )
            _LOGGER.info("Registered Fuzzy System frontend panel at /fuzzy-system")
    except Exception as err:
        _LOGGER.debug("Could not register frontend panel: %s", err)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Fuzzy System component and register reload service and WebSocket APIs."""
    _init_domain_data(hass)

    # Register WebSocket commands
    async_setup_websocket(hass)

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

    # Register frontend assets and custom panel
    await _async_register_frontend(hass)

    if DOMAIN in config:
        await _async_setup_fuzzy_systems(hass, config[DOMAIN], config)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Fuzzy System from a config entry UI."""
    _init_domain_data(hass)

    system_id = entry.data.get(CONF_SYSTEM_ID) or entry.unique_id or entry.title
    engine = FuzzySystemEngine.from_dict(entry.data)

    hass.data[DOMAIN][DATA_ENTRIES][entry.entry_id] = {
        "system_id": system_id,
        "engine": engine,
        "config": entry.data,
    }

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    entry.async_on_unload(entry.add_update_listener(async_reload_entry))
    _LOGGER.info("Set up Fuzzy System ConfigEntry '%s' (%s)", system_id, entry.entry_id)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry UI."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        _init_domain_data(hass)
        hass.data[DOMAIN][DATA_ENTRIES].pop(entry.entry_id, None)
        _LOGGER.info("Unloaded Fuzzy System ConfigEntry (%s)", entry.entry_id)
    return unload_ok


async def async_reload_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload config entry."""
    await hass.config_entries.async_reload(entry.entry_id)
