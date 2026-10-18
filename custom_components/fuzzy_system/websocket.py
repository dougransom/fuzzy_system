"""WebSocket API handlers for the Fuzzy System integration."""

from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import config_validation as cv

from .const import (
    CONF_DEFAULT,
    CONF_DEFUZZIFIER,
    CONF_DESCRIPTION,
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
    SOURCE_CONFIG_ENTRY,
    SOURCE_YAML,
    VALID_DEFUZZIFIERS,
    VALID_HEDGES,
    VALID_INFERENCE_TYPES,
    WS_TYPE_DELETE_SYSTEM,
    WS_TYPE_GET_SYSTEM,
    WS_TYPE_INSTANTIATE_TEMPLATE,
    WS_TYPE_LIST_SYSTEMS,
    WS_TYPE_LIST_TEMPLATES,
    WS_TYPE_SAVE_SYSTEM,
    WS_TYPE_SIMULATE,
)
from .fuzzy_engine import FuzzySystemEngine
from .templates import get_templates, instantiate_template

_LOGGER = logging.getLogger(__name__)

WS_TERM_SCHEMA = vol.Schema(
    {
        vol.Required("type"): cv.string,
        vol.Required("params"): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Optional("hedge"): vol.In(VALID_HEDGES),
    }
)

WS_INPUT_VAR_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_ENTITY_ID): cv.string,
        vol.Required(CONF_RANGE): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Required(CONF_TERMS): vol.Schema({cv.string: WS_TERM_SCHEMA}),
        vol.Optional(CONF_DEFAULT, default=0.0): vol.Coerce(float),
        vol.Optional(CONF_RESOLUTION, default=100): vol.Coerce(int),
    }
)

WS_OUTPUT_VAR_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_RANGE): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Required(CONF_TERMS): vol.Schema({cv.string: WS_TERM_SCHEMA}),
        vol.Optional(CONF_RESOLUTION, default=100): vol.Coerce(int),
        vol.Optional(CONF_DEFUZZIFIER): vol.In(VALID_DEFUZZIFIERS),
        vol.Optional(CONF_EPSILON): vol.All(vol.Coerce(float), vol.Range(min=0.0)),
        vol.Optional(CONF_NAME): cv.string,
        vol.Optional(CONF_ICON): cv.string,
        vol.Optional(CONF_UNIT_OF_MEASUREMENT): cv.string,
    }
)


