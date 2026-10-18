"""Tests for Fuzzy System Engine serialization, AST parsing, and simulation."""

import pytest

from custom_components.fuzzy_system.const import (
    DEF_COG,
    DEF_WEIGHTED_AVERAGE,
    INFERENCE_MAMDANI,
    INFERENCE_SUGENO,
)
from custom_components.fuzzy_system.fuzzy_engine import (
    AntecedentCondition,
    FuzzyRule,
    FuzzySystemEngine,
)


def test_antecedent_condition_serialization():
    """Test AntecedentCondition to_dict and to_str."""
    cond = AntecedentCondition(var_name="temperature", term_name="hot", hedge="very")
    assert cond.to_dict() == {
        "variable": "temperature",
        "term": "hot",
        "hedge": "very",
    }
    assert cond.to_str() == "temperature IS very hot"

    cond_no_hedge = AntecedentCondition(var_name="humidity", term_name="dry")
    assert cond_no_hedge.to_dict() == {
        "variable": "humidity",
        "term": "dry",
        "hedge": None,
    }
    assert cond_no_hedge.to_str() == "humidity IS dry"


def test_fuzzy_rule_ast_roundtrip():
    """Test FuzzyRule AST export and compilation."""
    rule_str = "IF temperature IS hot AND humidity IS dry OR temperature IS very cold THEN fan_speed IS high"
    rule = FuzzyRule(rule_str)
    ast = rule.to_ast()

    assert ast["raw"] == rule_str
    assert ast["consequent"] == {
        "variable": "fan_speed",
        "term": "high",
        "constant": None,
    }
    assert len(ast["antecedent"]) == 2  # 2 OR groups

    # Group 1: temperature IS hot AND humidity IS dry
    assert len(ast["antecedent"][0]) == 2
    assert ast["antecedent"][0][0] == {"variable": "temperature", "term": "hot", "hedge": None}
    assert ast["antecedent"][0][1] == {"variable": "humidity", "term": "dry", "hedge": None}

    # Group 2: temperature IS very cold
    assert len(ast["antecedent"][1]) == 1
    assert ast["antecedent"][1][0] == {"variable": "temperature", "term": "cold", "hedge": "very"}

    # Recompile from AST
    recompiled = FuzzyRule.compile_from_ast(ast)
    assert (
        "IF temperature IS hot AND humidity IS dry OR temperature IS very cold THEN fan_speed IS high"
        == recompiled
    )


def test_fuzzy_engine_serialization_roundtrip():
    """Test serializing engine to dict and reconstructing from dict."""
    engine = FuzzySystemEngine(
        name="climate_ctrl", inference_type=INFERENCE_MAMDANI, defuzzifier=DEF_COG
    )
    engine.add_input_variable(
        name="temperature",
        var_range=[10.0, 35.0],
        terms={
            "cold": {"type": "trimf", "params": [10.0, 10.0, 22.0]},
            "hot": {"type": "trimf", "params": [22.0, 35.0, 35.0]},
        },
        resolution=100,
    )
    engine.add_output_variable(
        name="cooling",
        var_range=[0.0, 100.0],
        terms={
            "low": {"type": "trimf", "params": [0.0, 0.0, 50.0]},
            "high": {"type": "trimf", "params": [50.0, 100.0, 100.0]},
        },
        resolution=100,
    )
    engine.add_rule("IF temperature IS hot THEN cooling IS high")
    engine.add_rule("IF temperature IS cold THEN cooling IS low")

    serialized = engine.to_dict()
    assert serialized["name"] == "climate_ctrl"
    assert serialized["inference"] == "mamdani"
    assert serialized["defuzzifier"] == "cog"
    assert "temperature" in serialized["inputs"]
    assert "cooling" in serialized["outputs"]
    assert len(serialized["rules"]) == 2

    reconstructed = FuzzySystemEngine.from_dict(serialized)
    assert reconstructed.name == "climate_ctrl"
    assert reconstructed.inference_type == "mamdani"
    assert reconstructed.defuzzifier == "cog"
    assert "temperature" in reconstructed.input_vars
    assert "cooling" in reconstructed.output_vars
    assert len(reconstructed.rules) == 2

    # Verify both produce identical numerical evaluation
    res_orig = engine.evaluate({"temperature": 28.0})
    res_recon = reconstructed.evaluate({"temperature": 28.0})
    assert res_orig["cooling"]["defuzzified_value"] == res_recon["cooling"]["defuzzified_value"]


