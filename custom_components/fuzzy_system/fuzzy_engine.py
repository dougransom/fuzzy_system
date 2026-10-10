"""Core Fuzzy Logic Engine with scikit-fuzzy integration, hedges, and multiple defuzzifiers."""

from __future__ import annotations

import logging
import re
from collections.abc import Callable
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

# -----------------------------------------------------------------------------
# Pre-compiled Regular Expressions
# -----------------------------------------------------------------------------
_RE_RULE = re.compile(r"^\s*IF\s+(.+)\s+THEN\s+(.+)\s*$", re.IGNORECASE)
_RE_CONSEQUENT = re.compile(r"^(\b\w+\b)\s+IS\s+(.+)$", re.IGNORECASE)
_RE_CLAUSE = re.compile(
    r"(\b\w+\b)\s+IS\s+((?:very|extremely|somewhat|slightly|not)\s+)?(\b\w+\b)",
    re.IGNORECASE,
)
_RE_AND = re.compile(r"\bAND\b", re.IGNORECASE)
_RE_OR = re.compile(r"\bOR\b", re.IGNORECASE)

# -----------------------------------------------------------------------------
# Functional Hedge Dispatch Table
# -----------------------------------------------------------------------------
_HEDGE_FUNCTIONS: dict[str, Callable[[Any], Any]] = {
    HEDGE_VERY: lambda x: np.power(x, 2.0),
    HEDGE_EXTREMELY: lambda x: np.power(x, 3.0),
    HEDGE_SOMEWHAT: lambda x: np.power(x, 0.5),
    HEDGE_SLIGHTLY: lambda x: np.power(x, 1.0 / 3.0),
    HEDGE_NOT: lambda x: 1.0 - x,
}


def _identity_func(x: Any) -> Any:
    return x


def get_hedge_function(hedge: str | None) -> Callable[[Any], Any]:
    """Retrieve functional hedge transformation, defaulting to identity."""
    if not hedge:
        return _identity_func
    return _HEDGE_FUNCTIONS.get(hedge.lower(), _identity_func)


def apply_hedge(membership_values: np.ndarray, hedge: str) -> np.ndarray:
    """Apply a hedge modifier to membership function values using functional table lookup."""
    func = _HEDGE_FUNCTIONS.get(hedge.lower())
    if func is not None:
        return func(membership_values)
    return membership_values


# -----------------------------------------------------------------------------
# Membership Function Factory Table
# -----------------------------------------------------------------------------
_MF_FACTORIES: dict[str, Callable[[list[float]], Callable[[np.ndarray], np.ndarray]]] = {
    "trimf": lambda p: lambda u: fuzz.trimf(u, p),
    "trapmf": lambda p: lambda u: fuzz.trapmf(u, p),
    "gaussmf": lambda p: lambda u: fuzz.gaussmf(u, p[0], p[1]),
    "sigmf": lambda p: lambda u: fuzz.sigmf(u, p[0], p[1]),
    "gbellmf": lambda p: lambda u: fuzz.gbellmf(u, p[0], p[1], p[2]),
    "singleton": lambda p: lambda u: np.where(np.isclose(u, p[0], atol=1e-3), 1.0, 0.0),
    "constant": lambda p: lambda u: np.where(np.isclose(u, p[0], atol=1e-3), 1.0, 0.0),
}


# -----------------------------------------------------------------------------
# Defuzzification Strategy Table & Class
# -----------------------------------------------------------------------------
def _defuzz_cos(
    universe: np.ndarray,
    aggregated_mf: np.ndarray,
    individual_rule_mfs: list[np.ndarray],
) -> float:
    if individual_rule_mfs:
        sum_mf = np.sum(individual_rule_mfs, axis=0)
        sum_area = np.sum(sum_mf)
        if sum_area > 0:
            return float(np.sum(universe * sum_mf) / sum_area)
    sum_agg = np.sum(aggregated_mf)
    return (
        float(np.sum(universe * aggregated_mf) / sum_agg)
        if sum_agg > 0
        else float(np.mean(universe))
    )


def _defuzz_weighted_average(
    universe: np.ndarray,
    aggregated_mf: np.ndarray,
    _individual_rule_mfs: list[np.ndarray],
) -> float:
    sum_agg = np.sum(aggregated_mf)
    return (
        float(np.sum(universe * aggregated_mf) / sum_agg)
        if sum_agg > 0
        else float(np.mean(universe))
    )


