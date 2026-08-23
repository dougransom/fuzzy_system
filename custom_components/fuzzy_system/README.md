# Fuzzy System Custom Component for Home Assistant

The **Fuzzy System** custom component brings Mamdani and Sugeno fuzzy logic control systems to Home Assistant. Combine sensors with linguistic rules, hedges, custom membership functions, and various defuzzification strategies to create smart control entities (such as tipping systems, dynamic climate controls, lighting adjusters, and comfort indices).

> **Credits & Acknowledgments**: Powered by [scikit-fuzzy (`skfuzzy`)](https://github.com/scikit-fuzzy/scikit-fuzzy) ([PyPI](https://pypi.org/project/scikit-fuzzy/)), a robust fuzzy logic library built on top of SciPy. Special thanks to the `scikit-fuzzy` maintainers and contributors for providing the underlying membership math and defuzzification algorithms!

---

## Features

- **Inference Engines**: Mamdani & Sugeno (zero-order and first-order).
- **8 Defuzzification Algorithms**:
  - `cog`: Center of Gravity (Centroid)
  - `coa`: Centroid of Area
  - `boa`: Bisector of Area
  - `cos`: Center of Sums
  - `weighted_average`: Discrete weighted average (for Sugeno & singletons)
  - `mom`: Mean of Maxima
  - `som`: Smallest of Maxima
  - `lom`: Largest of Maxima
- **Membership Function Library**:
  - `trimf`: Triangular `[a, b, c]`
  - `trapmf`: Trapezoidal `[a, b, c, d]`
  - `gaussmf`: Gaussian `[mean, sigma]`
  - `sigmf`: Sigmoidal `[b, c]`
  - `gbellmf`: Generalized Bell `[a, b, c]`
  - `singleton`: Single crisp value `[val]`
- **Fuzzy Hedges**: `very` ($x^2$), `extremely` ($x^3$), `somewhat` ($\sqrt{x}$), `slightly` ($x^{1/3}$), `not` ($1-x$).
- **Home Assistant Sensors & Attributes**:
  - Numeric defuzzified value exposed as sensor state.
  - State attributes contain active rule firing strengths (`rule_strengths`), term membership values (`term_memberships`), and universe distribution arrays (`universe` & `aggregated_set`) for Lovelace dashboard plotting.
- **Reactive Updates**: Output sensors re-evaluate automatically whenever input entity states change.

---

## Installation

### Manual Installation
1. Copy the `fuzzy_system` directory into your Home Assistant configuration directory:
   ```
   config/custom_components/fuzzy_system/
   ```
2. Restart Home Assistant.

---

## Configuration Reference

Add your fuzzy system configuration under the `fuzzy_system` key in `configuration.yaml`:

```yaml
fuzzy_system:
  systems:
    <system_name>:
      inference: mamdani # "mamdani" or "sugeno" (default: "mamdani")
      defuzzifier: cog   # "cog", "coa", "boa", "cos", "weighted_average", "mom", "som", "lom" (default: "cog")
      inputs:
        <input_var_name>:
          entity_id: sensor.my_input_sensor # Home Assistant entity ID
          range: [min_val, max_val]           # Universe of discourse [min, max]
          resolution: 100                    # Number of segments across universe (default: 100)
          default: 0.0                       # Fallback initial value
          terms:
            <term_name>:
              type: trimf                    # Membership function type
              params: [a, b, c]              # Function parameters
              hedge: very                    # Optional hedge modifier: "very", "extremely", "somewhat", "slightly", "not"
      outputs:
        <output_var_name>:
          range: [min_val, max_val]
          resolution: 100                    # Number of segments across universe (default: 100)
          terms:
            <term_name>:
              type: trimf
              params: [a, b, c]
      rules:
        - "IF <input_var> IS [hedge] <term> [AND/OR ...] THEN <output_var> IS <term_or_value>"
```

---

## Membership Function Types & Parameters

| Function | Type String | Parameters (`params`) | Description |
| :--- | :--- | :--- | :--- |
| **Triangular** | `trimf` | `[a, b, c]` | Triangular curve anchored at `a` and `c`, peaking at `b`. |
| **Trapezoidal** | `trapmf` | `[a, b, c, d]` | Trapezoidal curve ramping from `a` to `b`, flat to `c`, down to `d`. |
| **Gaussian** | `gaussmf` | `[mean, sigma]` | Gaussian curve defined by mean and standard deviation. |
| **Sigmoidal** | `sigmf` | `[b, c]` | Sigmoidal curve: $1 / (1 + e^{-b(x - c)})$. |
---

## Fuzzy Hedges Reference

Fuzzy hedges (linguistic modifiers) modify the concentration, dilation, or negation of membership curves. They can be used **inline in rule statements** or **declared directly on term definitions in YAML**.

### Supported Hedges & Mathematical Operations

| Hedge Keyword | Operation | Effect | Example ($\mu = 0.5$) |
| :--- | :--- | :--- | :--- |
| **`very`** | $\mu^2$ | Concentration (narrows peak) | $0.5^2 = \mathbf{0.25}$ |
| **`extremely`** | $\mu^3$ | Strong concentration | $0.5^3 = \mathbf{0.125}$ |
| **`somewhat`** | $\sqrt{\mu}$ | Dilation (broadens set) | $\sqrt{0.5} \approx \mathbf{0.707}$ |
| **`slightly`** | $\mu^{1/3}$ | Strong dilation | $0.5^{1/3} \approx \mathbf{0.794}$ |
| **`not`** | $1 - \mu$ | Complement (negation) | $1 - 0.5 = \mathbf{0.50}$ |

---

### Usage Examples

#### 1. Inline Rule Hedges
Use hedge keywords directly inside rule statements:

```yaml
rules:
  - "IF service IS very good THEN tip IS generous"
  - "IF service IS somewhat poor THEN tip IS cheap"
  - "IF service IS extremely good OR food IS very delicious THEN tip IS generous"
  - "IF service IS not poor THEN tip IS average"
```

#### 2. Term Definition Hedges
Apply a hedge modifier directly to a static term definition in YAML:

```yaml
inputs:
  service:
    entity_id: sensor.service_quality
    range: [0, 10]
    terms:
      very_good:
        type: trimf
        params: [0, 5, 10]
        hedge: very # Applies x^2 hedge to this term curve
```

---

## Example 1: Mamdani Tipping System

```yaml
fuzzy_system:
  systems:
    tipping:
      inference: mamdani
      defuzzifier: cog
      inputs:
        service:
          entity_id: sensor.service_quality
          range: [0, 10]
          terms:
            poor:
              type: trimf
              params: [0, 0, 5]
            good:
              type: trimf
              params: [0, 5, 10]
            excellent:
              type: trimf
              params: [5, 10, 10]
        food:
          entity_id: sensor.food_quality
          range: [0, 10]
          terms:
            rancid:
              type: trapmf
              params: [0, 0, 1, 3]
            delicious:
              type: trapmf
              params: [7, 9, 10, 10]
      outputs:
        tip:
          range: [0, 25]
          terms:
            cheap:
              type: trimf
              params: [0, 0, 13]
            average:
              type: trimf
              params: [0, 13, 25]
            generous:
              type: trimf
              params: [13, 25, 25]
      rules:
        - "IF service IS poor OR food IS rancid THEN tip IS cheap"
        - "IF service IS good THEN tip IS average"
        - "IF service IS excellent OR food IS delicious THEN tip IS generous"
```

---

## Example 2: Sugeno Thermostat Control

```yaml
fuzzy_system:
  systems:
    climate_control:
      inference: sugeno
      defuzzifier: weighted_average
      inputs:
        temperature:
          entity_id: sensor.room_temperature
          range: [15.0, 30.0]
          terms:
            cold:
              type: trimf
              params: [15, 15, 22]
            comfortable:
              type: trimf
              params: [20, 22.5, 25]
            hot:
              type: trimf
              params: [23, 30, 30]
      outputs:
        fan_speed:
          range: [0, 100]
          terms:
            off:
              type: singleton
              params: [0]
            low:
              type: singleton
              params: [35]
            high:
              type: singleton
              params: [100]
      rules:
        - "IF temperature IS cold THEN fan_speed IS off"
        - "IF temperature IS comfortable THEN fan_speed IS low"
        - "IF temperature IS hot THEN fan_speed IS high"
```

---

## Exposed Entities & Attributes

For each defined system output variable, **two entities** are created:

1. **Defuzzified Output Sensor** (`sensor.fuzzy_<system_name>_<output_name>`):
   - **State Type**: `float` (numeric defuzzified result, e.g. `14.805`).
2. **Pre-Defuzzified Dominant Set Sensor** (`sensor.fuzzy_<system_name>_<output_name>_set`):
   - **State Type**: `string` (name of winning linguistic term before defuzzification, e.g. `"generous"`).

### Sensor State Attributes & Data Types

| Attribute | Data Type | Entity Support | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `state` (defuzzified) | `float` | Output Sensor | Numerical defuzzified output value | `14.805` |
| `aggregated_set` | `list[float]` (Array) | Output Sensor | Array of pre-defuzzification membership curve values | `[0.0, 0.0, ..., 0.7, ..., 1.0, ..., 0.0]` |
| `universe` | `list[float]` (Array) | Output Sensor | Array of output universe points for graphing | `[0.0, 0.125, 0.25, ..., 25.0]` |
| `dominant_term` | `string` | Output & Set | Name of winning linguistic term before defuzzification | `"generous"` |
| `term_activations` | `dict[str, float]` | Output & Set | Pre-defuzzification activation height per term | `{"cheap": 0.0, "average": 0.7, "generous": 1.0}` |
| `term_memberships` | `dict[str, float]` | Output Sensor | Membership degree of crisp value ($14.805$) per term | `{"cheap": 0.0, "average": 0.6923, "generous": 0.1504}` |
| `rule_strengths` | `list[dict]` (Array) | Output & Set | Array of rule string and firing strength pairs | `[{"rule": "...", "firing_strength": 0.7}]` |
| `inputs` | `dict[str, float]` | Output & Set | Dictionary of current input sensor scalar values | `{"service": 6.5, "food": 9.8}` |

---

## Using Fuzzy Systems in Automations & Templates

Because fuzzy system outputs are standard Home Assistant `sensor` entities with rich state attributes, they integrate natively with Home Assistant automations and Jinja2 templates.

### 1. Using Fuzzy Sensors in Automations

#### Numeric Threshold Triggers
Trigger actions when defuzzified numerical values cross specified thresholds:

```yaml
automation:
  - alias: "Adjust Climate Fan Speed from Fuzzy Output"
    trigger:
      - platform: numeric_state
        entity_id: sensor.fuzzy_climate_control_fan_speed
        above: 40
    action:
      - service: fan.set_percentage
        target:
          entity_id: fan.living_room_fan
        data:
          percentage: "{{ states('sensor.fuzzy_climate_control_fan_speed') | int }}"
```

#### State Change Notifications
Automatically react whenever input entities update and send notifications containing both the **pre-defuzzified set state** and the **computed defuzzified tip number**:

```yaml
automation:
  - alias: "Notify Server Tip Recommendation"
    trigger:
      - platform: state
        entity_id: sensor.fuzzy_tipping_tip
    action:
      - service: notify.mobile_app
        data:
          message: >
            Fuzzy evaluation: {{ states('sensor.fuzzy_tipping_tip_set') | title }} tip.
            Computed Tip: {{ states('sensor.fuzzy_tipping_tip') }}%
```

**Evaluated Notification Message**:
> *"Fuzzy evaluation: Generous tip. Computed Tip: 14.805%"*

### 2. Using Fuzzy Sensors in Jinja2 Templates

Access pre-defuzzified fuzzy set states, aggregated membership curves, defuzzified numerical values, and active firing rules in any Home Assistant template.

#### A. Pre-Defuzzified Set State & Activation (Before Defuzzification)

Inspect the winning linguistic term name, per-term activation levels, or the entire membership curve array before defuzzification:

##### Winning Linguistic Set Name
```jinja2
{{ states('sensor.fuzzy_tipping_tip_set') }}
```
**Evaluated Output**: `"generous"`

##### Pre-Defuzzification Term Activation Levels
```jinja2
{{ state_attr('sensor.fuzzy_tipping_tip_set', 'term_activations') }}
```
**Evaluated Output**: `{"cheap": 0.0, "average": 0.7, "generous": 1.0}`

##### Aggregated Fuzzy Membership Curve (`aggregated_set`)
```jinja2
{# Retrieve raw array of 201 membership points (0.0 to 1.0) along universe of discourse #}
{{ state_attr('sensor.fuzzy_tipping_tip', 'aggregated_set') }}

{# Compute maximum membership height across aggregated set #}
{{ state_attr('sensor.fuzzy_tipping_tip', 'aggregated_set') | max }}
```
**Evaluated Output**: `[0.0, 0.0, ..., 0.7, 0.7, ..., 1.0, 1.0, ..., 0.0]` (and max height: `1.0`)

---

#### B. Crisp Defuzzified Numerical Output Value (After Defuzzification)

Defuzzification processes the aggregated fuzzy set curve and reduces it to a single **crisp numerical float value** (e.g., `14.805` using Center of Gravity / COG).

##### Reading the Crisp Defuzzified State Value
```jinja2
{# Returns the crisp defuzzified float value #}
{{ states('sensor.fuzzy_tipping_tip') | float }}
```
**Evaluated Output**: `14.805` *(Crisp numerical tip percentage calculated via COG)*

##### Post-Defuzzification Term Memberships
Inspect how much the crisp defuzzified value ($14.805$) belongs to each linguistic term set:
```jinja2
{{ state_attr('sensor.fuzzy_tipping_tip', 'term_memberships') }}
```
**Evaluated Output**: `{"cheap": 0.0, "average": 0.6923, "generous": 0.1504}`

##### Evaluated Rule Firing Strengths
```jinja2
{% for item in state_attr('sensor.fuzzy_tipping_tip', 'rule_strengths') %}
  - {{ item.rule }}: {{ item.firing_strength }}
{% endfor %}
```
**Evaluated Output**:
```
  - IF service IS poor OR food IS rancid THEN tip IS cheap: 0.0
  - IF service IS good THEN tip IS average: 0.7
  - IF service IS excellent OR food IS delicious THEN tip IS generous: 1.0
```

---

## Testing & Code Quality

Run tests and lint checks locally:
```bash
# Run linting
uv run ruff check custom_components/fuzzy_system tests

# Run pytest suite
uv run pytest tests
```
