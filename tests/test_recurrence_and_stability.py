"""Tests for recurrence relations, rate limiting, and output epsilon deadband."""

from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.fuzzy_system.const import DOMAIN
from custom_components.fuzzy_system.sensor import SystemRateLimiter


def test_system_rate_limiter_sliding_window():
    """Test SystemRateLimiter sliding-window budgeting, tick batching, and expiry."""
    limiter = SystemRateLimiter(max_updates=3, period=0.05)

    t0 = 100.0
    # 3 updates within the period allowed
    assert limiter.can_update(now=t0) is True
    assert limiter.can_update(now=t0 + 0.01) is True
    assert limiter.can_update(now=t0 + 0.02) is True

    # 4th update within 0.05s period is rejected and throttled
    assert limiter.can_update(now=t0 + 0.03) is False
    assert limiter.throttled is True
    assert limiter.throttled_count == 1

    # Same tick (< 1e-4) returns throttle status without re-incrementing
    assert limiter.can_update(now=t0 + 0.03001) is False

    # After period passes (now >= t0 + 0.01 + 0.05 = t0 + 0.06), oldest timestamps expire
    t_later = t0 + 0.065  # t0 and t0 + 0.01 have expired
    assert limiter.can_update(now=t_later) is True
    assert limiter.throttled is False

    # Test reset
    limiter.reset()
    assert limiter.throttled is False
    assert limiter.throttled_count == 0


async def test_epsilon_deadband_suppresses_insignificant_changes(
    hass: HomeAssistant, enable_custom_integrations
):
    """Test that output changes smaller than epsilon are not committed to Home Assistant."""
    config = {
        DOMAIN: {
            "systems": {
                "deadband_system": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "max_updates_per_period": 20,
                    "update_period": 0.05,
                    "inputs": {
                        "temperature": {
                            "entity_id": "sensor.source_temp",
                            "range": [0.0, 100.0],
                            "terms": {
                                "low": {"type": "trimf", "params": [0, 0, 50]},
                                "high": {"type": "trimf", "params": [50, 100, 100]},
                            },
                            "default": 0.0,
                        }
                    },
                    "outputs": {
                        "level": {
                            "range": [0.0, 100.0],
                            "epsilon": 2.0,  # Deadband: changes < 2.0 suppressed
                            "terms": {
                                "low": {"type": "trimf", "params": [0, 0, 50]},
                                "high": {"type": "trimf", "params": [50, 100, 100]},
                            },
                        }
                    },
                    "rules": [
                        "IF temperature IS low THEN level IS low",
                        "IF temperature IS high THEN level IS high",
                    ],
                }
            }
        }
    }

    # Initial state
    hass.states.async_set("sensor.source_temp", "80.0")
    assert await async_setup_component(hass, DOMAIN, config)
    await hass.async_block_till_done()

    initial_state = hass.states.get("sensor.fuzzy_deadband_system_level")
    assert initial_state is not None
    initial_val = float(initial_state.state)

    # Microscopic change: temp changes from 80.0 to 80.1
    # This results in level change < 2.0 epsilon
    hass.states.async_set("sensor.source_temp", "80.1")
    await hass.async_block_till_done()

    after_micro = hass.states.get("sensor.fuzzy_deadband_system_level")
    assert after_micro is not None
    # State should remain identical because update was suppressed
    assert float(after_micro.state) == initial_val
    assert after_micro.last_updated == initial_state.last_updated

    # Substantial change: temp changes to 20.0
    # This results in level change well above 2.0
    hass.states.async_set("sensor.source_temp", "20.0")
    await hass.async_block_till_done()

    after_large = hass.states.get("sensor.fuzzy_deadband_system_level")
    assert after_large is not None
    assert float(after_large.state) != initial_val
    assert abs(float(after_large.state) - initial_val) > 2.0


async def test_recurrent_feedback_convergence(hass: HomeAssistant, enable_custom_integrations):
    """Test a recurrent feedback loop where output is bound as an input and converges stably."""
    config = {
        DOMAIN: {
            "systems": {
                "recurrent_ctrl": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "max_updates_per_period": 30,
                    "update_period": 0.05,
                    "inputs": {
                        "feedback": {
                            "entity_id": "sensor.fuzzy_recurrent_ctrl_actuator",
                            "range": [0.0, 100.0],
                            "terms": {
                                "low": {"type": "trimf", "params": [0, 0, 50]},
                                "high": {"type": "trimf", "params": [50, 100, 100]},
                            },
                            "default": 10.0,
                        }
                    },
                    "outputs": {
                        "actuator": {
                            "range": [0.0, 100.0],
                            "epsilon": 0.5,  # Settles when step change < 0.5
                            "terms": {
                                "low": {"type": "trimf", "params": [0, 0, 50]},
                                "mid": {"type": "trimf", "params": [25, 50, 75]},
                                "high": {"type": "trimf", "params": [50, 100, 100]},
                            },
                        }
                    },
                    "rules": [
                        "IF feedback IS low THEN actuator IS mid",
                        "IF feedback IS high THEN actuator IS mid",
                    ],
                }
            }
        }
    }

    assert await async_setup_component(hass, DOMAIN, config)
    await hass.async_block_till_done()

    actuator = hass.states.get("sensor.fuzzy_recurrent_ctrl_actuator")
    assert actuator is not None
    # System should have evaluated and converged stably towards mid (~50.0)
    assert 40.0 < float(actuator.state) < 60.0

    status = hass.states.get("sensor.fuzzy_system_recurrent_ctrl")
    assert status is not None
    assert status.state == "OK"
    assert status.attributes["throttled"] is False


async def test_runaway_circuit_breaker(hass: HomeAssistant, enable_custom_integrations):
    """Test that a pathological oscillatory feedback loop trips the rate limiter without freezing."""
    # System where output directly inverts input without dampening
    config = {
        DOMAIN: {
            "systems": {
                "runaway_loop": {
                    "inference": "mamdani",
                    "defuzzifier": "cog",
                    "max_updates_per_period": 5,  # Trip quickly for test
                    "update_period": 0.5,
                    "inputs": {
                        "x": {
                            "entity_id": "sensor.fuzzy_runaway_loop_y",
                            "range": [0.0, 100.0],
                            "terms": {
                                "low": {"type": "trimf", "params": [0, 0, 45]},
                                "high": {"type": "trimf", "params": [55, 100, 100]},
                            },
                            "default": 10.0,
                        }
                    },
                    "outputs": {
                        "y": {
                            "range": [0.0, 100.0],
                            "epsilon": 0.01,  # Large enough oscillation to always exceed epsilon
                            "terms": {
                                "low": {"type": "trimf", "params": [0, 0, 45]},
                                "high": {"type": "trimf", "params": [55, 100, 100]},
                            },
                        }
                    },
                    "rules": [
                        "IF x IS low THEN y IS high",
                        "IF x IS high THEN y IS low",
                    ],
                }
            }
        }
    }

    assert await async_setup_component(hass, DOMAIN, config)
    for _ in range(10):
        await hass.async_block_till_done()

    # Verify that the circuit breaker tripped and the status sensor reflects throttling
    status = hass.states.get("sensor.fuzzy_system_runaway_loop")
    assert status is not None
    assert status.state == "RUNAWAY_THROTTLED"
    assert status.attributes["throttled"] is True
    assert status.attributes["throttled_count"] >= 1