def _format_system_summary(
    sys_id: str,
    cfg: dict[str, Any],
    source: str,
    entry_id: str | None = None,
) -> dict[str, Any]:
    """Format standardized summary metadata for a fuzzy system."""
    return {
        "system_id": sys_id,
        "name": cfg.get(CONF_NAME, sys_id),
        "description": cfg.get(CONF_DESCRIPTION, ""),
        "source": source,
        "entry_id": entry_id,
        "inference": cfg.get(CONF_INFERENCE, INFERENCE_MAMDANI),
        "defuzzifier": cfg.get(CONF_DEFUZZIFIER, DEF_COG),
        "input_count": len(cfg.get(CONF_INPUTS, {})),
        "output_count": len(cfg.get(CONF_OUTPUTS, {})),
        "rule_count": len(cfg.get(CONF_RULES, [])),
        "max_updates_per_period": cfg.get(
            CONF_MAX_UPDATES_PER_PERIOD, DEFAULT_MAX_UPDATES_PER_PERIOD
        ),
        "update_period": cfg.get(CONF_UPDATE_PERIOD, DEFAULT_UPDATE_PERIOD),
        "epsilon": cfg.get(CONF_EPSILON, DEFAULT_EPSILON),
        "config": {
            CONF_SYSTEM_ID: sys_id,
            CONF_NAME: cfg.get(CONF_NAME, sys_id),
            CONF_DESCRIPTION: cfg.get(CONF_DESCRIPTION, ""),
            CONF_INFERENCE: cfg.get(CONF_INFERENCE, INFERENCE_MAMDANI),
            CONF_DEFUZZIFIER: cfg.get(CONF_DEFUZZIFIER, DEF_COG),
            CONF_EXPOSE_SYSTEM_SENSOR: cfg.get(CONF_EXPOSE_SYSTEM_SENSOR, True),
            CONF_MAX_UPDATES_PER_PERIOD: cfg.get(
                CONF_MAX_UPDATES_PER_PERIOD, DEFAULT_MAX_UPDATES_PER_PERIOD
            ),
            CONF_UPDATE_PERIOD: cfg.get(CONF_UPDATE_PERIOD, DEFAULT_UPDATE_PERIOD),
            CONF_EPSILON: cfg.get(CONF_EPSILON, DEFAULT_EPSILON),
            CONF_INPUTS: cfg.get(CONF_INPUTS, {}),
            CONF_OUTPUTS: cfg.get(CONF_OUTPUTS, {}),
            CONF_RULES: cfg.get(CONF_RULES, []),
        },
    }


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_LIST_SYSTEMS,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_list_systems(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return a list of all configured fuzzy systems (YAML and ConfigEntry)."""
    domain_data = hass.data.get(DOMAIN, {})
    yaml_systems: dict[str, Any] = domain_data.get(DATA_YAML_SYSTEMS, {})
    entry_systems: dict[str, Any] = domain_data.get(DATA_ENTRIES, {})

    systems_list = [
        _format_system_summary(sys_id, sys_info.get("config", {}), SOURCE_YAML)
        for sys_id, sys_info in yaml_systems.items()
    ] + [
        _format_system_summary(
            entry_info.get("system_id", entry_id),
            entry_info.get("config", {}),
            SOURCE_CONFIG_ENTRY,
            entry_id,
        )
        for entry_id, entry_info in entry_systems.items()
    ]

    systems_list.sort(key=lambda s: str(s.get("name", "")))
    connection.send_result(msg["id"], systems_list)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_GET_SYSTEM,
        vol.Optional(CONF_SYSTEM_ID): cv.string,
        vol.Optional("entry_id"): cv.string,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_get_system(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Retrieve complete system configuration by system_id or entry_id."""
    sys_id = msg.get(CONF_SYSTEM_ID)
    entry_id = msg.get("entry_id")

    if not sys_id and not entry_id:
        connection.send_error(
            msg["id"],
            "invalid_parameters",
            "Either system_id or entry_id must be provided.",
        )
        return

    domain_data = hass.data.get(DOMAIN, {})
    yaml_systems: dict[str, Any] = domain_data.get(DATA_YAML_SYSTEMS, {})
    entry_systems: dict[str, Any] = domain_data.get(DATA_ENTRIES, {})

    # Check by entry_id first
    if entry_id and entry_id in entry_systems:
        info = entry_systems[entry_id]
        connection.send_result(
            msg["id"],
            {
                "system_id": info.get("system_id"),
                "source": SOURCE_CONFIG_ENTRY,
                "entry_id": entry_id,
                "config": info.get("config", {}),
            },
        )
        return

    # Check by system_id
    if sys_id:
        if sys_id in yaml_systems:
            info = yaml_systems[sys_id]
            connection.send_result(
                msg["id"],
                {
                    "system_id": sys_id,
                    "source": SOURCE_YAML,
                    "entry_id": None,
                    "config": info.get("config", {}),
                },
            )
            return

        for e_id, info in entry_systems.items():
            if info.get("system_id") == sys_id:
                connection.send_result(
                    msg["id"],
                    {
                        "system_id": sys_id,
                        "source": SOURCE_CONFIG_ENTRY,
                        "entry_id": e_id,
                        "config": info.get("config", {}),
                    },
                )
                return

    connection.send_error(
        msg["id"],
        "not_found",
        f"Fuzzy system '{sys_id or entry_id}' was not found.",
    )


def _system_id_exists(
    hass: HomeAssistant,
    system_id: str,
    exclude_entry_id: str | None = None,
) -> bool:
    """Check if a fuzzy system_id is already in use by any other config entry."""
    for entry in hass.config_entries.async_entries(DOMAIN):
        if exclude_entry_id and entry.entry_id == exclude_entry_id:
            continue
        entry_sys_id = entry.data.get(CONF_SYSTEM_ID) or entry.unique_id
        if entry_sys_id == system_id:
            return True
    return False


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_SAVE_SYSTEM,
        vol.Optional(CONF_SYSTEM_ID): cv.string,
        vol.Optional(CONF_NAME): cv.string,
        vol.Optional(CONF_DESCRIPTION): cv.string,
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
        vol.Optional(CONF_INPUTS): vol.Schema({cv.string: WS_INPUT_VAR_SCHEMA}),
        vol.Optional(CONF_OUTPUTS): vol.Schema({cv.string: WS_OUTPUT_VAR_SCHEMA}),
        vol.Optional(CONF_RULES): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional("system"): dict,
        vol.Optional("entry_id"): cv.string,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save_system(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Save or update a fuzzy system as a ConfigEntry."""
    raw_system = msg.get("system") or msg
    raw_sys_id = raw_system.get(CONF_SYSTEM_ID)
    if not raw_sys_id:
        connection.send_error(msg["id"], "invalid_format", "system_id is required.")
        return

    system_id = cv.slugify(raw_sys_id)
    domain_data = hass.data.get(DOMAIN, {})
    yaml_systems: dict[str, Any] = domain_data.get(DATA_YAML_SYSTEMS, {})

    # Prevent overwriting YAML configurations
    if system_id in yaml_systems:
        connection.send_error(
            msg["id"],
            "yaml_locked",
            f"System '{system_id}' is defined in YAML and cannot be modified via the UI. "
            "Please remove or comment out the YAML configuration or use a different ID.",
        )
        return

    entry_id = msg.get("entry_id") or raw_system.get("entry_id")

    # Check for system_id collision with other entries
    if _system_id_exists(hass, system_id, exclude_entry_id=entry_id):
        connection.send_error(
            msg["id"],
            "id_exists",
            f"A fuzzy system with ID '{system_id}' already exists.",
        )
        return

    system_data = {
        CONF_SYSTEM_ID: system_id,
        CONF_NAME: raw_system.get(CONF_NAME) or system_id.replace("_", " ").title(),
        CONF_DESCRIPTION: raw_system.get(CONF_DESCRIPTION, ""),
        CONF_INFERENCE: raw_system.get(CONF_INFERENCE, INFERENCE_MAMDANI),
        CONF_DEFUZZIFIER: raw_system.get(CONF_DEFUZZIFIER, DEF_COG),
        CONF_EXPOSE_SYSTEM_SENSOR: raw_system.get(CONF_EXPOSE_SYSTEM_SENSOR, True),
        CONF_MAX_UPDATES_PER_PERIOD: raw_system.get(
            CONF_MAX_UPDATES_PER_PERIOD, DEFAULT_MAX_UPDATES_PER_PERIOD
        ),
        CONF_UPDATE_PERIOD: raw_system.get(CONF_UPDATE_PERIOD, DEFAULT_UPDATE_PERIOD),
        CONF_EPSILON: raw_system.get(CONF_EPSILON, DEFAULT_EPSILON),
        CONF_INPUTS: raw_system.get(CONF_INPUTS, {}),
        CONF_OUTPUTS: raw_system.get(CONF_OUTPUTS, {}),
        CONF_RULES: raw_system.get(CONF_RULES, []),
    }

    # Case 1: Updating an existing config entry
    if entry_id:
        entry = hass.config_entries.async_get_entry(entry_id)
        if not entry or entry.domain != DOMAIN:
            connection.send_error(msg["id"], "not_found", f"Config entry '{entry_id}' not found.")
            return

        hass.config_entries.async_update_entry(
            entry,
            title=system_data[CONF_NAME],
            data=system_data,
            unique_id=system_id,
        )
        await hass.config_entries.async_reload(entry.entry_id)
        connection.send_result(
            msg["id"],
            {"success": True, "entry_id": entry.entry_id, "system_id": system_id},
        )
        return

    # Case 2: Creating a new config entry
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": config_entries.SOURCE_USER},
        data=system_data,
    )

    if result.get("type") == FlowResultType.CREATE_ENTRY:
        new_entry = result["result"]
        connection.send_result(
            msg["id"],
            {"success": True, "entry_id": new_entry.entry_id, "system_id": system_id},
        )
    else:
        connection.send_error(
            msg["id"],
            "creation_failed",
            f"Failed to create config entry: {result.get('errors') or result.get('reason')}",
        )


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_DELETE_SYSTEM,
        vol.Required("entry_id"): cv.string,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete_system(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Delete a UI-managed fuzzy system by entry_id."""
    entry_id = msg["entry_id"]
    entry = hass.config_entries.async_get_entry(entry_id)

    if not entry or entry.domain != DOMAIN:
        connection.send_error(msg["id"], "not_found", f"Config entry '{entry_id}' not found.")
        return

    unload_ok = await hass.config_entries.async_remove(entry_id)
    if unload_ok:
        connection.send_result(msg["id"], {"success": True})
    else:
        connection.send_error(msg["id"], "delete_failed", "Failed to remove config entry.")


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_SIMULATE,
        vol.Required("system_config"): vol.Schema(
            {
                vol.Optional(CONF_SYSTEM_ID): cv.string,
                vol.Optional(CONF_NAME): cv.string,
                vol.Optional(CONF_INFERENCE, default=INFERENCE_MAMDANI): vol.In(
                    VALID_INFERENCE_TYPES
                ),
                vol.Optional(CONF_DEFUZZIFIER, default=DEF_COG): vol.In(VALID_DEFUZZIFIERS),
                vol.Required(CONF_INPUTS): vol.Schema({cv.string: WS_INPUT_VAR_SCHEMA}),
                vol.Required(CONF_OUTPUTS): vol.Schema({cv.string: WS_OUTPUT_VAR_SCHEMA}),
                vol.Required(CONF_RULES): vol.All(cv.ensure_list, [cv.string]),
            },
            extra=vol.ALLOW_EXTRA,
        ),
        vol.Required("inputs"): vol.Schema({cv.string: vol.Coerce(float)}),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_simulate(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Execute dry-run simulation of a fuzzy system without mutating sensor states."""
    system_config = msg["system_config"]
    inputs = msg["inputs"]

    try:
        engine = FuzzySystemEngine.from_dict(system_config)
        simulation_result = engine.simulate(inputs)
        connection.send_result(msg["id"], simulation_result)
    except Exception as err:
        _LOGGER.exception("Simulation execution failed: %s", err)
        connection.send_error(msg["id"], "simulation_error", str(err))


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_LIST_TEMPLATES,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_list_templates(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """List all available built-in starter templates."""
    templates = get_templates()
    connection.send_result(msg["id"], templates)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_TYPE_INSTANTIATE_TEMPLATE,
        vol.Required("template_id"): cv.string,
        vol.Optional(CONF_SYSTEM_ID): cv.string,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_instantiate_template(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Instantiate a new configuration dictionary from a chosen template."""
    template_id = msg["template_id"]
    system_id = msg.get(CONF_SYSTEM_ID)

    try:
        instantiated = instantiate_template(template_id, system_id)
        connection.send_result(msg["id"], instantiated)
    except KeyError as err:
        connection.send_error(msg["id"], "template_not_found", str(err))


def async_setup_websocket(hass: HomeAssistant) -> None:
    """Register all Fuzzy System WebSocket commands."""
    commands = (
        ws_list_systems,
        ws_get_system,
        ws_save_system,
        ws_delete_system,
        ws_simulate,
        ws_list_templates,
        ws_instantiate_template,
    )
    for cmd in commands:
        websocket_api.async_register_command(hass, cmd)