_DEFUZZIFIERS: dict[str, Callable[[np.ndarray, np.ndarray, list[np.ndarray]], float]] = {
    DEF_COG: lambda u, agg, _: float(fuzz.defuzz(u, agg, "centroid")),
    DEF_COA: lambda u, agg, _: float(fuzz.defuzz(u, agg, "centroid")),
    DEF_BOA: lambda u, agg, _: float(fuzz.defuzz(u, agg, "bisector")),
    DEF_MOM: lambda u, agg, _: float(fuzz.defuzz(u, agg, "mom")),
    DEF_SOM: lambda u, agg, _: float(fuzz.defuzz(u, agg, "som")),
    DEF_LOM: lambda u, agg, _: float(fuzz.defuzz(u, agg, "lom")),
    DEF_COS: _defuzz_cos,
    DEF_WEIGHTED_AVERAGE: _defuzz_weighted_average,
}


class Defuzzifier:
    """Defuzzification callable strategy resolved once during initialization."""

    def __init__(self, method: str) -> None:
        """Initialize defuzzifier strategy."""
        self.method = method.lower()
        self._strategy = _DEFUZZIFIERS.get(self.method, _DEFUZZIFIERS[DEF_COG])

    def __call__(
        self,
        universe: np.ndarray,
        aggregated_mf: np.ndarray,
        individual_rule_mfs: list[np.ndarray],
    ) -> float:
        """Execute defuzzification strategy with fallback handling."""
        if np.sum(aggregated_mf) == 0:
            return float(np.mean(universe))
        try:
            return self._strategy(universe, aggregated_mf, individual_rule_mfs)
        except Exception as err:
            _LOGGER.error("Defuzzification failed for method '%s': %s", self.method, err)
            return float(np.mean(universe))


# -----------------------------------------------------------------------------
# Fuzzy Term
# -----------------------------------------------------------------------------
class FuzzyTerm:
    """Representation of a linguistic fuzzy term with pre-bound calculation closures."""

    def __init__(
        self,
        name: str,
        mf_type: str,
        params: list[float],
        hedge: str | None = None,
    ) -> None:
        """Initialize fuzzy term and bind computation callables once."""
        self.name = name
        self.mf_type = mf_type.lower()
        self.params = [float(p) for p in params]
        self.hedge = hedge

        factory = _MF_FACTORIES.get(self.mf_type)
        if not factory:
            raise ValueError(f"Unsupported membership function type: {self.mf_type}")

        self._raw_calc: Callable[[np.ndarray], np.ndarray] = factory(self.params)
        self._hedge_calc: Callable[[Any], Any] = get_hedge_function(hedge)

    def calculate_membership(self, universe: np.ndarray) -> np.ndarray:
        """Calculate membership curve over a given universe of discourse."""
        mfx = self._raw_calc(universe)
        if self.hedge:
            mfx = self._hedge_calc(mfx)
        return np.clip(mfx, 0.0, 1.0)

    def evaluate_crisp(self, crisp_val: float) -> float:
        """Evaluate membership degree for a single crisp scalar input value."""
        single_u = np.array([float(crisp_val)])
        return float(self.calculate_membership(single_u)[0])


# -----------------------------------------------------------------------------
# Fuzzy Variable
# -----------------------------------------------------------------------------
class FuzzyVariable:
    """Representation of a fuzzy input or output variable with pre-bound defuzzifier."""

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
        self.defuzzifier_strategy: Defuzzifier | None = (
            Defuzzifier(self.defuzzifier) if self.defuzzifier else None
        )

        self.terms: dict[str, FuzzyTerm] = {}
        self.term_universe_mfs: dict[str, np.ndarray] = {}
        for term_name, term_cfg in terms.items():
            mf_type = term_cfg.get("type", "trimf")
            params = term_cfg.get("params", [])
            hedge = term_cfg.get("hedge")
            term_obj = FuzzyTerm(term_name, mf_type, params, hedge)
            self.terms[term_name] = term_obj
            self.term_universe_mfs[term_name] = term_obj.calculate_membership(self.universe)

    def get_term_membership(self, term_name: str, crisp_val: float) -> float:
        """Get membership value of crisp_val in specified term."""
        term = self.terms.get(term_name)
        if not term:
            raise KeyError(f"Term '{term_name}' not defined in variable '{self.name}'")
        return term.evaluate_crisp(crisp_val)


