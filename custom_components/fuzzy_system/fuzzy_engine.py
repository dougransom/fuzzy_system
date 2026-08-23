"""Core Fuzzy Logic Engine with scikit-fuzzy integration, hedges, and multiple defuzzifiers."""

from __future__ import annotations

import logging
import re
from typing import Any

import numpy as np
import skfuzzy as fuzz

from .const import (
    DEF_BOA,
    DEF_COA,
    DEF_COG,
    DEF_COS,
    DEF_LOM,
    DEF_MOM,
    DEF_SOM,
    DEF_WEIGHTED_AVERAGE,
    HEDGE_EXTREMELY,
    HEDGE_NOT,
    HEDGE_SLIGHTLY,
    HEDGE_SOMEWHAT,
    HEDGE_VERY,
    INFERENCE_MAMDANI,
    INFERENCE_SUGENO,
)

_LOGGER = logging.getLogger(__name__)


def apply_hedge(membership_values: np.ndarray, hedge: str) -> np.ndarray:
    """Apply a hedge modifier to membership function values."""
    hedge_lower = hedge.lower()
    if hedge_lower == HEDGE_VERY:
        return np.power(membership_values, 2.0)
    if hedge_lower == HEDGE_EXTREMELY:
        return np.power(membership_values, 3.0)
    if hedge_lower == HEDGE_SOMEWHAT:
        return np.power(membership_values, 0.5)
    if hedge_lower == HEDGE_SLIGHTLY:
        return np.power(membership_values, 1.0 / 3.0)
    if hedge_lower == HEDGE_NOT:
        return 1.0 - membership_values
    return membership_values


class FuzzyTerm:
    """Representation of a linguistic fuzzy term (e.g. 'poor', 'good', 'delicious')."""

    def __init__(
        self,
        name: str,
        mf_type: str,
        params: list[float],
        hedge: str | None = None,
    ) -> None:
        """Initialize fuzzy term."""
        self.name = name
        self.mf_type = mf_type.lower()
        self.params = [float(p) for p in params]
        self.hedge = hedge

    def calculate_membership(self, universe: np.ndarray) -> np.ndarray:
        """Calculate membership curve over a given universe of discourse."""
        if self.mf_type == "trimf":
            mfx = fuzz.trimf(universe, self.params)
        elif self.mf_type == "trapmf":
            mfx = fuzz.trapmf(universe, self.params)
        elif self.mf_type == "gaussmf":
            # params: [mean, sigma]
            mfx = fuzz.gaussmf(universe, self.params[0], self.params[1])
        elif self.mf_type == "sigmf":
            # params: [b, c]
            mfx = fuzz.sigmf(universe, self.params[0], self.params[1])
        elif self.mf_type == "gbellmf":
            # params: [a, b, c]
            mfx = fuzz.gbellmf(universe, self.params[0], self.params[1], self.params[2])
        elif self.mf_type in ("singleton", "constant"):
            # params: [value]
            val = self.params[0]
            mfx = np.where(np.isclose(universe, val, atol=1e-3), 1.0, 0.0)
        else:
            raise ValueError(f"Unsupported membership function type: {self.mf_type}")

        if self.hedge:
            mfx = apply_hedge(mfx, self.hedge)
        return np.clip(mfx, 0.0, 1.0)

    def evaluate_crisp(self, crisp_val: float) -> float:
        """Evaluate membership degree for a single crisp scalar input value."""
        single_u = np.array([float(crisp_val)])
        return float(self.calculate_membership(single_u)[0])