def test_fuzzy_engine_simulate_diagnostics():
    """Test engine simulate helper with explainability and bottleneck tracking."""
    engine = FuzzySystemEngine(
        name="sim_test", inference_type=INFERENCE_MAMDANI, defuzzifier=DEF_COG
    )
    engine.add_input_variable(
        name="temp",
        var_range=[0.0, 40.0],
        terms={
            "cold": {"type": "trimf", "params": [0.0, 0.0, 20.0]},
            "hot": {"type": "trimf", "params": [20.0, 40.0, 40.0]},
        },
    )
    engine.add_input_variable(
        name="humidity",
        var_range=[0.0, 100.0],
        terms={
            "dry": {"type": "trimf", "params": [0.0, 0.0, 50.0]},
            "humid": {"type": "trimf", "params": [50.0, 100.0, 100.0]},
        },
    )
    engine.add_output_variable(
        name="fan",
        var_range=[0.0, 100.0],
        terms={
            "low": {"type": "trimf", "params": [0.0, 0.0, 50.0]},
            "high": {"type": "trimf", "params": [50.0, 100.0, 100.0]},
        },
    )
    engine.add_rule("IF temp IS hot AND humidity IS humid THEN fan IS high")
    engine.add_rule("IF temp IS cold THEN fan IS low")

    # temp = 35 (hot = 0.75), humidity = 75 (humid = 0.5)
    # Rule 1 bottleneck is humidity IS humid (0.5)
    sim = engine.simulate({"temp": 35.0, "humidity": 75.0})

    assert "defuzzified_values" in sim
    assert "dominant_terms" in sim
    assert "term_activations" in sim
    assert "rule_strengths" in sim
    assert "aggregated_sets" in sim
    assert "explainability" in sim

    assert sim["dominant_terms"]["fan"] == "high"
    assert sim["defuzzified_values"]["fan"] > 50.0

    rule1 = sim["rule_strengths"][0]
    assert rule1["firing_strength"] == pytest.approx(0.5)
    assert rule1["bottleneck_clause"]["variable"] == "humidity"
    assert rule1["bottleneck_clause"]["term"] == "humid"

    assert "Top firing rule fired with strength 0.5" in sim["explainability"]
    assert "Limiting clause: humidity IS humid" in sim["explainability"]


def test_sugeno_simulate_diagnostics():
    """Test simulate diagnostics for Sugeno system."""
    engine = FuzzySystemEngine(
        name="sugeno_sim", inference_type=INFERENCE_SUGENO, defuzzifier=DEF_WEIGHTED_AVERAGE
    )
    engine.add_input_variable(
        name="moisture",
        var_range=[0.0, 100.0],
        terms={
            "dry": {"type": "trimf", "params": [0.0, 0.0, 50.0]},
            "wet": {"type": "trimf", "params": [50.0, 100.0, 100.0]},
        },
    )
    engine.add_output_variable(
        name="water",
        var_range=[0.0, 60.0],
        terms={
            "stop": {"type": "singleton", "params": [0.0]},
            "run": {"type": "singleton", "params": [30.0]},
        },
    )
    engine.add_rule("IF moisture IS dry THEN water IS run")
    engine.add_rule("IF moisture IS wet THEN water IS stop")

    sim = engine.simulate({"moisture": 10.0})
    assert sim["dominant_terms"]["water"] == "run"
    assert sim["defuzzified_values"]["water"] == pytest.approx(30.0)
    assert "Output 'water' defuzzified to 30.0" in sim["explainability"]
