"""Sensor platform for the Fuzzy System integration."""

from __future__ import annotations

import collections
import functools
import logging
import time
from collections.abc import Callable
from contextlib import suppress
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType

from .const import (
    CONF_DEFAULT,
    CONF_ENTITY_ID,
    CONF_EPSILON,
    CONF_EXPOSE_SYSTEM_SENSOR,
    CONF_ICON,
    CONF_INPUTS,
    CONF_MAX_UPDATES_PER_PERIOD,
    CONF_NAME,
    CONF_OUTPUTS,
    CONF_SYSTEM_ID,
    CONF_UNIT_OF_MEASUREMENT,
    CONF_UPDATE_PERIOD,
    DATA_ENTRIES,
    DATA_YAML_SYSTEMS,
    DEFAULT_EPSILON,
    DEFAULT_MAX_UPDATES_PER_PERIOD,
    DEFAULT_UPDATE_PERIOD,
    DOMAIN,
)
from .fuzzy_engine import FuzzySystemEngine

_LOGGER = logging.getLogger(__name__)


@functools.cache
def _format_display_name(raw_name: str) -> str:
    """Convert slug identifier to display name."""
    return raw_name.replace("_", " ").title()


def _parse_entity_numeric_state(state_obj: Any, default: float) -> tuple[float, bool]:
    """Extract float value from Home Assistant state object, returning (value, is_valid)."""
    if state_obj is not None and state_obj.state not in (None, "unknown", "unavailable"):
        with suppress(ValueError, TypeError):
            return float(state_obj.state), True
    return default, False


class SystemRateLimiter:
    """Sliding-window rate limiter to protect against runaway recurrent updates."""

    def __init__(
        self,
        max_updates: int = DEFAULT_MAX_UPDATES_PER_PERIOD,
        period: float = DEFAULT_UPDATE_PERIOD,
    ) -> None:
        """Initialize the rate limiter."""
        self.max_updates = max_updates
        self.period = period
        self._timestamps: collections.deque[float] = collections.deque()
        self.throttled: bool = False
        self.throttled_count: int = 0
        self._last_tick_time: float | None = None
        self._on_throttle_callbacks: list[Callable[[], None]] = []

    def register_throttle_callback(self, cb: Callable[[], None]) -> None:
        """Register a callback to be invoked when rate limiting trips."""
        self._on_throttle_callbacks.append(cb)

    def can_update(self, now: float | None = None) -> bool:
        """Check if an update is permitted under the sliding-window budget."""
        if self.max_updates <= 0 or self.period <= 0:
            return True

        if now is None:
            now = time.monotonic()

        # Group multiple sensor updates occurring within the exact same event loop callback tick (< 0.1ms)
        if self._last_tick_time is not None and abs(now - self._last_tick_time) < 1e-4:
            return not self.throttled

        cutoff = now - self.period
        while self._timestamps and self._timestamps[0] <= cutoff:
            self._timestamps.popleft()

        if len(self._timestamps) >= self.max_updates:
            newly_throttled = not self.throttled
            self.throttled = True
            self.throttled_count += 1
            if newly_throttled:
                for cb in self._on_throttle_callbacks:
                    with suppress(Exception):
                        cb()
            return False

        self._timestamps.append(now)
        self._last_tick_time = now
        self.throttled = False
        return True

    def reset(self) -> None:
        """Reset limiter state."""
        self._timestamps.clear()
        self.throttled = False
        self.throttled_count = 0


