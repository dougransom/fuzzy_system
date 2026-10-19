"""Constants for the Fuzzy System integration."""

DOMAIN = "fuzzy_system"

# Defuzzification methods
DEF_COG = "cog"  # Center of Gravity / Centroid
DEF_COA = "coa"  # Centroid of Area
DEF_BOA = "boa"  # Bisector of Area
DEF_COS = "cos"  # Center of Sums
DEF_WEIGHTED_AVERAGE = "weighted_average"  # Sugeno / discrete weighted average
DEF_MOM = "mom"  # Mean of Maxima
DEF_SOM = "som"  # Smallest of Maxima
DEF_LOM = "lom"  # Largest of Maxima

# Defuzzification Aliases
DEF_CENTROID = "centroid"
DEF_BISECTOR = "bisector"
DEF_WTAVERAGE = "wtaverage"
DEF_WTSUM = "wtsum"

VALID_DEFUZZIFIERS = [
    DEF_COG,
    DEF_COA,
    DEF_BOA,
    DEF_COS,
    DEF_WEIGHTED_AVERAGE,
    DEF_MOM,
    DEF_SOM,
    DEF_LOM,
    DEF_CENTROID,
    DEF_BISECTOR,
    DEF_WTAVERAGE,
    DEF_WTSUM,
]

# Inference methods
INFERENCE_MAMDANI = "mamdani"
INFERENCE_SUGENO = "sugeno"

VALID_INFERENCE_TYPES = [
    INFERENCE_MAMDANI,
    INFERENCE_SUGENO,
]

# Hedges
HEDGE_VERY = "very"
HEDGE_EXTREMELY = "extremely"
HEDGE_SOMEWHAT = "somewhat"
HEDGE_SLIGHTLY = "slightly"
HEDGE_NOT = "not"

VALID_HEDGES = [
    HEDGE_VERY,
    HEDGE_EXTREMELY,
    HEDGE_SOMEWHAT,
    HEDGE_SLIGHTLY,
    HEDGE_NOT,
]

# Configuration Keys
CONF_SYSTEMS = "systems"
CONF_INPUTS = "inputs"
CONF_OUTPUTS = "outputs"
CONF_RULES = "rules"
CONF_INFERENCE = "inference"
CONF_DEFUZZIFIER = "defuzzifier"
CONF_RANGE = "range"
CONF_TERMS = "terms"
CONF_ENTITY_ID = "entity_id"
CONF_DEFAULT = "default"
CONF_RESOLUTION = "resolution"
CONF_NAME = "name"
CONF_ICON = "icon"
CONF_UNIT_OF_MEASUREMENT = "unit_of_measurement"
CONF_EXPOSE_SYSTEM_SENSOR = "expose_system_sensor"
CONF_SYSTEM_ID = "system_id"
CONF_DESCRIPTION = "description"
CONF_SOURCE = "source"
SOURCE_YAML = "yaml"
SOURCE_CONFIG_ENTRY = "config_entry"
CONF_MAX_UPDATES_PER_PERIOD = "max_updates_per_period"
CONF_UPDATE_PERIOD = "update_period"
CONF_EPSILON = "epsilon"

# Defaults
DEFAULT_MAX_UPDATES_PER_PERIOD = 20
DEFAULT_UPDATE_PERIOD = 0.05
DEFAULT_EPSILON = 0.01


# Internal Data Keys
DATA_YAML_SYSTEMS = "yaml_systems"
DATA_ENTRIES = "entries"

# WebSocket Command Identifiers
WS_TYPE_LIST_SYSTEMS = "fuzzy_system/systems/list"
WS_TYPE_GET_SYSTEM = "fuzzy_system/systems/get"
WS_TYPE_SAVE_SYSTEM = "fuzzy_system/systems/save"
WS_TYPE_DELETE_SYSTEM = "fuzzy_system/systems/delete"
WS_TYPE_SIMULATE = "fuzzy_system/simulate"
WS_TYPE_LIST_TEMPLATES = "fuzzy_system/templates/list"
WS_TYPE_INSTANTIATE_TEMPLATE = "fuzzy_system/templates/instantiate"
WS_TYPE_GENERATE_CARD = "fuzzy_system/dashboard/generate_card"
WS_TYPE_ADD_CARD_TO_DASHBOARD = "fuzzy_system/dashboard/add_card"

# Service Action Identifiers
SERVICE_SIMULATE = "simulate"
SERVICE_EXPLAIN = "explain"
SERVICE_LIST_SYSTEMS = "list_systems"
SERVICE_GET_SYSTEM = "get_system"
SERVICE_GENERATE_CARD = "generate_dashboard_card"
SERVICE_ADD_TO_DASHBOARD = "add_to_dashboard"
SERVICE_LIST_TEMPLATES = "list_templates"
SERVICE_INSTANTIATE_TEMPLATE = "instantiate_template"