class FuzzyVariable:
    """Representation of a fuzzy input or output variable."""

    def __init__(
        self,
        name: str,
        var_range: list[float],
        terms: dict[str, dict[str, Any]],
        resolution: int = 100,
        defuzzifier: str | None = None,
    ) -> None:
        """Initialize fuzzy variable with universe of discourse and linguistic terms."""
        self.name = name
        self.min_val = float(var_range[0])
        self.max_val = float(var_range[1])
        self.resolution = resolution
        self.num_points = resolution + 1
        self.universe = np.linspace(self.min_val, self.max_val, self.num_points)
        self.defuzzifier = defuzzifier.lower() if defuzzifier else None

        self.terms: dict[str, FuzzyTerm] = {}
        for term_name, term_cfg in terms.items():
            mf_type = term_cfg.get("type", "trimf")
            params = term_cfg.get("params", [])
            hedge = term_cfg.get("hedge")
            self.terms[term_name] = FuzzyTerm(term_name, mf_type, params, hedge)

    def get_term_membership(self, term_name: str, crisp_val: float) -> float:
        """Get membership value of crisp_val in specified term."""
        if term_name not in self.terms:
            raise KeyError(f"Term '{term_name}' not defined in variable '{self.name}'")
        return self.terms[term_name].evaluate_crisp(crisp_val)


class FuzzyRule:
    """Representation of a fuzzy IF ... THEN ... rule."""

    def __init__(self, rule_str: str) -> None:
        """Initialize fuzzy rule from string representation.

        Example: 'IF service IS poor OR food IS rancid THEN tip IS cheap'
                 'IF service IS very good THEN tip IS generous'
        """
        self.raw_rule = rule_str
        self.antecedent_str, self.consequent_str = self._parse_rule(rule_str)

    def _parse_rule(self, rule_str: str) -> tuple[str, str]:
        pattern = r"^\s*IF\s+(.+)\s+THEN\s+(.+)\s*$"
        match = re.match(pattern, rule_str, re.IGNORECASE)
        if not match:
            raise ValueError(f"Invalid rule format: '{rule_str}'. Must be 'IF ... THEN ...'")
        return match.group(1).strip(), match.group(2).strip()

    def evaluate_antecedent(
        self, inputs: dict[str, float], fuzzy_vars: dict[str, FuzzyVariable]
    ) -> float:
        """Evaluate firing strength of antecedent given input values."""
        # Simple logical parser supporting AND, OR, NOT, IS, and HEDGES
        expr = self.antecedent_str

        # Replace conditions like "var IS [hedge] term" with numerical evaluations
        # Regex to match: var_name IS [hedge] term_name
        pattern = r"(\b\w+\b)\s+IS\s+((?:very|extremely|somewhat|slightly|not)\s+)?(\b\w+\b)"

        def replace_clause(match: re.Match) -> str:
            var_name = match.group(1)
            hedge_str = match.group(2).strip() if match.group(2) else None
            term_name = match.group(3)

            if var_name not in inputs:
                _LOGGER.warning("Input variable '%s' missing from inputs", var_name)
                return "0.0"
            if var_name not in fuzzy_vars:
                _LOGGER.warning("Fuzzy variable '%s' missing from system variables", var_name)
                return "0.0"

            crisp_val = inputs[var_name]
            fvar = fuzzy_vars[var_name]
            degree = fvar.get_term_membership(term_name, crisp_val)

            if hedge_str:
                degree = float(apply_hedge(np.array([degree]), hedge_str)[0])

            return str(degree)

        eval_str = re.sub(pattern, replace_clause, expr, flags=re.IGNORECASE)

        # Replace AND with min, OR with max, NOT with 1 -
        # For evaluation, we convert logical expression into Python math
        # Standard replacement: "A AND B" -> "min(A, B)", "A OR B" -> "max(A, B)"
        eval_str = re.sub(r"\bAND\b", ",", eval_str, flags=re.IGNORECASE)
        eval_str = re.sub(r"\bOR\b", "|", eval_str, flags=re.IGNORECASE)

        # Evaluate min/max clauses
        try:
            tokens = [t.strip() for t in eval_str.split("|")]
            or_values = []
            for token in tokens:
                and_values = [float(v.strip()) for v in token.split(",") if v.strip()]
                or_values.append(min(and_values) if and_values else 0.0)
            return float(max(or_values)) if or_values else 0.0
        except Exception as err:
            _LOGGER.error("Failed to evaluate fuzzy rule antecedent '%s': %s", expr, err)
            return 0.0

    def parse_consequent(self) -> tuple[str, str, float | None]:
        """Parse consequent into (output_var_name, term_name, optional_constant)."""
        pattern = r"^(\b\w+\b)\s+IS\s+(.+)$"
        match = re.match(pattern, self.consequent_str, re.IGNORECASE)
        if not match:
            raise ValueError(f"Invalid consequent format: '{self.consequent_str}'")
        output_var = match.group(1).strip()
        term_or_val = match.group(2).strip()

        # Check if term_or_val is numeric constant (for Sugeno)
        try:
            constant_val = float(term_or_val)
            return output_var, term_or_val, constant_val
        except ValueError:
            return output_var, term_or_val, None


