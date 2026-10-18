"""Unit tests for the Fuzzy System Engine."""

import numpy as np
import pytest

from custom_components.fuzzy_system.const import (
    DEF_BOA,
    DEF_COA,
    DEF_COG,
    DEF_COS,
    DEF_LOM,
    DEF_MOM,
    DEF_SOM,
    DEF_WEIGHTED_AVERAGE,
    INFERENCE_MAMDANI,
    INFERENCE_SUGENO,
)
from custom_components.fuzzy_system.fuzzy_engine import (
    FuzzyRule,
    FuzzySystemEngine,
    FuzzyTerm,
    apply_hedge,
)


def test_membership_functions():
    """Test membership function calculation."""
    universe = np.linspace(0, 10, 101)

    # Triangular
    term_tri = FuzzyTerm("good", "trimf", [0, 5, 10])
    mf_tri = term_tri.calculate_membership(universe)
    assert mf_tri[50] == pytest.approx(1.0)
    assert mf_tri[0] == pytest.approx(0.0)
    assert mf_tri[100] == pytest.approx(0.0)

    # Trapezoidal
    term_trap = FuzzyTerm("mid", "trapmf", [2, 4, 6, 8])
    mf_trap = term_trap.calculate_membership(universe)
    assert mf_trap[40] == pytest.approx(1.0)
    assert mf_trap[60] == pytest.approx(1.0)
    assert mf_trap[10] == pytest.approx(0.0)


def test_hedges():
    """Test hedge modifiers."""
    base_mf = np.array([0.0, 0.5, 1.0])

    # Very (power of 2)
    very_mf = apply_hedge(base_mf, "very")
    assert np.allclose(very_mf, [0.0, 0.25, 1.0])

    # Extremely (power of 3)
    extremely_mf = apply_hedge(base_mf, "extremely")
    assert np.allclose(extremely_mf, [0.0, 0.125, 1.0])

    # Somewhat (sqrt)
    somewhat_mf = apply_hedge(base_mf, "somewhat")
    assert np.allclose(somewhat_mf, [0.0, np.sqrt(0.5), 1.0])

    # Not (1 - x)
    not_mf = apply_hedge(base_mf, "not")
    assert np.allclose(not_mf, [1.0, 0.5, 0.0])


def test_rule_inline_hedges():
    """Test evaluation of rules with inline hedges (very, extremely, somewhat, slightly, not)."""
    engine = FuzzySystemEngine(name="hedge_test")
    engine.add_input_variable(
        "service",
        [0, 10],
        {"good": {"type": "trimf", "params": [0, 5, 10]}},
    )
    engine.add_output_variable(
        "tip",
        [0, 25],
        {"generous": {"type": "trimf", "params": [10, 25, 25]}},
    )

    # service = 7.5 -> good membership = 0.5
    rule_base = FuzzyRule("IF service IS good THEN tip IS generous")
    rule_very = FuzzyRule("IF service IS very good THEN tip IS generous")
    rule_somewhat = FuzzyRule("IF service IS somewhat good THEN tip IS generous")
    rule_extremely = FuzzyRule("IF service IS extremely good THEN tip IS generous")
    rule_not = FuzzyRule("IF service IS not good THEN tip IS generous")

    inputs = {"service": 7.5}
    assert rule_base.evaluate_antecedent(inputs, engine.input_vars) == pytest.approx(0.5)
    assert rule_very.evaluate_antecedent(inputs, engine.input_vars) == pytest.approx(0.25)
    assert rule_somewhat.evaluate_antecedent(inputs, engine.input_vars) == pytest.approx(
        0.7071, abs=1e-3
    )
    assert rule_extremely.evaluate_antecedent(inputs, engine.input_vars) == pytest.approx(0.125)
    assert rule_not.evaluate_antecedent(inputs, engine.input_vars) == pytest.approx(0.5)


def test_fuzzy_rule_parsing():
    """Test parsing of IF ... THEN ... rules."""
    rule = FuzzyRule("IF service IS poor OR food IS rancid THEN tip IS cheap")
    assert rule.antecedent_str == "service IS poor OR food IS rancid"
    assert rule.consequent_str == "tip IS cheap"

    out_var, term_name, constant_val = rule.parse_consequent()
    assert out_var == "tip"
    assert term_name == "cheap"
    assert constant_val is None


