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
