"""Voluptuous validation schemas for the Fuzzy System integration."""

from __future__ import annotations

import voluptuous as vol
from homeassistant.helpers import config_validation as cv

from .const import (
    CONF_DEFAULT,
    CONF_DEFUZZIFIER,
    CONF_ENTITY_ID,
    CONF_EPSILON,
    CONF_ICON,
    CONF_NAME,
    CONF_RANGE,
    CONF_RESOLUTION,
    CONF_TERMS,
    CONF_UNIT_OF_MEASUREMENT,
    VALID_DEFUZZIFIERS,
    VALID_HEDGES,
)

TERM_SCHEMA = vol.Schema(
    {
        vol.Required("type"): cv.string,
        vol.Required("params"): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Optional("hedge"): vol.In(VALID_HEDGES),
    }
)

WS_TERM_SCHEMA = TERM_SCHEMA

# Base input variable schema allowing optional entity_id (for UI drafts / simulator)
WS_INPUT_VAR_SCHEMA = vol.Schema(
    {
        vol.Optional(CONF_ENTITY_ID): cv.string,
        vol.Required(CONF_RANGE): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Required(CONF_TERMS): vol.Schema({cv.string: TERM_SCHEMA}),
        vol.Optional(CONF_DEFAULT, default=0.0): vol.Coerce(float),
        vol.Optional(CONF_RESOLUTION, default=100): vol.Coerce(int),
    }
)

# Runtime input variable schema strictly requiring a valid entity_id
INPUT_VAR_SCHEMA = WS_INPUT_VAR_SCHEMA.extend(
    {
        vol.Required(CONF_ENTITY_ID): cv.entity_id,
    }
)

# Base output variable schema
WS_OUTPUT_VAR_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_RANGE): vol.All(cv.ensure_list, [vol.Coerce(float)]),
        vol.Required(CONF_TERMS): vol.Schema({cv.string: TERM_SCHEMA}),
        vol.Optional(CONF_RESOLUTION, default=100): vol.Coerce(int),
        vol.Optional(CONF_DEFUZZIFIER): vol.In(VALID_DEFUZZIFIERS),
        vol.Optional(CONF_EPSILON): vol.All(vol.Coerce(float), vol.Range(min=0.0)),
        vol.Optional(CONF_NAME): cv.string,
        vol.Optional(CONF_ICON): cv.string,
        vol.Optional(CONF_UNIT_OF_MEASUREMENT): cv.string,
    }
)

# Runtime output variable schema with cv.icon validation
OUTPUT_VAR_SCHEMA = WS_OUTPUT_VAR_SCHEMA.extend(
    {
        vol.Optional(CONF_ICON): cv.icon,
    }
)