def test_tipping_problem_mamdani_cog():
    """Test classic Tipping Problem with Mamdani inference & COG defuzzification."""
    engine = FuzzySystemEngine(
        name="tipping", inference_type=INFERENCE_MAMDANI, defuzzifier=DEF_COG
    )

    # Input 1: Service (0 to 10)
    engine.add_input_variable(
        "service",
        [0, 10],
        {
            "poor": {"type": "trimf", "params": [0, 0, 5]},
            "good": {"type": "trimf", "params": [0, 5, 10]},
            "excellent": {"type": "trimf", "params": [5, 10, 10]},
        },
    )

    # Input 2: Food (0 to 10)
    engine.add_input_variable(
        "food",
        [0, 10],
        {
            "rancid": {"type": "trapmf", "params": [0, 0, 1, 3]},
            "delicious": {"type": "trapmf", "params": [7, 9, 10, 10]},
        },
    )

    # Output: Tip (0 to 25%)
    engine.add_output_variable(
        "tip",
        [0, 25],
        {
            "cheap": {"type": "trimf", "params": [0, 0, 13]},
            "average": {"type": "trimf", "params": [0, 13, 25]},
            "generous": {"type": "trimf", "params": [13, 25, 25]},
        },
    )

    # Rules
    engine.add_rule("IF service IS poor OR food IS rancid THEN tip IS cheap")
    engine.add_rule("IF service IS good THEN tip IS average")
    engine.add_rule("IF service IS excellent OR food IS delicious THEN tip IS generous")

    result = engine.evaluate({"service": 6.5, "food": 9.8})
    tip_res = result["tip"]
    defuzz_val = tip_res["defuzzified_value"]

    # Tip is evaluated using COG (~14.8%)
    assert 14.0 <= defuzz_val <= 22.0
    assert "generous" in tip_res["term_memberships"]


@pytest.mark.parametrize(
    "defuzz_method",
    [DEF_COG, DEF_COA, DEF_BOA, DEF_COS, DEF_WEIGHTED_AVERAGE, DEF_MOM, DEF_SOM, DEF_LOM],
)
def test_all_defuzzifiers(defuzz_method):
    """Verify all defuzzification algorithms run without error."""
    engine = FuzzySystemEngine(
        name="test_defuzz", inference_type=INFERENCE_MAMDANI, defuzzifier=defuzz_method
    )
    engine.add_input_variable(
        "temp",
        [0, 100],
        {
            "cold": {"type": "trimf", "params": [0, 0, 50]},
            "hot": {"type": "trimf", "params": [50, 100, 100]},
        },
    )
    engine.add_output_variable(
        "fan",
        [0, 100],
        {
            "low": {"type": "trimf", "params": [0, 0, 50]},
            "high": {"type": "trimf", "params": [50, 100, 100]},
        },
    )
    engine.add_rule("IF temp IS hot THEN fan IS high")
    engine.add_rule("IF temp IS cold THEN fan IS low")

    res = engine.evaluate({"temp": 75.0})
    val = res["fan"]["defuzzified_value"]
    assert 0.0 <= val <= 100.0


def test_per_output_defuzzifier_override():
    """Test overriding defuzzifier on individual output variables."""
    engine = FuzzySystemEngine(
        name="override_test", inference_type=INFERENCE_MAMDANI, defuzzifier=DEF_COG
    )
    engine.add_input_variable(
        "temp",
        [0, 100],
        {
            "cold": {"type": "trimf", "params": [0, 0, 50]},
            "hot": {"type": "trimf", "params": [50, 100, 100]},
        },
    )
    # Output 1 uses default COG
    engine.add_output_variable(
        "fan_cog",
        [0, 100],
        {
            "low": {"type": "trimf", "params": [0, 0, 50]},
            "high": {"type": "trimf", "params": [50, 100, 100]},
        },
    )
    # Output 2 overrides with MOM
    engine.add_output_variable(
        "fan_mom",
        [0, 100],
        {
            "low": {"type": "trimf", "params": [0, 0, 50]},
            "high": {"type": "trimf", "params": [50, 100, 100]},
        },
        defuzzifier=DEF_MOM,
    )
    engine.add_rule("IF temp IS hot THEN fan_cog IS high")
    engine.add_rule("IF temp IS hot THEN fan_mom IS high")

    res = engine.evaluate({"temp": 100.0})
    assert res["fan_cog"]["defuzzified_value"] == pytest.approx(83.3333, abs=0.1)
    assert res["fan_mom"]["defuzzified_value"] == pytest.approx(100.0, abs=0.1)


def test_sugeno_inference():
    """Test Sugeno zero-order inference."""
    engine = FuzzySystemEngine(
        name="sugeno_test", inference_type=INFERENCE_SUGENO, defuzzifier=DEF_WEIGHTED_AVERAGE
    )
    engine.add_input_variable(
        "service",
        [0, 10],
        {
            "poor": {"type": "trimf", "params": [0, 0, 5]},
            "good": {"type": "trimf", "params": [5, 10, 10]},
        },
    )
    engine.add_output_variable(
        "tip",
        [0, 25],
        {
            "cheap": {"type": "singleton", "params": [5.0]},
            "generous": {"type": "singleton", "params": [20.0]},
        },
    )
    engine.add_rule("IF service IS poor THEN tip IS cheap")
    engine.add_rule("IF service IS good THEN tip IS generous")

    # Service = 10 -> 100% good -> tip = 20.0
    res = engine.evaluate({"service": 10.0})
    assert res["tip"]["defuzzified_value"] == pytest.approx(20.0)

    # Service = 0 -> 100% poor -> tip = 5.0
    res_poor = engine.evaluate({"service": 0.0})
    assert res_poor["tip"]["defuzzified_value"] == pytest.approx(5.0)


