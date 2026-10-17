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

TEMPLATES: dict[str, dict[str, Any]] = {
    "smart_fan_controller": {
        CONF_SYSTEM_ID: "smart_fan",
        CONF_NAME: "Smart Fan Controller",
        CONF_DESCRIPTION: "Smooth ramping from silent low speeds to cooling high speeds based on heat and presence.",
        CONF_INFERENCE: INFERENCE_MAMDANI,
        CONF_DEFUZZIFIER: DEF_COG,
        CONF_EXPOSE_SYSTEM_SENSOR: True,
        CONF_INPUTS: {
            "room_temperature": {
                CONF_ENTITY_ID: "sensor.room_temperature",
                CONF_RANGE: [15.0, 35.0],
                CONF_DEFAULT: 22.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "cold": {"type": "trimf", "params": [15.0, 15.0, 22.0]},
                    "comfortable": {"type": "trimf", "params": [20.0, 24.0, 28.0]},
                    "hot": {"type": "trimf", "params": [26.0, 35.0, 35.0]},
                },
            },
            "occupancy_probability": {
                CONF_ENTITY_ID: "sensor.room_occupancy",
                CONF_RANGE: [0.0, 100.0],
                CONF_DEFAULT: 0.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "empty": {"type": "trimf", "params": [0.0, 0.0, 40.0]},
                    "occupied": {"type": "trimf", "params": [30.0, 100.0, 100.0]},
                },
            },
        },
        CONF_OUTPUTS: {
            "fan_speed": {
                CONF_NAME: "Fan Speed",
                CONF_ICON: "mdi:fan",
                CONF_UNIT_OF_MEASUREMENT: "%",
                CONF_RANGE: [0.0, 100.0],
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "off": {"type": "trimf", "params": [0.0, 0.0, 25.0]},
                    "low": {"type": "trimf", "params": [15.0, 35.0, 55.0]},
                    "medium": {"type": "trimf", "params": [45.0, 65.0, 85.0]},
                    "high": {"type": "trimf", "params": [75.0, 100.0, 100.0]},
                },
            }
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
            "co2_level": {
                CONF_ENTITY_ID: "sensor.indoor_co2",
                CONF_RANGE: [400.0, 2000.0],
                CONF_DEFAULT: 450.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "fresh": {"type": "trapmf", "params": [400.0, 400.0, 600.0, 800.0]},
                    "moderate": {"type": "trapmf", "params": [700.0, 900.0, 1100.0, 1300.0]},
                    "stale": {"type": "trapmf", "params": [1200.0, 1500.0, 2000.0, 2000.0]},
                },
            },
            "voc_index": {
                CONF_ENTITY_ID: "sensor.indoor_voc",
                CONF_RANGE: [0.0, 500.0],
                CONF_DEFAULT: 20.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "clean": {"type": "trapmf", "params": [0.0, 0.0, 50.0, 100.0]},
                    "elevated": {"type": "trapmf", "params": [80.0, 150.0, 250.0, 320.0]},
                    "polluted": {"type": "trapmf", "params": [280.0, 380.0, 500.0, 500.0]},
                },
            },
            "relative_humidity": {
                CONF_ENTITY_ID: "sensor.indoor_humidity",
                CONF_RANGE: [20.0, 90.0],
                CONF_DEFAULT: 45.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "dry": {"type": "trapmf", "params": [20.0, 20.0, 30.0, 40.0]},
                    "comfort": {"type": "trapmf", "params": [35.0, 45.0, 55.0, 65.0]},
                    "humid": {"type": "trapmf", "params": [60.0, 70.0, 90.0, 90.0]},
                },
            },
        },
        CONF_OUTPUTS: {
            "exhaust_fan": {
                CONF_NAME: "Exhaust Fan",
                CONF_ICON: "mdi:fan",
                CONF_UNIT_OF_MEASUREMENT: "%",
                CONF_RANGE: [0.0, 100.0],
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "low": {"type": "trimf", "params": [0.0, 0.0, 35.0]},
                    "medium": {"type": "trimf", "params": [25.0, 50.0, 75.0]},
                    "boost": {"type": "trimf", "params": [65.0, 100.0, 100.0]},
                },
            }
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
            "soil_moisture": {
                CONF_ENTITY_ID: "sensor.soil_moisture",
                CONF_RANGE: [0.0, 100.0],
                CONF_DEFAULT: 50.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "dry": {"type": "trimf", "params": [0.0, 0.0, 40.0]},
                    "moist": {"type": "trimf", "params": [30.0, 60.0, 80.0]},
                    "wet": {"type": "trimf", "params": [70.0, 100.0, 100.0]},
                },
            },
            "ambient_temperature": {
                CONF_ENTITY_ID: "sensor.outdoor_temperature",
                CONF_RANGE: [0.0, 45.0],
                CONF_DEFAULT: 20.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "cool": {"type": "trimf", "params": [0.0, 0.0, 18.0]},
                    "warm": {"type": "trimf", "params": [15.0, 25.0, 32.0]},
                    "hot": {"type": "trimf", "params": [28.0, 45.0, 45.0]},
                },
            },
            "rain_forecast_24h": {
                CONF_ENTITY_ID: "sensor.rain_forecast",
                CONF_RANGE: [0.0, 50.0],
                CONF_DEFAULT: 0.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "none": {"type": "trimf", "params": [0.0, 0.0, 2.0]},
                    "light": {"type": "trimf", "params": [1.0, 5.0, 15.0]},
                    "heavy": {"type": "trimf", "params": [10.0, 50.0, 50.0]},
                },
            },
        },
        CONF_OUTPUTS: {
            "watering_duration": {
                CONF_NAME: "Watering Duration",
                CONF_ICON: "mdi:sprinkler",
                CONF_UNIT_OF_MEASUREMENT: "min",
                CONF_RANGE: [0.0, 60.0],
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "zero": {"type": "singleton", "params": [0.0]},
                    "short": {"type": "singleton", "params": [10.0]},
                    "moderate": {"type": "singleton", "params": [25.0]},
                    "long": {"type": "singleton", "params": [45.0]},
                },
            }
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
            "solar_surplus_watts": {
                CONF_ENTITY_ID: "sensor.solar_surplus",
                CONF_RANGE: [0.0, 5000.0],
                CONF_DEFAULT: 0.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "low": {"type": "trimf", "params": [0.0, 0.0, 800.0]},
                    "medium": {"type": "trimf", "params": [500.0, 2000.0, 3500.0]},
                    "high": {"type": "trimf", "params": [2500.0, 5000.0, 5000.0]},
                },
            },
            "grid_import_price": {
                CONF_ENTITY_ID: "sensor.electricity_price",
                CONF_RANGE: [0.0, 1.0],
                CONF_DEFAULT: 0.20,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "cheap": {"type": "trimf", "params": [0.0, 0.0, 0.15]},
                    "normal": {"type": "trimf", "params": [0.10, 0.25, 0.40]},
                    "peak": {"type": "trimf", "params": [0.35, 1.0, 1.0]},
                },
            },
            "hot_water_temp": {
                CONF_ENTITY_ID: "sensor.water_heater_temp",
                CONF_RANGE: [20.0, 85.0],
                CONF_DEFAULT: 45.0,
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "cold": {"type": "trimf", "params": [20.0, 20.0, 45.0]},
                    "optimal": {"type": "trimf", "params": [40.0, 55.0, 68.0]},
                    "max": {"type": "trimf", "params": [65.0, 85.0, 85.0]},
                },
            },
        },
        CONF_OUTPUTS: {
            "diverter_duty_cycle": {
                CONF_NAME: "Diverter Duty Cycle",
                CONF_ICON: "mdi:solar-power",
                CONF_UNIT_OF_MEASUREMENT: "%",
                CONF_RANGE: [0.0, 100.0],
                CONF_RESOLUTION: 100,
                CONF_TERMS: {
                    "off": {"type": "singleton", "params": [0.0]},
                    "quarter": {"type": "singleton", "params": [25.0]},
                    "half": {"type": "singleton", "params": [50.0]},
                    "full": {"type": "singleton", "params": [100.0]},
                },
            }
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


def instantiate_template(
    template_id: str, new_system_id: str | None = None
) -> dict[str, Any]:
    """Generate a fresh system configuration dictionary from a chosen template."""
    if template_id not in TEMPLATES:
        raise KeyError(f"Template '{template_id}' does not exist")

    config = copy.deepcopy(TEMPLATES[template_id])
    if new_system_id:
        config[CONF_SYSTEM_ID] = new_system_id
        config[CONF_NAME] = f"{config[CONF_NAME]} ({new_system_id})"
    return config