# -----------------------------------------------------------------------------
# Pre-Compiled Antecedent Condition & Rule
# -----------------------------------------------------------------------------
class AntecedentCondition:
    """Pre-compiled condition clause 'var IS [hedge] term' evaluated during inference."""

    def __init__(self, var_name: str, term_name: str, hedge: str | None = None) -> None:
        """Initialize condition clause."""
        self.var_name = var_name
        self.term_name = term_name
        self.hedge = hedge.lower() if hedge else None
        self._hedge_calc = get_hedge_function(self.hedge)

    def evaluate(self, inputs: dict[str, float], fuzzy_vars: dict[str, FuzzyVariable]) -> float:
        """Evaluate single condition degree against current crisp inputs."""
        if self.var_name not in inputs:
            _LOGGER.warning("Input variable '%s' missing from inputs", self.var_name)
            return 0.0
        if self.var_name not in fuzzy_vars:
            _LOGGER.warning("Fuzzy variable '%s' missing from system variables", self.var_name)
            return 0.0

        crisp_val = inputs[self.var_name]
        fvar = fuzzy_vars[self.var_name]
        deg = fvar.get_term_membership(self.term_name, crisp_val)
        if self.hedge:
            deg = float(self._hedge_calc(deg))
        return deg


class FuzzyRule:
    """Representation of a fuzzy IF ... THEN ... rule, parsed and structured on initialization."""

    def __init__(self, rule_str: str) -> None:
        """Initialize and pre-compile fuzzy rule components."""
        self.raw_rule = rule_str
        self.antecedent_str, self.consequent_str = self._parse_rule(rule_str)

        # Pre-compile consequent structure
        self.output_var, self.consequent_term, self.consequent_constant = (
            self._compile_consequent(self.consequent_str)
        )

        # Pre-compile antecedent conditions into DNF (OR of ANDs)
        self._antecedent_groups: list[list[AntecedentCondition]] = self._compile_antecedent(
            self.antecedent_str
        )

    def _parse_rule(self, rule_str: str) -> tuple[str, str]:
        match = _RE_RULE.match(rule_str)
        if not match:
            raise ValueError(f"Invalid rule format: '{rule_str}'. Must be 'IF ... THEN ...'")
        return match.group(1).strip(), match.group(2).strip()

    def _compile_consequent(self, consequent_str: str) -> tuple[str, str, float | None]:
        match = _RE_CONSEQUENT.match(consequent_str)
        if not match:
            raise ValueError(f"Invalid consequent format: '{consequent_str}'")
        output_var = match.group(1).strip()
        term_or_val = match.group(2).strip()
        try:
            constant_val = float(term_or_val)
            return output_var, term_or_val, constant_val
        except ValueError:
            return output_var, term_or_val, None

    def _compile_antecedent(self, antecedent_str: str) -> list[list[AntecedentCondition]]:
        or_tokens = _RE_OR.split(antecedent_str)
        groups: list[list[AntecedentCondition]] = []
        for or_token in or_tokens:
            and_tokens = _RE_AND.split(or_token)
            and_group: list[AntecedentCondition] = []
            for clause in and_tokens:
                clause = clause.strip()
                if not clause:
                    continue
                match = _RE_CLAUSE.search(clause)
                if match:
                    var_name = match.group(1)
                    hedge = match.group(2).strip() if match.group(2) else None
                    term_name = match.group(3)
                    and_group.append(AntecedentCondition(var_name, term_name, hedge))
            if and_group:
                groups.append(and_group)
        return groups

    def parse_consequent(self) -> tuple[str, str, float | None]:
        """Return pre-compiled consequent tuple."""
        return self.output_var, self.consequent_term, self.consequent_constant

    def evaluate_antecedent(
        self, inputs: dict[str, float], fuzzy_vars: dict[str, FuzzyVariable]
    ) -> float:
        """Evaluate firing strength of antecedent using pre-compiled condition tree."""
        if not self._antecedent_groups:
            return 0.0

        or_values = [
            min(cond.evaluate(inputs, fuzzy_vars) for cond in and_group)
            for and_group in self._antecedent_groups
        ]
        return float(max(or_values)) if or_values else 0.0