def _build_system_entities(
    hass: HomeAssistant,
    system_name: str,
    engine: FuzzySystemEngine,
    sys_cfg: dict[str, Any],
) -> list[SensorEntity]:
    """Instantiate all sensor entities for a given fuzzy system configuration."""
    entities: list[SensorEntity] = []

    max_updates = sys_cfg.get(CONF_MAX_UPDATES_PER_PERIOD, DEFAULT_MAX_UPDATES_PER_PERIOD)
    update_period = sys_cfg.get(CONF_UPDATE_PERIOD, DEFAULT_UPDATE_PERIOD)
    system_epsilon = sys_cfg.get(CONF_EPSILON, DEFAULT_EPSILON)
    rate_limiter = SystemRateLimiter(max_updates=max_updates, period=update_period)

    input_entities_map: dict[str, tuple[str, float]] = {}
    inputs_cfg: dict[str, Any] = sys_cfg.get(CONF_INPUTS, {})
    for input_name, input_cfg in inputs_cfg.items():
        ent_id = input_cfg.get(CONF_ENTITY_ID, "")
        def_val = input_cfg.get(CONF_DEFAULT, 0.0)
        input_entities_map[input_name] = (ent_id, def_val)

    outputs_cfg: dict[str, Any] = sys_cfg.get(CONF_OUTPUTS, {})
    for out_name in engine.output_vars:
        out_cfg = outputs_cfg.get(out_name, {})
        out_epsilon = out_cfg.get(CONF_EPSILON, system_epsilon)

        # 1. Defuzzified Numeric Output Sensor
        entities.append(
            FuzzyOutputSensor(
                hass=hass,
                system_name=system_name,
                output_name=out_name,
                engine=engine,
                input_map=input_entities_map,
                output_config=out_cfg,
                rate_limiter=rate_limiter,
                epsilon=out_epsilon,
            )
        )

        # 2. Pre-Defuzzified Dominant Set String Sensor
        entities.append(
            FuzzySetSensor(
                hass=hass,
                system_name=system_name,
                output_name=out_name,
                engine=engine,
                input_map=input_entities_map,
                output_config=out_cfg,
                rate_limiter=rate_limiter,
                epsilon=out_epsilon,
            )
        )

    # 3. System Status Sensor (if expose_system_sensor is enabled)
    if sys_cfg.get(CONF_EXPOSE_SYSTEM_SENSOR, True):
        entities.append(
            FuzzySystemStatusSensor(
                hass=hass,
                system_name=system_name,
                engine=engine,
                input_map=input_entities_map,
                rate_limiter=rate_limiter,
            )
        )

    return entities


