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

VALID_DEFUZZIFIERS = [
    DEF_COG,
    DEF_COA,
    DEF_BOA,
    DEF_COS,
    DEF_WEIGHTED_AVERAGE,
    DEF_MOM,
    DEF_SOM,
    DEF_LOM,
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