# -----------------------------------------------------------------------------
# Fuzzy System Engine
# -----------------------------------------------------------------------------
class FuzzySystemEngine:
    """Fuzzy System Logic Controller executing Mamdani or Sugeno inference."""

    def __init__(
        self,
        name: str,
        inference_type: str = INFERENCE_MAMDANI,
        defuzzifier: str = DEF_COG,
    ) -> None:
        """Initialize Fuzzy System Engine and bind inference evaluator strategy."""
        self.name = name
        self.inference_type = inference_type.lower()
        self.defuzzifier = defuzzifier.lower()
        self.defuzzifier_strategy = Defuzzifier(self.defuzzifier)

        # Pre-bind inference evaluator once on initialization
        self._evaluator: Callable[[dict[str, float]], dict[str, dict[str, Any]]] = (
            self._evaluate_sugeno
            if self.inference_type == INFERENCE_SUGENO
            else self._evaluate_mamdani
        )

        self.input_vars: dict[str, FuzzyVariable] = {}
        self.output_vars: dict[str, FuzzyVariable] = {}
        self.rules: list[FuzzyRule] = []
        self._rules_by_output: dict[str, list[FuzzyRule]] = {}

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
        """Add a rule to rulebase and index by target output variable."""
        rule = FuzzyRule(rule_str)
        self.rules.append(rule)
        out_key = rule.output_var.lower()
        if out_key not in self._rules_by_output:
            self._rules_by_output[out_key] = []
        self._rules_by_output[out_key].append(rule)

    def evaluate(self, inputs: dict[str, float]) -> dict[str, dict[str, Any]]:
        """Evaluate inputs through fuzzy system using pre-bound evaluator."""
        return self._evaluator(inputs)

    def _evaluate_mamdani(self, inputs: dict[str, float]) -> dict[str, dict[str, Any]]:
        """Perform Mamdani inference and defuzzification."""
        results: dict[str, dict[str, Any]] = {}

        for out_name, out_var in self.output_vars.items():
            aggregated_mf = np.zeros_like(out_var.universe)
            individual_rule_mfs: list[np.ndarray] = []
            rule_strengths: list[dict[str, Any]] = []
            term_activations: dict[str, float] = dict.fromkeys(out_var.terms, 0.0)

            defuzz_strategy = out_var.defuzzifier_strategy or self.defuzzifier_strategy
            rules_for_out = self._rules_by_output.get(out_name.lower(), [])

            for rule in rules_for_out:
                firing_strength = rule.evaluate_antecedent(inputs, self.input_vars)
                rule_strengths.append(
                    {
                        "rule": rule.raw_rule,
                        "firing_strength": round(firing_strength, 4),
                    }
                )

                if firing_strength <= 0.0:
                    continue

                term_name = rule.consequent_term
                term_mf = out_var.term_universe_mfs.get(term_name)
                if term_mf is None:
                    _LOGGER.warning(
                        "Output term '%s' not found in output variable '%s'", term_name, out_name
                    )
                    continue

                term_activations[term_name] = max(term_activations[term_name], firing_strength)
                clipped_mf = np.minimum(firing_strength, term_mf)
                individual_rule_mfs.append(clipped_mf)
                aggregated_mf = np.maximum(aggregated_mf, clipped_mf)

            defuzz_value = defuzz_strategy(
                out_var.universe, aggregated_mf, individual_rule_mfs
            )

            dominant_term = (
                max(term_activations, key=term_activations.get)  # type: ignore[arg-type]
                if any(v > 0 for v in term_activations.values())
                else "none"
            )

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
            rule_outputs: list[float] = []
            rule_weights: list[float] = []
            rule_strengths: list[dict[str, Any]] = []
            term_activations: dict[str, float] = dict.fromkeys(out_var.terms, 0.0)

            rules_for_out = self._rules_by_output.get(out_name.lower(), [])

            for rule in rules_for_out:
                w = rule.evaluate_antecedent(inputs, self.input_vars)
                rule_strengths.append(
                    {
                        "rule": rule.raw_rule,
                        "firing_strength": round(w, 4),
                    }
                )

                if w <= 0.0:
                    continue

                term_or_val = rule.consequent_term
                constant_val = rule.consequent_constant

                if term_or_val in term_activations:
                    term_activations[term_or_val] = max(term_activations[term_or_val], w)

                if constant_val is not None:
                    y = constant_val
                elif term_or_val in out_var.terms:
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
                max(term_activations, key=term_activations.get)  # type: ignore[arg-type]
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
        """Compatibility wrapper delegating to Defuzzifier strategy."""
        return Defuzzifier(method)(universe, aggregated_mf, individual_rule_mfs)