def test_hedge_and_term_edge_cases():
    """Test hedge fallbacks, invalid membership function types, and boolean terms."""
    from custom_components.fuzzy_system.fuzzy_engine import (
        FuzzyTerm,
        FuzzyVariable,
        apply_hedge,
        get_hedge_function,
    )

    # Unknown hedge returns original array
    arr = np.array([0.2, 0.8])
    assert np.array_equal(apply_hedge(arr, "unknown_hedge"), arr)

    # None hedge returns identity
    identity = get_hedge_function(None)
    assert identity(5) == 5

    # Unsupported MF type
    with pytest.raises(ValueError, match="Unsupported membership function type"):
        FuzzyTerm("bad", "unsupported_type", [1, 2, 3])

    # Term serialization with hedge
    t = FuzzyTerm("hot", "trimf", [20, 30, 40], hedge="very")
    d = t.to_dict()
    assert d["hedge"] == "very"

    # FuzzyVariable with boolean terms (e.g., 'true', 'false')
    var = FuzzyVariable(
        name="switch",
        var_range=[0.0, 1.0],
        terms={
            "false": {"type": "trimf", "params": [0, 0, 0.5]},
            "true": {"type": "trimf", "params": [0.5, 1, 1]},
        },
    )
    assert "off" in var.terms
    assert "on" in var.terms
    assert var.get_term_universe_mf("off") is not None
    assert var.get_term_universe_mf("on") is not None
    assert var.get_term_universe_mf("nonexistent") is None

    # Missing term raises KeyError
    with pytest.raises(KeyError, match="Term 'missing' not defined"):
        var.get_term_membership("missing", 0.5)


def test_antecedent_condition_and_rule_edge_cases():
    """Test condition and rule parsing edge cases."""
    from custom_components.fuzzy_system.fuzzy_engine import (
        AntecedentCondition,
        FuzzyRule,
        FuzzyVariable,
    )

    cond = AntecedentCondition("temp", "hot", hedge="very")
    assert cond.to_str() == "temp IS very hot"
    assert cond.to_dict() == {"variable": "temp", "term": "hot", "hedge": "very"}

    # Missing input variable
    fvar = FuzzyVariable(
        "temp", [0, 100], {"hot": {"type": "trimf", "params": [50, 100, 100]}}
    )
    assert cond.evaluate({}, {"temp": fvar}) == 0.0
    # Missing fuzzy variable
    assert cond.evaluate({"temp": 75.0}, {}) == 0.0

    # Invalid rule format
    with pytest.raises(ValueError, match="Invalid rule format"):
        FuzzyRule("NOT A VALID RULE")

    # Invalid consequent format
    with pytest.raises(ValueError, match="Invalid consequent format"):
        FuzzyRule("IF temp IS hot THEN invalidconsequent")

    # Rule with empty condition group
    rule = FuzzyRule("IF temp IS hot THEN fan IS high")
    assert rule.evaluate_antecedent({"temp": 100.0}, {"temp": fvar}) == 1.0


def test_defuzzifier_exception_fallback_and_wrapper():
    """Test defuzzifier exception and empty aggregate fallback."""
    from custom_components.fuzzy_system.fuzzy_engine import Defuzzifier, FuzzySystemEngine

    defuzz = Defuzzifier("cog")
    u = np.linspace(0, 10, 11)
    zeros = np.zeros_like(u)
    # np.sum == 0 fallback to mean of universe
    assert defuzz(u, zeros, []) == pytest.approx(5.0)

    # Compatibility wrapper on engine
    engine = FuzzySystemEngine("test")
    val = engine._defuzzify(u, zeros, [], "cog")
    assert val == pytest.approx(5.0)


def test_sugeno_numeric_constant_consequent_and_simulate_no_firing():
    """Test Sugeno with numeric constant in consequent and simulate when no rules fire."""
    config = {
        "name": "sugeno_const",
        "inference": "sugeno",
        "defuzzifier": "weighted_average",
        "inputs": {
            "sensor_val": {
                "range": [0, 10],
                "terms": {"high": {"type": "trimf", "params": [8, 10, 10]}},
            }
        },
        "outputs": {
            "power": {
                "range": [0, 100],
                "terms": {"zero": {"type": "singleton", "params": [0.0]}},
            }
        },
        "rules": [
            "IF sensor_val IS high THEN power IS 99.5",
            "IF   THEN",  # Empty rule string should be ignored by from_dict
        ],
    }
    engine = FuzzySystemEngine.from_dict(config)
    res = engine.evaluate({"sensor_val": 10.0})
    assert res["power"]["defuzzified_value"] == pytest.approx(99.5)

    # Simulate with inputs that fire nothing
    sim = engine.simulate({"sensor_val": 0.0})
    assert "No rules fired" in sim["explainability"]

