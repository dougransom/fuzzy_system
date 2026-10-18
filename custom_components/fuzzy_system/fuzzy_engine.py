"""Core Fuzzy Logic Engine with scikit-fuzzy integration, hedges, and multiple defuzzifiers."""

from __future__ import annotations

import logging
import re
from collections.abc import Callable
from dataclasses import dataclass, field
from functools import cached_property
from typing import Any

import numpy as np
import skfuzzy as fuzz

from .const import (
    DEF_BISECTOR,
    DEF_BOA,
    DEF_CENTROID,
    DEF_COA,
    DEF_COG,
    DEF_COS,
    DEF_LOM,
    DEF_MOM,
    DEF_SOM,
    DEF_WEIGHTED_AVERAGE,
    DEF_WTAVERAGE,
    DEF_WTSUM,
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
def _power_hedge(exponent: float) -> Callable[[Any], Any]:
    """Create an exponential hedge transformation (x -> x^exponent)."""
    return lambda x: np.power(x, exponent)


_HEDGE_FUNCTIONS: dict[str, Callable[[Any], Any]] = {
    HEDGE_VERY: _power_hedge(2.0),
    HEDGE_EXTREMELY: _power_hedge(3.0),
    HEDGE_SOMEWHAT: _power_hedge(0.5),
    HEDGE_SLIGHTLY: _power_hedge(1.0 / 3.0),
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
def _make_mf_factory(
    fn: Callable[..., np.ndarray], *, unpack: bool = False
) -> Callable[[list[float]], Callable[[np.ndarray], np.ndarray]]:
    """Create a curried membership function factory (params -> universe -> mf)."""
    return (lambda p: lambda u: fn(u, *p)) if unpack else (lambda p: lambda u: fn(u, p))


_MF_FACTORIES: dict[str, Callable[[list[float]], Callable[[np.ndarray], np.ndarray]]] = {
    "trimf": _make_mf_factory(fuzz.trimf),
    "trapmf": _make_mf_factory(fuzz.trapmf),
    "gaussmf": _make_mf_factory(fuzz.gaussmf, unpack=True),
    "sigmf": _make_mf_factory(fuzz.sigmf, unpack=True),
    "gbellmf": _make_mf_factory(fuzz.gbellmf, unpack=True),
    "singleton": _make_mf_factory(
        lambda u, p: np.where(np.isclose(u, p[0], atol=1e-3), 1.0, 0.0)
    ),
}
_MF_FACTORIES["constant"] = _MF_FACTORIES["singleton"]


# -----------------------------------------------------------------------------
# Defuzzification Strategy Table & Class
# -----------------------------------------------------------------------------
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
    return _defuzz_weighted_average(universe, aggregated_mf, individual_rule_mfs)


def _make_defuzz(
    method: str,
) -> Callable[[np.ndarray, np.ndarray, list[np.ndarray]], float]:
    """Create a defuzzifier strategy wrapping scikit-fuzzy defuzz."""
    return lambda u, agg, _: float(fuzz.defuzz(u, agg, method))


_DEFUZZIFIERS: dict[str, Callable[[np.ndarray, np.ndarray, list[np.ndarray]], float]] = {
    DEF_COG: _make_defuzz("centroid"),
    DEF_COA: _make_defuzz("centroid"),
    DEF_CENTROID: _make_defuzz("centroid"),
    DEF_BOA: _make_defuzz("bisector"),
    DEF_BISECTOR: _make_defuzz("bisector"),
    DEF_MOM: _make_defuzz("mom"),
    DEF_SOM: _make_defuzz("som"),
    DEF_LOM: _make_defuzz("lom"),
    DEF_COS: _defuzz_cos,
    DEF_WEIGHTED_AVERAGE: _defuzz_weighted_average,
    DEF_WTAVERAGE: _defuzz_weighted_average,
    DEF_WTSUM: _defuzz_weighted_average,
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

    def to_dict(self) -> dict[str, Any]:
        """Serialize term to dictionary."""
        data: dict[str, Any] = {
            "type": self.mf_type,
            "params": self.params,
        }
        if self.hedge:
            data["hedge"] = self.hedge
        return data


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
            t_name = str(term_name)
            mf_type = term_cfg.get("type", "trimf")
            params = term_cfg.get("params", [])
            hedge = term_cfg.get("hedge")
            term_obj = FuzzyTerm(t_name, mf_type, params, hedge)
            self.terms[t_name] = term_obj
            self.term_universe_mfs[t_name] = term_obj.calculate_membership(self.universe)

            # YAML 1.1 boolean parsing alias (unquoted 'off' -> 'False', 'on' -> 'True')
            t_lower = t_name.lower()
            if t_lower in ("false", "no") and "off" not in self.terms:
                self.terms["off"] = term_obj
                self.term_universe_mfs["off"] = self.term_universe_mfs[t_name]
            elif t_lower in ("true", "yes") and "on" not in self.terms:
                self.terms["on"] = term_obj
                self.term_universe_mfs["on"] = self.term_universe_mfs[t_name]

    def get_term_universe_mf(self, term_name: str) -> np.ndarray | None:
        """Get term membership array across universe with case-insensitive and boolean fallback."""
        if term_name in self.term_universe_mfs:
            return self.term_universe_mfs[term_name]
        t_lower = term_name.lower()
        for k, v in self.term_universe_mfs.items():
            if k.lower() == t_lower:
                return v
        if t_lower == "off":
            for k in ("false", "False", "no", "No"):
                if k in self.term_universe_mfs:
                    return self.term_universe_mfs[k]
        elif t_lower == "on":
            for k in ("true", "True", "yes", "Yes"):
                if k in self.term_universe_mfs:
                    return self.term_universe_mfs[k]
        return None

    def get_term_membership(self, term_name: str, crisp_val: float) -> float:
        """Get membership value of crisp_val in specified term."""
        term = self.terms.get(term_name)
        if not term:
            t_lower = term_name.lower()
            for k, obj in self.terms.items():
                if k.lower() == t_lower:
                    term = obj
                    break
        if not term:
            raise KeyError(f"Term '{term_name}' not defined in variable '{self.name}'")
        return term.evaluate_crisp(crisp_val)

    def to_dict(self) -> dict[str, Any]:
        """Serialize fuzzy variable configuration to dictionary."""
        data: dict[str, Any] = {
            "range": [self.min_val, self.max_val],
            "resolution": self.resolution,
            "terms": {t_name: t_obj.to_dict() for t_name, t_obj in self.terms.items()},
        }
        if self.defuzzifier:
            data["defuzzifier"] = self.defuzzifier
        return data


# -----------------------------------------------------------------------------
# Pre-Compiled Antecedent Condition & Rule
# -----------------------------------------------------------------------------
@dataclass(slots=True)
class AntecedentCondition:
    """Pre-compiled condition clause 'var IS [hedge] term' evaluated during inference."""

    var_name: str
    term_name: str
    hedge: str | None = None
    _hedge_calc: Callable[[Any], Any] = field(init=False, repr=False)

    def __post_init__(self) -> None:
        """Initialize normalized hedge and pre-bound transform callable."""
        if self.hedge:
            self.hedge = self.hedge.lower()
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

    def to_dict(self) -> dict[str, Any]:
        """Serialize condition to dictionary."""
        return {
            "variable": self.var_name,
            "term": self.term_name,
            "hedge": self.hedge,
        }

    def to_str(self) -> str:
        """Render condition as DSL string."""
        return (
            f"{self.var_name} IS {self.hedge} {self.term_name}"
            if self.hedge
            else f"{self.var_name} IS {self.term_name}"
        )


class FuzzyRule:
    """Representation of a fuzzy IF ... THEN ... rule, parsed and structured on initialization."""

    def __init__(self, rule_str: str) -> None:
        """Initialize and pre-compile fuzzy rule components."""
        self.raw_rule = rule_str
        self.antecedent_str, self.consequent_str = self._parse_rule(rule_str)

        # Pre-compile consequent structure
        self.output_var, self.consequent_term, self.consequent_constant = self._compile_consequent(
            self.consequent_str
        )

        # Pre-bind callable Sugeno consequent evaluator
        if self.consequent_constant is not None:
            const_val = self.consequent_constant
            self._consequent_evaluator: Callable[[FuzzyVariable], float] = lambda _var: const_val
        else:
            term_name = self.consequent_term
            self._consequent_evaluator = lambda var: (
                float(var.terms[term_name].params[0])
                if term_name in var.terms and var.terms[term_name].params
                else 0.0
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

    def evaluate_sugeno_output(self, out_var: FuzzyVariable) -> float:
        """Evaluate crisp output for Sugeno consequent using pre-compiled callable."""
        return self._consequent_evaluator(out_var)

    @cached_property
    def ast(self) -> dict[str, Any]:
        """Export rule representation as Abstract Syntax Tree (AST)."""
        return {
            "raw": self.raw_rule,
            "antecedent": [[cond.to_dict() for cond in group] for group in self._antecedent_groups],
            "consequent": {
                "variable": self.output_var,
                "term": self.consequent_term,
                "constant": self.consequent_constant,
            },
        }

    def to_ast(self) -> dict[str, Any]:
        """Export rule representation as Abstract Syntax Tree (AST)."""
        return self.ast

    @classmethod
    def compile_from_ast(cls, ast: dict[str, Any]) -> str:
        """Compile a rule AST into an IF ... THEN ... DSL string."""
        antecedent_groups = ast.get("antecedent", [])
        or_clauses: list[str] = []
        for group in antecedent_groups:
            and_clauses: list[str] = [
                f"{cond.get('variable', '')} IS {cond['hedge']} {cond.get('term', '')}"
                if cond.get("hedge")
                else f"{cond.get('variable', '')} IS {cond.get('term', '')}"
                for cond in group
            ]
            if and_clauses:
                or_clauses.append(" AND ".join(and_clauses))
        antecedent_str = " OR ".join(or_clauses)

        consequent = ast.get("consequent", {})
        out_var = consequent.get("variable", "")
        constant = consequent.get("constant")
        term = consequent.get("term", "")
        consequent_val = str(constant) if constant is not None else term
        consequent_str = f"{out_var} IS {consequent_val}"

        return f"IF {antecedent_str} THEN {consequent_str}"

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

    def evaluate_antecedent_with_diagnostics(
        self, inputs: dict[str, float], fuzzy_vars: dict[str, FuzzyVariable]
    ) -> tuple[float, dict[str, Any] | None]:
        """Evaluate firing strength and identify the bottleneck clause."""
        if not self._antecedent_groups:
            return 0.0, None

        best_group_val = -1.0
        best_bottleneck: dict[str, Any] | None = None

        for and_group in self._antecedent_groups:
            min_val = 1.0
            bottleneck_cond: AntecedentCondition | None = None
            for cond in and_group:
                val = cond.evaluate(inputs, fuzzy_vars)
                if val <= min_val or bottleneck_cond is None:
                    min_val = val
                    bottleneck_cond = cond
            if min_val > best_group_val:
                best_group_val = min_val
                best_bottleneck = bottleneck_cond.to_dict() if bottleneck_cond else None

        firing_strength = float(max(0.0, best_group_val))
        return firing_strength, best_bottleneck


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
                term_mf = out_var.get_term_universe_mf(term_name)
                if term_mf is None:
                    _LOGGER.warning(
                        "Output term '%s' not found in output variable '%s'", term_name, out_name
                    )
                    continue

                term_activations[term_name] = max(term_activations[term_name], firing_strength)
                clipped_mf = np.minimum(firing_strength, term_mf)
                individual_rule_mfs.append(clipped_mf)
                aggregated_mf = np.maximum(aggregated_mf, clipped_mf)

            defuzz_value = defuzz_strategy(out_var.universe, aggregated_mf, individual_rule_mfs)

            results[out_name] = self._package_output_result(
                out_var=out_var,
                defuzz_value=defuzz_value,
                term_activations=term_activations,
                rule_strengths=rule_strengths,
                aggregated_mf=aggregated_mf,
            )

        return results

    @staticmethod
    def _package_output_result(
        out_var: FuzzyVariable,
        defuzz_value: float,
        term_activations: dict[str, float],
        rule_strengths: list[dict[str, Any]],
        aggregated_mf: np.ndarray | None = None,
    ) -> dict[str, Any]:
        """Package standardized output dictionary for Mamdani or Sugeno inference."""
        dominant_term = (
            max(term_activations, key=term_activations.get)  # type: ignore[arg-type]
            if any(v > 0 for v in term_activations.values())
            else "none"
        )
        term_memberships = {
            t_name: round(t_obj.evaluate_crisp(defuzz_value), 4)
            for t_name, t_obj in out_var.terms.items()
        }
        return {
            "defuzzified_value": round(defuzz_value, 4),
            "dominant_term": dominant_term,
            "term_activations": {k: round(v, 4) for k, v in term_activations.items()},
            "term_memberships": term_memberships,
            "rule_strengths": rule_strengths,
            "universe": out_var.universe.tolist(),
            "aggregated_set": aggregated_mf.tolist() if aggregated_mf is not None else [],
        }

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
                if term_or_val in term_activations:
                    term_activations[term_or_val] = max(term_activations[term_or_val], w)

                y = rule.evaluate_sugeno_output(out_var)
                if rule.consequent_constant is None and term_or_val not in out_var.terms:
                    _LOGGER.warning(
                        "Sugeno output '%s' not recognized as constant or term", term_or_val
                    )

                rule_weights.append(w)
                rule_outputs.append(y)

            total_weight = sum(rule_weights)
            defuzz_val = (
                sum(w * y for w, y in zip(rule_weights, rule_outputs, strict=False)) / total_weight
                if total_weight > 0
                else out_var.min_val
            )

            results[out_name] = self._package_output_result(
                out_var=out_var,
                defuzz_value=defuzz_val,
                term_activations=term_activations,
                rule_strengths=rule_strengths,
                aggregated_mf=None,
            )

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

    def to_dict(self) -> dict[str, Any]:
        """Serialize complete fuzzy system configuration to dictionary."""
        return {
            "name": self.name,
            "inference": self.inference_type,
            "defuzzifier": self.defuzzifier,
            "inputs": {name: var.to_dict() for name, var in self.input_vars.items()},
            "outputs": {name: var.to_dict() for name, var in self.output_vars.items()},
            "rules": [rule.raw_rule for rule in self.rules],
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> FuzzySystemEngine:
        """Construct a FuzzySystemEngine instance from a dictionary configuration."""
        name = data.get("name") or data.get("system_id") or "unnamed_system"
        inference = data.get("inference", INFERENCE_MAMDANI)
        defuzzifier = data.get("defuzzifier", DEF_COG)

        engine = cls(name=name, inference_type=inference, defuzzifier=defuzzifier)

        inputs = data.get("inputs", {})
        for in_name, in_cfg in inputs.items():
            engine.add_input_variable(
                name=in_name,
                var_range=in_cfg["range"],
                terms=in_cfg["terms"],
                resolution=in_cfg.get("resolution", 100),
            )

        outputs = data.get("outputs", {})
        for out_name, out_cfg in outputs.items():
            engine.add_output_variable(
                name=out_name,
                var_range=out_cfg["range"],
                terms=out_cfg["terms"],
                resolution=out_cfg.get("resolution", 100),
                defuzzifier=out_cfg.get("defuzzifier"),
            )

        for rule in data.get("rules", []):
            rule_str = FuzzyRule.compile_from_ast(rule) if isinstance(rule, dict) else str(rule)
            trimmed = rule_str.strip() if rule_str else ""
            if not trimmed or trimmed.upper() in ("IF THEN", "IF  THEN", "IF   THEN"):
                continue
            engine.add_rule(rule_str)

        return engine

    def simulate(self, inputs: dict[str, float]) -> dict[str, Any]:
        """Perform isolated dry-run simulation with full explainability diagnostics."""
        eval_result = self.evaluate(inputs)

        # Build detailed rule strengths with bottleneck diagnostics
        detailed_rules: list[dict[str, Any]] = []
        for rule in self.rules:
            strength, bottleneck = rule.evaluate_antecedent_with_diagnostics(
                inputs, self.input_vars
            )
            detailed_rules.append(
                {
                    "rule": rule.raw_rule,
                    "firing_strength": round(strength, 4),
                    "bottleneck_clause": bottleneck,
                }
            )

        defuzzified_values: dict[str, float] = {}
        dominant_terms: dict[str, str] = {}
        term_activations: dict[str, dict[str, float]] = {}
        term_memberships: dict[str, dict[str, float]] = {}
        aggregated_sets: dict[str, list[float]] = {}
        universes: dict[str, list[float]] = {}

        for out, res in eval_result.items():
            defuzzified_values[out] = res["defuzzified_value"]
            dominant_terms[out] = res["dominant_term"]
            term_activations[out] = res["term_activations"]
            term_memberships[out] = res["term_memberships"]
            aggregated_sets[out] = res.get("aggregated_set", [])
            universes[out] = res.get("universe", [])

        # Generate natural language explainability report
        explanations: list[str] = []
        active_rules = [r for r in detailed_rules if r["firing_strength"] > 0]
        active_rules.sort(key=lambda r: r["firing_strength"], reverse=True)

        inputs_summary = ", ".join(f"{k}={v}" for k, v in inputs.items())
        explanations.append(f"At inputs ({inputs_summary}):")

        if active_rules:
            top_rule = active_rules[0]
            explanations.append(
                f"- Top firing rule fired with strength {top_rule['firing_strength']}: '{top_rule['rule']}'."
            )
            if top_rule.get("bottleneck_clause"):
                bn = top_rule["bottleneck_clause"]
                hedge_str = f" {bn['hedge']}" if bn.get("hedge") else ""
                explanations.append(
                    f"  (Limiting clause: {bn['variable']} IS{hedge_str} {bn['term']})"
                )
            explanations.append(f"- {len(active_rules)} of {len(self.rules)} rules fired.")
        else:
            explanations.append("- No rules fired for the given input states.")

        for out_name, crisp_val in defuzzified_values.items():
            dom = dominant_terms.get(out_name, "none")
            explanations.append(
                f"- Output '{out_name}' defuzzified to {crisp_val} with dominant term '{dom}'."
            )

        explainability_text = "\n".join(explanations)

        return {
            "defuzzified_values": defuzzified_values,
            "dominant_terms": dominant_terms,
            "term_activations": term_activations,
            "term_memberships": term_memberships,
            "rule_strengths": detailed_rules,
            "aggregated_sets": aggregated_sets,
            "universes": universes,
            "explainability": explainability_text,
        }