class FuzzySystemEngine:
    """Fuzzy System Logic Controller executing Mamdani or Sugeno inference."""

    def __init__(
        self,
        name: str,
        inference_type: str = INFERENCE_MAMDANI,
        defuzzifier: str = DEF_COG,
    ) -> None:
        """Initialize Fuzzy System Engine."""
        self.name = name
        self.inference_type = inference_type.lower()
        self.defuzzifier = defuzzifier.lower()

        self.input_vars: dict[str, FuzzyVariable] = {}
        self.output_vars: dict[str, FuzzyVariable] = {}
        self.rules: list[FuzzyRule] = []

    def add_input_variable(
        self,
        name: str,
        var_range: list[float],
        terms: dict[str, dict[str, Any]],
        resolution: int = 100,
    ) -> None:
        """Add input variable to fuzzy engine."""
        self.input_vars[name] = FuzzyVariable(name, var_range, terms, resolution)

    def add_output_variable(
        self,
        name: str,
        var_range: list[float],
        terms: dict[str, dict[str, Any]],
        resolution: int = 100,
        defuzzifier: str | None = None,
    ) -> None:
        """Add output variable to fuzzy engine."""
        self.output_vars[name] = FuzzyVariable(name, var_range, terms, resolution, defuzzifier)

    def add_rule(self, rule_str: str) -> None:
        """Add a rule to rulebase."""
        self.rules.append(FuzzyRule(rule_str))

    def evaluate(self, inputs: dict[str, float]) -> dict[str, dict[str, Any]]:
        """Evaluate inputs through fuzzy system and produce defuzzified output and set curves."""
        if self.inference_type == INFERENCE_SUGENO:
            return self._evaluate_sugeno(inputs)
        return self._evaluate_mamdani(inputs)

    def _evaluate_mamdani(self, inputs: dict[str, float]) -> dict[str, dict[str, Any]]:
        """Perform Mamdani inference and defuzzification."""
        results: dict[str, dict[str, Any]] = {}

        for out_name, out_var in self.output_vars.items():
            aggregated_mf = np.zeros_like(out_var.universe)
            individual_rule_mfs: list[np.ndarray] = []
            rule_strengths: list[dict[str, Any]] = []
            term_activations: dict[str, float] = dict.fromkeys(out_var.terms, 0.0)

            for rule in self.rules:
                out_var_name, term_name, _ = rule.parse_consequent()
                if out_var_name.lower() != out_name.lower():
                    continue

                firing_strength = rule.evaluate_antecedent(inputs, self.input_vars)
                rule_strengths.append(
                    {
                        "rule": rule.raw_rule,
                        "firing_strength": round(firing_strength, 4),
                    }
                )

                if firing_strength <= 0.0:
                    continue

                term = out_var.terms.get(term_name)
                if not term:
                    _LOGGER.warning(
                        "Output term '%s' not found in output variable '%s'", term_name, out_name
                    )
                    continue

                term_activations[term_name] = max(term_activations[term_name], firing_strength)
                term_mf = term.calculate_membership(out_var.universe)
                clipped_mf = np.minimum(firing_strength, term_mf)

                individual_rule_mfs.append(clipped_mf)
                aggregated_mf = np.maximum(aggregated_mf, clipped_mf)

            # Defuzzification using output variable override or engine default
            effective_defuzzifier = out_var.defuzzifier or self.defuzzifier
            defuzz_value = self._defuzzify(
                out_var.universe, aggregated_mf, individual_rule_mfs, effective_defuzzifier
            )

            dominant_term = (
                max(term_activations, key=term_activations.get)
                if any(v > 0 for v in term_activations.values())
                else "none"
            )

            # Term membership distribution dictionary for attributes
            term_memberships = {
                t_name: round(t_obj.evaluate_crisp(defuzz_value), 4)
                for t_name, t_obj in out_var.terms.items()
            }

            results[out_name] = {
                "defuzzified_value": round(defuzz_value, 4),
                "dominant_term": dominant_term,
                "term_activations": {k: round(v, 4) for k, v in term_activations.items()},
                "term_memberships": term_memberships,
                "rule_strengths": rule_strengths,
                "universe": out_var.universe.tolist(),
                "aggregated_set": aggregated_mf.tolist(),
            }

        return results

    def _evaluate_sugeno(self, inputs: dict[str, float]) -> dict[str, dict[str, Any]]:
        """Perform Sugeno zero-order / first-order inference."""
        results: dict[str, dict[str, Any]] = {}

        for out_name, out_var in self.output_vars.items():
            rule_outputs = []
            rule_weights = []
            rule_strengths = []
            term_activations: dict[str, float] = dict.fromkeys(out_var.terms, 0.0)

            for rule in self.rules:
                out_var_name, term_or_val, constant_val = rule.parse_consequent()
                if out_var_name.lower() != out_name.lower():
                    continue

                w = rule.evaluate_antecedent(inputs, self.input_vars)
                rule_strengths.append(
                    {
                        "rule": rule.raw_rule,
                        "firing_strength": round(w, 4),
                    }
                )

                if w <= 0.0:
                    continue

                if term_or_val in term_activations:
                    term_activations[term_or_val] = max(term_activations[term_or_val], w)

                if constant_val is not None:
                    y = constant_val
                elif term_or_val in out_var.terms:
                    # Single value parameter or mean parameter
                    params = out_var.terms[term_or_val].params
                    y = float(params[0]) if params else 0.0
                else:
                    _LOGGER.warning(
                        "Sugeno output '%s' not recognized as constant or term", term_or_val
                    )
                    y = 0.0

                rule_weights.append(w)
                rule_outputs.append(y)

            total_weight = sum(rule_weights)
            if total_weight > 0:
                defuzz_val = (
                    sum(w * y for w, y in zip(rule_weights, rule_outputs, strict=False))
                    / total_weight
                )
            else:
                defuzz_val = out_var.min_val

            dominant_term = (
                max(term_activations, key=term_activations.get)
                if any(v > 0 for v in term_activations.values())
                else "none"
            )

            term_memberships = {
                t_name: round(t_obj.evaluate_crisp(defuzz_val), 4)
                for t_name, t_obj in out_var.terms.items()
            }

            results[out_name] = {
                "defuzzified_value": round(defuzz_val, 4),
                "dominant_term": dominant_term,
                "term_activations": {k: round(v, 4) for k, v in term_activations.items()},
                "term_memberships": term_memberships,
                "rule_strengths": rule_strengths,
                "universe": out_var.universe.tolist(),
                "aggregated_set": [],
            }

        return results

    def _defuzzify(
        self,
        universe: np.ndarray,
        aggregated_mf: np.ndarray,
        individual_rule_mfs: list[np.ndarray],
        method: str,
    ) -> float:
        """Execute defuzzification according to selected algorithm."""
        if np.sum(aggregated_mf) == 0:
            return float(np.mean(universe))

        try:
            if method in (DEF_COG, DEF_COA, DEF_BOA, DEF_MOM, DEF_SOM, DEF_LOM):
                sk_method = "centroid" if method in (DEF_COG, DEF_COA) else method
                return float(fuzz.defuzz(universe, aggregated_mf, sk_method))

            if method == DEF_COS and individual_rule_mfs:
                sum_mf = np.sum(individual_rule_mfs, axis=0)
                sum_area = np.sum(sum_mf)
                if sum_area > 0:
                    return float(np.sum(universe * sum_mf) / sum_area)

            if method in (DEF_WEIGHTED_AVERAGE, DEF_COS):
                return float(np.sum(universe * aggregated_mf) / np.sum(aggregated_mf))

            return float(fuzz.defuzz(universe, aggregated_mf, "centroid"))
        except Exception as err:
            _LOGGER.error("Defuzzification failed for method '%s': %s", method, err)
            return float(np.mean(universe))
