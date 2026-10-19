# Troubleshooting & Frequently Asked Questions (FAQ)

This guide provides targeted diagnoses and solutions for common questions and operational issues with the **Fuzzy System** Home Assistant integration. It is designed for both human operators and AI chatbots answering user troubleshooting requests.

---

## Quick Diagnostic Checklist
Before troubleshooting specific symptoms:
1. Go to **Developer Tools > States** and check that all input `entity_id`s have valid numeric states (not `unknown`, `unavailable`, or non-numeric strings).
2. Go to **Settings > System > Logs** and filter by `fuzzy_system` to review mathematical evaluation warnings or schema errors.
3. Use the Home Assistant service **`fuzzy_system.explain`** with your system's target entity to inspect rule firing strengths and term memberships in real time.

---

## Common Problems & Solutions

### 1. Output Sensor is Stuck at 0.0 or Fallback Value
* **Symptoms**: The output sensor (`sensor.fuzzy_<id>_<output>`) remains at `0.0` or a fixed constant even when input entities change.
* **Root Causes**:
  1. **Zero Rule Coverage**: None of the rules fired because the current input combination has a membership value of 0.0 across all defined terms.
  2. **Input Out of Universe**: An input sensor value falls outside the defined `universe: [min, max]` range, resulting in 0.0 membership if clipping is not covering the boundary.
  3. **Input Entity Non-Numeric**: The referenced entity is returning `unavailable`, `unknown`, or string values (e.g. `"off"` instead of `0`).
* **Solutions**:
  * Check the sensor's attributes in Developer Tools: inspect `rule_strengths`. If all rule strengths are `0.0`, your rule base has a gap.
  * Adjust membership functions to ensure overlapping boundaries. For instance, ensure the leftmost term uses `trapmf` with parameters `[min, min, b, c]` to cover the entire lower boundary.
  * Test edge values using `fuzzy_system.simulate` to verify rule activations across the full input universe.

---

### 2. Defuzzification Produces `NaN` or Warning in Logs
* **Symptoms**: Warning in logs: `Defuzzification cog resulted in NaN, falling back to default`.
* **Root Causes**:
  * In Mamdani systems with `cog` (Center of Gravity / Centroid), if all rule antecedents evaluate to zero, the aggregated fuzzy output set has an area of zero. Centroid calculation requires dividing by the total area ($\int \mu(y) dy = 0$), causing a division by zero.
* **Solutions**:
  * Ensure full universe coverage with at least one default or baseline rule (e.g., `"IF temperature IS cold THEN fan_speed IS low"`).
  * Alternatively, consider using the **Sugeno engine** (`engine: sugeno`, `defuzzification: weighted_average`). Sugeno systems use singletons or polynomial equations and cannot encounter zero-area geometric division errors.

---

### 3. Actuator Rapidly Oscillates (Hunting / Chattering)
* **Symptoms**: The controlled device (valve, fan, thermostat switch) changes speed or toggles on/off too frequently around a setpoint.
* **Root Causes**:
  * Overly steep membership functions (narrow triangles) creating rapid state transitions.
  * Lack of derivative damping: the system responds only to error magnitude without accounting for rate of change.
* **Solutions**:
  * Widen the membership functions to allow smoother transitions between linguistic terms.
  * Add a second input entity representing the rate of change using Home Assistant's built-in **Derivative** helper (`sensor.temperature_derivative`), and add rules like:
    * `"IF error IS small AND derivative IS steady THEN output IS maintain"`
    * `"IF error IS small AND derivative IS rising_fast THEN output IS reduce"`
  * Apply linguistic hedges like `somewhat` to dilate membership transitions: `"IF temperature IS somewhat comfortable THEN fan_speed IS low"`.

---

### 4. "Failed to add card to dashboard" via MCP or Panel
* **Symptoms**: Running `fuzzy_system.add_to_dashboard` or clicking **Add Card** in the panel returns `Failed: dashboard not found or not in storage mode`.
* **Root Causes**:
  * The target Lovelace dashboard is configured in **YAML mode** (`mode: yaml` in `configuration.yaml`). Home Assistant prohibits programmatic WebSocket modifications to YAML-controlled dashboards.
* **Solutions**:
  * Target a UI-managed dashboard (Storage mode, the default for dashboards created in **Settings > Dashboards**).
  * For YAML-mode dashboards, use **`fuzzy_system.generate_card`** (or the **Copy Card YAML** button in the panel) and paste the YAML directly into your `ui-lovelace.yaml`.

---

### 5. Input Entity Shows `unavailable` or `unknown`
* **Symptoms**: Fuzzy sensor output does not update after Home Assistant restarts.
* **Root Causes**:
  * Upstream physical sensor devices (e.g., Zigbee/Z-Wave thermometers) take several seconds to report their initial telemetry on boot.
* **Behavior**:
  * Fuzzy System safely handles `unavailable` states by holding the previous valid calculation or returning the middle of the output universe until valid numeric telemetry arrives. It automatically recalculates the moment the input entity fires a valid numeric state update.

---

### 6. Choosing Between Mamdani and Sugeno Engines
* **Question**: When should I use Mamdani versus Sugeno?
* **Guidance**:
  * **Use Mamdani** when you desire continuous, smooth physical actuation (e.g., ceiling fan speed 0–100%, heater PWM, irrigation flow valve) and want visual, explainable membership curves in Lovelace dashboards.
  * **Use Sugeno** when you need discrete setpoint jumps (e.g., HVAC modes: Off=0, Eco=1, Comfort=2), exact mathematical formula outputs, or when maximum computational throughput with zero risk of defuzzification failure is required.
