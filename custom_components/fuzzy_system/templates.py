"""Preset template library for the Fuzzy System integration."""

from __future__ import annotations

import copy
from typing import Any

from .const import (
    CONF_DEFAULT,
    CONF_DEFUZZIFIER,
    CONF_DESCRIPTION,
    CONF_ENTITY_ID,
    CONF_EXPOSE_SYSTEM_SENSOR,
    CONF_ICON,
    CONF_INFERENCE,
    CONF_INPUTS,
    CONF_NAME,
    CONF_OUTPUTS,
    CONF_RANGE,
    CONF_RESOLUTION,
    CONF_RULES,
    CONF_SYSTEM_ID,
    CONF_TERMS,
    CONF_UNIT_OF_MEASUREMENT,
    DEF_COG,
    DEF_WEIGHTED_AVERAGE,
    INFERENCE_MAMDANI,
    INFERENCE_SUGENO,
)


# -----------------------------------------------------------------------------
# Declarative Schema Builders (DRY Helpers)
# -----------------------------------------------------------------------------
def _trim(a: float, b: float, c: float) -> dict[str, Any]:
    """Create triangular membership function term definition."""
    return {"type": "trimf", "params": [a, b, c]}


def _trap(a: float, b: float, c: float, d: float) -> dict[str, Any]:
    """Create trapezoidal membership function term definition."""
    return {"type": "trapmf", "params": [a, b, c, d]}


def _singleton(val: float) -> dict[str, Any]:
    """Create singleton membership function term definition."""
    return {"type": "singleton", "params": [val]}


def _input_var(
    entity_id: str,
    var_range: list[float],
    terms: dict[str, dict[str, Any]],
    default: float = 0.0,
    resolution: int = 100,
) -> dict[str, Any]:
    """Create input variable configuration dictionary."""
    return {
        CONF_ENTITY_ID: entity_id,
        CONF_RANGE: var_range,
        CONF_DEFAULT: default,
        CONF_RESOLUTION: resolution,
        CONF_TERMS: terms,
    }


def _output_var(
    name: str,
    var_range: list[float],
    terms: dict[str, dict[str, Any]],
    icon: str | None = None,
    unit: str | None = None,
    resolution: int = 100,
) -> dict[str, Any]:
    """Create output variable configuration dictionary."""
    cfg: dict[str, Any] = {
        CONF_NAME: name,
        CONF_RANGE: var_range,
        CONF_RESOLUTION: resolution,
        CONF_TERMS: terms,
    }
    if icon is not None:
        cfg[CONF_ICON] = icon
    if unit is not None:
        cfg[CONF_UNIT_OF_MEASUREMENT] = unit
    return cfg