async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    """Set up the Fuzzy System sensor platform for YAML-configured systems."""
    if DOMAIN not in hass.data:
        return

    domain_data = hass.data[DOMAIN]
    systems = (
        domain_data[DATA_YAML_SYSTEMS]
        if DATA_YAML_SYSTEMS in domain_data
        else {
            k: v
            for k, v in domain_data.items()
            if k not in (DATA_YAML_SYSTEMS, DATA_ENTRIES) and isinstance(v, dict) and "engine" in v
        }
    )

    entities: list[SensorEntity] = []
    for sys_name, sys_data in systems.items():
        engine: FuzzySystemEngine = sys_data["engine"]
        sys_cfg: dict[str, Any] = sys_data["config"]
        entities.extend(_build_system_entities(hass, sys_name, engine, sys_cfg))

    async_add_entities(entities)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Fuzzy System sensor entities from a config entry."""
    domain_data = hass.data.get(DOMAIN, {})
    entries_data = domain_data.get(DATA_ENTRIES, {})
    entry_info = entries_data.get(entry.entry_id)

    system_id = (
        entry_info["system_id"]
        if entry_info
        else (entry.data.get(CONF_SYSTEM_ID) or entry.unique_id or entry.title)
    )
    engine = entry_info["engine"] if entry_info else FuzzySystemEngine.from_dict(entry.data)
    sys_cfg = entry_info["config"] if entry_info else entry.data

    entities = _build_system_entities(hass, system_id, engine, sys_cfg)
    async_add_entities(entities)


class BaseFuzzySensor(SensorEntity):
    """Base sensor class for Fuzzy System entities handling input state tracking."""

    def __init__(
        self,
        hass: HomeAssistant,
        system_name: str,
        output_name: str,
        engine: FuzzySystemEngine,
        input_map: dict[str, tuple[str, float]],
        rate_limiter: SystemRateLimiter | None = None,
    ) -> None:
        """Initialize base fuzzy sensor entity."""
        self._hass = hass
        self._system_name = system_name
        self._output_name = output_name
        self._engine = engine
        self._input_map = input_map  # input_var_name -> (entity_id, default_value)
        self._rate_limiter = rate_limiter

        # Pre-build reverse lookup table from non-empty entity_id to variable name
        self._entity_to_var: dict[str, str] = {
            ent_id: var_name for var_name, (ent_id, _) in input_map.items() if ent_id
        }
        self._tracked_entity_ids: list[str] = list(self._entity_to_var.keys())

        self._attr_extra_state_attributes: dict[str, Any] = {}
        self._input_values: dict[str, float] = {}

    async def async_added_to_hass(self) -> None:
        """Register state listeners when entity is added to HA."""
        await super().async_added_to_hass()

        for var_name, (ent_id, def_val) in self._input_map.items():
            val = def_val
            if ent_id:
                state_obj = self._hass.states.get(ent_id)
                val, _ = _parse_entity_numeric_state(state_obj, def_val)
            self._input_values[var_name] = val

        self._reevaluate()

        if self._tracked_entity_ids:
            self.async_on_remove(
                async_track_state_change_event(
                    self._hass, self._tracked_entity_ids, self._handle_input_change
                )
            )

    @callback
    def _handle_input_change(self, event: Any) -> None:
        """Handle state change event from input entities via O(1) table lookup."""
        if not (new_state := event.data.get("new_state")):
            return
        if (var_name := self._entity_to_var.get(event.data.get("entity_id"))) is None:
            return

        with suppress(ValueError, TypeError):
            new_val = float(new_state.state)
            if self._input_values.get(var_name) == new_val:
                return
            self._input_values[var_name] = new_val
            if self._reevaluate():
                self.async_write_ha_state()

    def _reevaluate(self) -> bool:
        """Run fuzzy engine evaluation. Returns True if state changed and should commit."""
        raise NotImplementedError


class FuzzyOutputSensor(BaseFuzzySensor):
    """Defuzzified Numerical Output Sensor Entity."""

    def __init__(
        self,
        hass: HomeAssistant,
        system_name: str,
        output_name: str,
        engine: FuzzySystemEngine,
        input_map: dict[str, tuple[str, float]],
        output_config: dict[str, Any] | None = None,
        rate_limiter: SystemRateLimiter | None = None,
        epsilon: float = DEFAULT_EPSILON,
    ) -> None:
        """Initialize fuzzy output numerical sensor entity."""
        super().__init__(hass, system_name, output_name, engine, input_map, rate_limiter=rate_limiter)

        output_cfg = output_config or {}
        default_name = f"Fuzzy {_format_display_name(system_name)} {_format_display_name(output_name)}"
        self._attr_name = output_cfg.get(CONF_NAME) or default_name
        self._attr_unique_id = f"fuzzy_{system_name}_{output_name}"
        self._attr_icon = output_cfg.get(CONF_ICON, "mdi:calculator-variant")
        if CONF_UNIT_OF_MEASUREMENT in output_cfg:
            self._attr_native_unit_of_measurement = output_cfg[CONF_UNIT_OF_MEASUREMENT]
        self._attr_native_value: float | None = None
        self._epsilon = float(epsilon)

    def _reevaluate(self) -> bool:
        """Run fuzzy engine evaluation for defuzzified output sensor."""
        eval_result = self._engine.evaluate(self._input_values)
        out_res = eval_result.get(self._output_name)
        if not out_res:
            if self._attr_native_value is not None:
                self._attr_native_value = None
                self._attr_extra_state_attributes = {}
                return True
            return False

        new_val = out_res["defuzzified_value"]

        # Check epsilon deadband: changes < epsilon are not committed to the system
        if (
            self._attr_native_value is not None
            and new_val is not None
            and abs(new_val - self._attr_native_value) < self._epsilon
        ):
            return False

        # Check rate limiter
        if self._rate_limiter and not self._rate_limiter.can_update():
            _LOGGER.warning(
                "Fuzzy system '%s' output '%s' update throttled: exceeded %d updates per %s s",
                self._system_name,
                self._output_name,
                self._rate_limiter.max_updates,
                self._rate_limiter.period,
            )
            return False

        self._attr_native_value = new_val
        self._attr_extra_state_attributes = {
            "system": self._system_name,
            "inference_type": self._engine.inference_type,
            "defuzzifier": self._engine.defuzzifier,
            "inputs": dict(self._input_values),
            "dominant_term": out_res["dominant_term"],
            "term_activations": out_res["term_activations"],
            "term_memberships": out_res["term_memberships"],
            "rule_strengths": out_res["rule_strengths"],
            "universe": out_res["universe"],
            "aggregated_set": out_res["aggregated_set"],
            "epsilon": self._epsilon,
        }
        return True


class FuzzySetSensor(BaseFuzzySensor):
    """Pre-Defuzzified Dominant Fuzzy Set Sensor Entity."""

    def __init__(
        self,
        hass: HomeAssistant,
        system_name: str,
        output_name: str,
        engine: FuzzySystemEngine,
        input_map: dict[str, tuple[str, float]],
        output_config: dict[str, Any] | None = None,
        rate_limiter: SystemRateLimiter | None = None,
        epsilon: float = DEFAULT_EPSILON,
    ) -> None:
        """Initialize fuzzy set sensor entity."""
        super().__init__(hass, system_name, output_name, engine, input_map, rate_limiter=rate_limiter)

        output_cfg = output_config or {}
        custom_name = output_cfg.get(CONF_NAME)
        self._attr_name = (
            f"{custom_name} Set"
            if custom_name
            else f"Fuzzy {_format_display_name(system_name)} {_format_display_name(output_name)} Set"
        )
        self._attr_unique_id = f"fuzzy_{system_name}_{output_name}_set"
        self._attr_icon = "mdi:chart-bell-curve-cumulative"
        self._attr_native_value: str | None = None
        self._epsilon = float(epsilon)

    def _reevaluate(self) -> bool:
        """Run fuzzy engine evaluation for pre-defuzzified fuzzy set sensor."""
        eval_result = self._engine.evaluate(self._input_values)
        if out_res := eval_result.get(self._output_name):
            new_term = out_res["dominant_term"]

            if self._rate_limiter and not self._rate_limiter.can_update():
                return False

            self._attr_native_value = new_term
            self._attr_extra_state_attributes = {
                "system": self._system_name,
                "inference_type": self._engine.inference_type,
                "inputs": dict(self._input_values),
                "term_activations": out_res["term_activations"],
                "rule_strengths": out_res["rule_strengths"],
            }
            return True
        else:
            if self._attr_native_value is not None:
                self._attr_native_value = None
                self._attr_extra_state_attributes = {}
                return True
            return False


class FuzzySystemStatusSensor(SensorEntity):
    """System Status Sensor for monitoring an entire Fuzzy System instance."""

    def __init__(
        self,
        hass: HomeAssistant,
        system_name: str,
        engine: FuzzySystemEngine,
        input_map: dict[str, tuple[str, float]],
        rate_limiter: SystemRateLimiter | None = None,
    ) -> None:
        """Initialize fuzzy system status sensor with pre-computed lookup tables."""
        self.hass = hass
        self._system_name = system_name
        self._engine = engine
        self._input_map = input_map
        self._rate_limiter = rate_limiter

        # Pre-build lookup and tracking tables on initialization (excluding empty entity_ids)
        self._entity_to_var: dict[str, str] = {
            ent_id: var_name for var_name, (ent_id, _) in input_map.items() if ent_id
        }
        self._tracked_entity_ids: list[str] = list(self._entity_to_var.keys())

        # Static attributes pre-bound on initialization
        self._static_attributes: dict[str, Any] = {
            "system": self._system_name,
            "inference_type": self._engine.inference_type,
            "defuzzifier": self._engine.defuzzifier,
            "rule_count": len(self._engine.rules),
        }

        self._attr_name = f"Fuzzy System {_format_display_name(system_name)}"
        self._attr_unique_id = f"fuzzy_system_{system_name}_status"
        self._attr_icon = "mdi:cpu-64-bit"
        self._attr_native_value: str = "OK"
        self._attr_extra_state_attributes: dict[str, Any] = dict(self._static_attributes)
        self._evaluation_results: dict[str, Any] = {}
        self._current_inputs: dict[str, float] = {}

    async def async_added_to_hass(self) -> None:
        """Register state change tracking for all system input entities."""
        @callback
        def _async_input_changed(event: Any) -> None:
            if not (new_state := event.data.get("new_state")):
                return
            if (var_name := self._entity_to_var.get(event.data.get("entity_id"))) is None:
                return

            with suppress(ValueError, TypeError):
                new_val = float(new_state.state)
                if self._current_inputs.get(var_name) == new_val:
                    return
                self._update_and_reevaluate()
                self.async_write_ha_state()

        if self._rate_limiter:
            @callback
            def _async_on_throttled() -> None:
                self._attr_native_value = "RUNAWAY_THROTTLED"
                attrs = dict(self._attr_extra_state_attributes)
                attrs["throttled"] = True
                attrs["throttled_count"] = self._rate_limiter.throttled_count
                self._attr_extra_state_attributes = attrs
                self.async_write_ha_state()

            self._rate_limiter.register_throttle_callback(_async_on_throttled)

        if self._tracked_entity_ids:
            self.async_on_remove(
                async_track_state_change_event(
                    self.hass, self._tracked_entity_ids, _async_input_changed
                )
            )
        self._update_and_reevaluate()

    def _update_and_reevaluate(self) -> None:
        """Fetch input states and evaluate system status."""
        eval_inputs: dict[str, float] = {}
        all_ok = True

        for input_name, (ent_id, default_val) in self._input_map.items():
            if not ent_id:
                eval_inputs[input_name] = default_val
                continue

            state_obj = self.hass.states.get(ent_id)
            val, is_valid = _parse_entity_numeric_state(state_obj, default_val)
            eval_inputs[input_name] = val
            if state_obj is not None and not is_valid:
                all_ok = False

        self._current_inputs = eval_inputs
        if self._rate_limiter and self._rate_limiter.throttled:
            self._attr_native_value = "RUNAWAY_THROTTLED"
        else:
            self._attr_native_value = "OK" if all_ok else "Input Unavailable"

        self._evaluation_results = self._engine.evaluate(eval_inputs)

        outputs_summary = {
            out: res["defuzzified_value"] for out, res in self._evaluation_results.items()
        }
        rule_strengths: list[dict[str, Any]] = []
        if self._evaluation_results:
            first_out = next(iter(self._evaluation_results.values()))
            rule_strengths = first_out.get("rule_strengths", [])

        firing_rules = [r for r in rule_strengths if r.get("firing_strength", 0.0) > 0.0]
        max_strength = max([r.get("firing_strength", 0.0) for r in rule_strengths], default=0.0)

        attrs = dict(self._static_attributes)
        attrs.update(
            {
                "inputs": self._current_inputs,
                "outputs": outputs_summary,
                "active_rule_count": len(firing_rules),
                "max_rule_strength": round(max_strength, 4),
            }
        )
        if self._rate_limiter:
            attrs.update(
                {
                    "throttled": self._rate_limiter.throttled,
                    "throttled_count": self._rate_limiter.throttled_count,
                    "max_updates_per_period": self._rate_limiter.max_updates,
                    "update_period": self._rate_limiter.period,
                }
            )
        self._attr_extra_state_attributes = attrs
