"""Sensor platform for the Fuzzy System integration."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType

from .const import CONF_DEFAULT, CONF_ENTITY_ID, CONF_INPUTS, DOMAIN
from .fuzzy_engine import FuzzySystemEngine

_LOGGER = logging.getLogger(__name__)


async def async_setup_platform(
    hass: HomeAssistant,
    config: ConfigType,
    async_add_entities: AddEntitiesCallback,
    discovery_info: DiscoveryInfoType | None = None,
) -> None:
    """Set up the Fuzzy System sensor platform."""
    if DOMAIN not in hass.data:
        return

    entities: list[SensorEntity] = []

    for sys_name, sys_data in hass.data[DOMAIN].items():
        engine: FuzzySystemEngine = sys_data["engine"]
        sys_cfg: dict[str, Any] = sys_data["config"]

        input_entities_map: dict[str, tuple[str, float]] = {}
        for input_name, input_cfg in sys_cfg[CONF_INPUTS].items():
            ent_id = input_cfg[CONF_ENTITY_ID]
            def_val = input_cfg.get(CONF_DEFAULT, 0.0)
            input_entities_map[input_name] = (ent_id, def_val)

        for out_name in engine.output_vars:
            # 1. Defuzzified Numeric Output Sensor
            entities.append(
                FuzzyOutputSensor(
                    hass=hass,
                    system_name=sys_name,
                    output_name=out_name,
                    engine=engine,
                    input_map=input_entities_map,
                )
            )

            # 2. Pre-Defuzzified Dominant Set String Sensor
            entities.append(
                FuzzySetSensor(
                    hass=hass,
                    system_name=sys_name,
                    output_name=out_name,
                    engine=engine,
                    input_map=input_entities_map,
                )
            )

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
    ) -> None:
        """Initialize base fuzzy sensor entity."""
        self._hass = hass
        self._system_name = system_name
        self._output_name = output_name
        self._engine = engine
        self._input_map = input_map  # input_var_name -> (entity_id, default_value)

        self._attributes: dict[str, Any] = {}
        self._input_values: dict[str, float] = {}

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return state attributes."""
        return self._attributes

    async def async_added_to_hass(self) -> None:
        """Register state listeners when entity is added to HA."""
        await super().async_added_to_hass()

        tracked_entity_ids = []
        for var_name, (ent_id, def_val) in self._input_map.items():
            tracked_entity_ids.append(ent_id)
            current_state = self._hass.states.get(ent_id)
            val = def_val
            if current_state is not None:
                try:
                    val = float(current_state.state)
                except (ValueError, TypeError):
                    val = def_val
            self._input_values[var_name] = val

        self._reevaluate()

        if tracked_entity_ids:
            self.async_on_remove(
                async_track_state_change_event(
                    self._hass, tracked_entity_ids, self._handle_input_change
                )
            )

    @callback
    def _handle_input_change(self, event: Any) -> None:
        """Handle state change event from input entities."""
        changed_entity_id = event.data.get("entity_id")
        new_state = event.data.get("new_state")

        if not new_state:
            return

        try:
            new_val = float(new_state.state)
        except (ValueError, TypeError):
            return

        for var_name, (ent_id, _) in self._input_map.items():
            if ent_id == changed_entity_id:
                self._input_values[var_name] = new_val
                break

        self._reevaluate()
        self.async_write_ha_state()

    def _reevaluate(self) -> None:
        """Run fuzzy engine evaluation."""
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
    ) -> None:
        """Initialize fuzzy output numerical sensor entity."""
        super().__init__(hass, system_name, output_name, engine, input_map)

        self._attr_name = (
            f"Fuzzy {system_name.replace('_', ' ').title()} {output_name.replace('_', ' ').title()}"
        )
        self._attr_unique_id = f"fuzzy_{system_name}_{output_name}"
        self._attr_icon = "mdi:calculator-variant"
        self._state: float | None = None

    @property
    def native_value(self) -> float | None:
        """Return defuzzified output numerical state."""
        return self._state

    def _reevaluate(self) -> None:
        """Run fuzzy engine evaluation for defuzzified output sensor."""
        eval_result = self._engine.evaluate(self._input_values)
        out_res = eval_result.get(self._output_name)

        if out_res:
            self._state = out_res["defuzzified_value"]
            self._attributes = {
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
            }
        else:
            self._state = None
            self._attributes = {}


class FuzzySetSensor(BaseFuzzySensor):
    """Pre-Defuzzified Dominant Fuzzy Set Sensor Entity."""

    def __init__(
        self,
        hass: HomeAssistant,
        system_name: str,
        output_name: str,
        engine: FuzzySystemEngine,
        input_map: dict[str, tuple[str, float]],
    ) -> None:
        """Initialize fuzzy set sensor entity."""
        super().__init__(hass, system_name, output_name, engine, input_map)

        self._attr_name = f"Fuzzy {system_name.replace('_', ' ').title()} {output_name.replace('_', ' ').title()} Set"
        self._attr_unique_id = f"fuzzy_{system_name}_{output_name}_set"
        self._attr_icon = "mdi:chart-bell-curve-cumulative"
        self._state: str | None = None

    @property
    def native_value(self) -> str | None:
        """Return dominant fuzzy set term name before defuzzification."""
        return self._state

    def _reevaluate(self) -> None:
        """Run fuzzy engine evaluation for pre-defuzzified fuzzy set sensor."""
        eval_result = self._engine.evaluate(self._input_values)
        out_res = eval_result.get(self._output_name)

        if out_res:
            self._state = out_res["dominant_term"]
            self._attributes = {
                "system": self._system_name,
                "inference_type": self._engine.inference_type,
                "inputs": dict(self._input_values),
                "term_activations": out_res["term_activations"],
                "rule_strengths": out_res["rule_strengths"],
            }
        else:
            self._state = None
            self._attributes = {}