# -----------------------------------------------------------------------------
# Built-in Starter Template Catalog
# -----------------------------------------------------------------------------
TEMPLATES: dict[str, dict[str, Any]] = {
    "smart_fan_controller": {
        CONF_SYSTEM_ID: "smart_fan",
        CONF_NAME: "Smart Fan Controller",
        CONF_DESCRIPTION: "Smooth ramping from silent low speeds to cooling high speeds based on heat and presence.",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "room_temperature": _input_var(
                "sensor.room_temperature",
                [15.0, 35.0],
                {
                    "cold": _trim(15.0, 15.0, 22.0),
                    "comfortable": _trim(20.0, 24.0, 28.0),
                    "hot": _trim(26.0, 35.0, 35.0),
                },
                default=22.0,
            ),
            "occupancy_probability": _input_var(
                "sensor.room_occupancy",
                [0.0, 100.0],
                {
                    "empty": _trim(0.0, 0.0, 40.0),
                    "occupied": _trim(30.0, 100.0, 100.0),
                },
            ),
        },
        CONF_OUTPUTS: {
            "fan_speed": _output_var(
                "Fan Speed",
                [0.0, 100.0],
                {
                    "off": _trim(0.0, 0.0, 25.0),
                    "low": _trim(15.0, 35.0, 55.0),
                    "medium": _trim(45.0, 65.0, 85.0),
                    "high": _trim(75.0, 100.0, 100.0),
                },
                icon="mdi:fan",
                unit="%",
            ),
        },
        CONF_RULES: [
            "IF occupancy_probability IS empty THEN fan_speed IS off",
            "IF occupancy_probability IS occupied AND room_temperature IS cold THEN fan_speed IS off",
            "IF occupancy_probability IS occupied AND room_temperature IS comfortable THEN fan_speed IS low",
            "IF occupancy_probability IS occupied AND room_temperature IS hot THEN fan_speed IS high",
        ],
    },
    "iaq_ventilation": {
        CONF_SYSTEM_ID: "iaq_ventilation",
        CONF_NAME: "Indoor Air Quality (IAQ) Ventilation",
        CONF_DESCRIPTION: "Multi-pollutant balancing to prevent over-ventilation while maintaining fresh air standards.",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "co2_level": _input_var(
                "sensor.indoor_co2",
                [400.0, 2000.0],
                {
                    "fresh": _trap(400.0, 400.0, 600.0, 800.0),
                    "moderate": _trap(700.0, 900.0, 1100.0, 1300.0),
                    "stale": _trap(1200.0, 1500.0, 2000.0, 2000.0),
                },
                default=450.0,
            ),
            "voc_index": _input_var(
                "sensor.indoor_voc",
                [0.0, 500.0],
                {
                    "clean": _trap(0.0, 0.0, 50.0, 100.0),
                    "elevated": _trap(80.0, 150.0, 250.0, 320.0),
                    "polluted": _trap(280.0, 380.0, 500.0, 500.0),
                },
                default=20.0,
            ),
            "relative_humidity": _input_var(
                "sensor.indoor_humidity",
                [20.0, 90.0],
                {
                    "dry": _trap(20.0, 20.0, 30.0, 40.0),
                    "comfort": _trap(35.0, 45.0, 55.0, 65.0),
                    "humid": _trap(60.0, 70.0, 90.0, 90.0),
                },
                default=45.0,
            ),
        },
        CONF_OUTPUTS: {
            "exhaust_fan": _output_var(
                "Exhaust Fan",
                [0.0, 100.0],
                {
                    "low": _trim(0.0, 0.0, 35.0),
                    "medium": _trim(25.0, 50.0, 75.0),
                    "boost": _trim(65.0, 100.0, 100.0),
                },
                icon="mdi:fan",
                unit="%",
            ),
        },
        CONF_RULES: [
            "IF co2_level IS fresh AND voc_index IS clean THEN exhaust_fan IS low",
            "IF co2_level IS moderate OR voc_index IS elevated THEN exhaust_fan IS medium",
            "IF co2_level IS stale OR voc_index IS polluted OR relative_humidity IS humid THEN exhaust_fan IS boost",
        ],
    },
    "intelligent_irrigation": {
        CONF_SYSTEM_ID: "smart_irrigation",
        CONF_NAME: "Intelligent Irrigation Controller",
        CONF_DESCRIPTION: "Conservation-focused watering logic that halts irrigation on rain forecasts and scales with heat.",
        CONF_INFERENCE: INFERENCE_SUGENO,
        CONF_DEFUZZIFIER: DEF_WEIGHTED_AVERAGE,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "soil_moisture": _input_var(
                "sensor.soil_moisture",
                [0.0, 100.0],
                {
                    "dry": _trim(0.0, 0.0, 40.0),
                    "moist": _trim(30.0, 60.0, 80.0),
                    "wet": _trim(70.0, 100.0, 100.0),
                },
                default=50.0,
            ),
            "ambient_temperature": _input_var(
                "sensor.outdoor_temperature",
                [0.0, 45.0],
                {
                    "cool": _trim(0.0, 0.0, 18.0),
                    "warm": _trim(15.0, 25.0, 32.0),
                    "hot": _trim(28.0, 45.0, 45.0),
                },
                default=20.0,
            ),
            "rain_forecast_24h": _input_var(
                "sensor.rain_forecast",
                [0.0, 50.0],
                {
                    "none": _trim(0.0, 0.0, 2.0),
                    "light": _trim(1.0, 5.0, 15.0),
                    "heavy": _trim(10.0, 50.0, 50.0),
                },
                default=0.0,
            ),
        },
        CONF_OUTPUTS: {
            "watering_duration": _output_var(
                "Watering Duration",
                [0.0, 60.0],
                {
                    "zero": _singleton(0.0),
                    "short": _singleton(10.0),
                    "moderate": _singleton(25.0),
                    "long": _singleton(45.0),
                },
                icon="mdi:sprinkler",
                unit="min",
            ),
        },
        CONF_RULES: [
            "IF rain_forecast_24h IS heavy OR soil_moisture IS wet THEN watering_duration IS zero",
            "IF rain_forecast_24h IS light AND soil_moisture IS moist THEN watering_duration IS zero",
            "IF soil_moisture IS dry AND ambient_temperature IS cool THEN watering_duration IS short",
            "IF soil_moisture IS dry AND ambient_temperature IS warm THEN watering_duration IS moderate",
            "IF soil_moisture IS dry AND ambient_temperature IS hot THEN watering_duration IS long",
        ],
    },
    "solar_excess_diversion": {
        CONF_SYSTEM_ID: "solar_diversion",
        CONF_NAME: "Solar Excess Diversion",
        CONF_DESCRIPTION: "Smooth continuous diversion to resistive hot water or EV charging avoiding grid draw.",
        CONF_INFERENCE: INFERENCE_SUGENO,
        CONF_DEFUZZIFIER: DEF_WEIGHTED_AVERAGE,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "solar_surplus_watts": _input_var(
                "sensor.solar_surplus",
                [0.0, 5000.0],
                {
                    "low": _trim(0.0, 0.0, 800.0),
                    "medium": _trim(500.0, 2000.0, 3500.0),
                    "high": _trim(2500.0, 5000.0, 5000.0),
                },
            ),
            "grid_import_price": _input_var(
                "sensor.electricity_price",
                [0.0, 1.0],
                {
                    "cheap": _trim(0.0, 0.0, 0.15),
                    "normal": _trim(0.10, 0.25, 0.40),
                    "peak": _trim(0.35, 1.0, 1.0),
                },
                default=0.20,
            ),
            "hot_water_temp": _input_var(
                "sensor.water_heater_temp",
                [20.0, 85.0],
                {
                    "cold": _trim(20.0, 20.0, 45.0),
                    "optimal": _trim(40.0, 55.0, 68.0),
                    "max": _trim(65.0, 85.0, 85.0),
                },
                default=45.0,
            ),
        },
        CONF_OUTPUTS: {
            "diverter_duty_cycle": _output_var(
                "Diverter Duty Cycle",
                [0.0, 100.0],
                {
                    "off": _singleton(0.0),
                    "quarter": _singleton(25.0),
                    "half": _singleton(50.0),
                    "full": _singleton(100.0),
                },
                icon="mdi:solar-power",
                unit="%",
            ),
        },
        CONF_RULES: [
            "IF hot_water_temp IS max THEN diverter_duty_cycle IS off",
            "IF solar_surplus_watts IS low THEN diverter_duty_cycle IS off",
            "IF solar_surplus_watts IS medium AND hot_water_temp IS cold THEN diverter_duty_cycle IS half",
            "IF solar_surplus_watts IS high AND hot_water_temp IS cold THEN diverter_duty_cycle IS full",
            "IF solar_surplus_watts IS high AND hot_water_temp IS optimal THEN diverter_duty_cycle IS half",
        ],
    },
}


def get_templates() -> list[dict[str, Any]]:
    """Return catalog metadata for all built-in starter templates."""
    return [
        {
            "template_id": template_id,
            "name": tpl[CONF_NAME],
            "description": tpl[CONF_DESCRIPTION],
            "inference": tpl[CONF_INFERENCE],
            "defuzzifier": tpl[CONF_DEFUZZIFIER],
            "input_count": len(tpl[CONF_INPUTS]),
            "output_count": len(tpl[CONF_OUTPUTS]),
            "rule_count": len(tpl[CONF_RULES]),
        }
        for template_id, tpl in TEMPLATES.items()
    ]


def instantiate_template(template_id: str, new_system_id: str | None = None) -> dict[str, Any]:
    """Generate a fresh system configuration dictionary from a chosen template."""
    if template_id not in TEMPLATES:
        raise KeyError(f"Template '{template_id}' does not exist")

    config = copy.deepcopy(TEMPLATES[template_id])
    if new_system_id:
        config[CONF_SYSTEM_ID] = new_system_id
        config[CONF_NAME] = f"{config[CONF_NAME]} ({new_system_id})"
    return config
