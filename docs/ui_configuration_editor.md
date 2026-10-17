# Fuzzy System UI Configuration Editor: Functional & UX Specification

## 1. Executive Summary & Vision

The **Fuzzy System UI Configuration Editor** aims to replace manual YAML authoring with an intuitive, responsive, and robust visual interface for Home Assistant. It empowers users—from smart home hobbyists to HVAC/automation engineers—to design, tune, test, and debug declarative fuzzy logic controllers directly within Home Assistant.

### Key Goals
1. **Eliminate YAML Friction**: Design complex fuzzy systems with multiple inputs, outputs, membership functions, and linguistic rules without touching `configuration.yaml`.
2. **Support Mamdani & Sugeno Systems**: Provide native workflow ergonomics for both continuous Mamdani sets and discrete/constant Sugeno controllers.
3. **Interactive Graphical Tuning**: Visually drag and reshape triangular, trapezoidal, Gaussian, bell, and sigmoidal membership functions with real-time curve recalculation.
4. **Intuitive Rule Construction**: Visual block-based and natural-language-based rule builder supporting compound Boolean logic (`AND`, `OR`, `NOT`) and linguistic hedges (`very`, `extremely`, `somewhat`, `slightly`).
5. **Live Simulation & Observability Workbench**: Test fuzzy systems in real time with interactive input sliders, live membership curve plots, rule firing monitors, and explainability breakdowns before applying changes to production sensors.
6. **Zero-Breaking-Change Compatibility**: Full coexistence with existing YAML configurations and seamless migration paths.

---

## 2. Information Architecture & Navigation

The editor is organized into a dedicated Home Assistant Panel (`/fuzzy-system`) and integrated with Home Assistant Settings / Integrations:

```
[Fuzzy Logic Dashboard]
  │
  ├── [System Overview & Catalog]
  │     ├── System List (Active, YAML-managed, UI-managed, Disabled)
  │     ├── Template Marketplace / Presets
  │     └── Import / Export (YAML / JSON)
  │
  └── [System Workspace (Tabbed / Stepped Editor)]
        ├── Tab 1: General & Inference Settings
        ├── Tab 2: Inputs & Membership Curves
        ├── Tab 3: Outputs & Defuzzifiers
        ├── Tab 4: Linguistic Rule Builder
        └── Tab 5: Live Simulation & Workbench
```

---

## 3. Detailed Component Specifications

### 3.1. System Overview & Catalog
- **System List Cards**: Displays each configured fuzzy system as a modern Home Assistant card:
  - System title, unique ID, and optional description.
  - Inference type badge (`Mamdani` [cyan] vs `Sugeno` [amber]).
  - Defuzzifier badge (`cog`, `coa`, `boa`, `cos`, `weighted_average`, `mom`, `som`, `lom`).
  - Active input entity count and output sensor count.
  - Source indicator: `UI-Managed` (editable) vs `YAML-Managed` (read-only with "Clone to UI" button).
  - Quick action menu: *Edit*, *Duplicate*, *Simulate*, *Export YAML*, *Delete*.
- **Creation Entrypoints**:
  - **Create Blank System**: Prompts for system name, engine type, and defuzzifier.
  - **Start from Template**: Instant scaffolding of pre-engineered controllers (Fan, Ventilation, Irrigation, Solar).
  - **Import YAML / JSON**: Paste or upload YAML snippets directly into the editor.

---

### 3.2. System Configuration (General Settings)
- **System Name & Identifier**:
  - `Name`: Human-readable label (e.g., "Living Room Comfort Controller").
  - `ID`: Slugified identifier used in entity IDs (`living_room_comfort`).
- **Inference Engine Selector**:
  - Toggle between **Mamdani** (qualitative fuzzy output sets defuzzified to a crisp number) and **Sugeno** (weighted average of singleton constants or linear polynomials).
  - Contextual help callouts explaining when to use each (e.g., Mamdani for human intuitive linguistic rules, Sugeno for rapid mathematical control and actuators).
- **Global Defuzzifier Selector**:
  - Dropdown populated with all 8 supported methods:
    - Center of Gravity (`cog` - default)
    - Centroid of Area (`coa`)
    - Bisector of Area (`boa`)
    - Center of Sums (`cos`)
    - Discrete Weighted Average (`weighted_average` - Sugeno default)
    - Mean of Maxima (`mom`)
    - Smallest of Maxima (`som`)
    - Largest of Maxima (`lom`)
  - Includes formula tooltips and visual previews of defuzzification behavior.
- **System Status Sensor Toggle**:
  - Switch to enable/disable `sensor.fuzzy_<system_name>_status` containing health, inputs, and active rule firing metadata.

---

### 3.3. Input Variable Editor
For each input variable feeding the controller:

1. **Entity Binding & Universe**:
   - **Entity Picker**: Uses Home Assistant's native `ha-entity-picker` to select input entities (`sensor.*`, `input_number.*`, `climate.*`, etc.).
   - **Universe Range Editor**:
     - `Min Value` and `Max Value` inputs (e.g., `[15.0, 30.0]` for temperature in °C).
     - Auto-range recommendation button: Scans the chosen entity's history or unit attributes to recommend reasonable min/max bounds.
   - **Discourse Resolution**: Slider (range: 50 to 500, default: 100) controlling curve granularity and computational precision.
   - **Fallback / Default Value**: Value used when the bound entity is unavailable or transitioning through `unknown`/`unavailable`.

2. **Fuzzy Term Management**:
   - List of linguistic terms for the variable (e.g., `cold`, `comfortable`, `warm`, `hot`).
   - Add Term, Rename Term, Color Picker (for visual differentiation on graphs), and Delete Term.

3. **Graphical Membership Function (MF) Editor**:
   - **Interactive SVG Curve Canvas**:
     - Plots all terms defined for this variable on a unified $[0.0, 1.0]$ membership vertical scale across the variable's universe.
     - Color-coded curves with hover tooltips displaying $(x, \mu(x))$.
     - Draggable anchor nodes (vertices) directly on the canvas with magnetic snapping to grid and adjacent vertices.
   - **Supported Membership Function Types**:
     - **Triangular (`trimf`)**: 3 parameters $[a, b, c]$. Draggable left foot $a$, apex $b$, right foot $c$.
     - **Trapezoidal (`trapmf`)**: 4 parameters $[a, b, c, d]$. Draggable shoulders $[b, c]$ and feet $[a, d]$.
     - **Gaussian (`gaussmf`)**: 2 parameters $[\mu, \sigma]$. Draggable center mean and width handles.
     - **Sigmoidal (`sigmf`)**: 2 parameters $[b, c]$ for logistic activation ramps.
     - **Generalized Bell (`gbellmf`)**: 3 parameters $[a, b, c]$ for flat-topped bell distributions.
     - **Singleton (`singleton`)**: 1 parameter $[x]$ for discrete values.
   - **Hedge Modifier Selector**:
     - Dropdown per term: `None`, `very` ($\mu^2$), `extremely` ($\mu^3$), `somewhat` ($\sqrt{\mu}$), `slightly` ($\mu^{1/3}$), `not` ($1 - \mu$).
     - Graph immediately renders the modified curve (e.g., showing concentration or dilation in real time).

---

### 3.4. Output Variable Editor
Defines what the fuzzy system produces:

1. **Output Specification**:
   - **Output Name & Identifier**: Slugified key determining the resulting entity: `sensor.fuzzy_<system_name>_<output_name>`.
   - **Friendly Name & Customization**:
     - Custom display name override.
     - Icon picker (`ha-icon-picker`) supporting Material Design Icons (`mdi:fan`, `mdi:water-percent`).
     - Unit of measurement string (`%`, `°C`, `W`, `min`, `lx`).
   - **Universe of Discourse**: Min and Max bounds (e.g., `[0, 100]` for fan percentage).
   - **Defuzzifier Override**: Optional dropdown allowing an output variable to use a different defuzzifier than the system-wide default.

2. **Output Term Management**:
   - **Mamdani Systems**:
     - Define linguistic output sets (e.g., `off`, `low`, `medium`, `high`) using standard membership curves (`trimf`, `trapmf`, `gaussmf`, etc.).
     - Interactive multi-curve SVG preview.
   - **Sugeno Systems**:
     - Define singleton values or constants (e.g., `off = 0`, `low = 35`, `high = 100`).
     - Stem plot preview showing discrete singleton positions along the output universe.

---

### 3.5. Visual Rule Builder
The rule builder translates human intent into mathematical inference rules:

1. **Dual-Mode Editing Interface**:
   - **Visual Block Builder (Default)**:
     - Form-based structured builder:
       `IF [Antecedent Conditions] THEN [Consequent Action]`
   - **Linguistic DSL Code Editor**:
     - Monaco/Ace or `ha-code-editor` textarea supporting text editing of standard rules:
       `IF temperature IS hot AND humidity IS humid THEN fan_speed IS high`
     - Live bidirectional synchronization: edits in visual builder immediately update the DSL editor and vice versa.
     - Real-time syntax validator checking for unknown variables, invalid terms, or malformed syntax.

2. **Antecedent Builder (IF Clause)**:
   - Nested logic groups supporting `AND` and `OR` combinations.
   - Condition row:
     - Variable dropdown: lists all configured input variables.
     - Negation toggle: `IS NOT` or `NOT`.
     - Hedge dropdown: `[none]`, `very`, `extremely`, `somewhat`, `slightly`.
     - Term dropdown: populated dynamically with terms valid for the selected variable.
   - "Add Condition" (`AND`) button and "Add Condition Group" (`OR`) button.

3. **Consequent Builder (THEN Clause)**:
   - Output Variable dropdown: lists all configured output variables.
   - Action operator: `IS`.
   - Consequent target:
     - In Mamdani: dropdown of output linguistic terms (e.g., `generous`).
     - In Sugeno: dropdown of output terms or direct numeric constant input.

---

### 3.6. Simulation Workbench
A comprehensive, isolated testing environment embedded in the editor:

1. **Interactive Test Bed**:
   - Sliders and numeric inputs for each input variable across its defined universe.
   - **"Live Entity Sync" Toggle**:
     - When turned ON, sliders automatically track the actual live states of bound Home Assistant entities.
     - When turned OFF, allows manual dragging to simulate arbitrary edge cases, freezing conditions, or extreme spikes.

2. **Antecedent Membership Gauges**:
   - Horizontal membership meters for every input variable showing $\mu \in [0.0, 1.0]$ for each term in real time as sliders move.

3. **Rule Firing Strength Table**:
   - Live list of all rules showing their computed firing strength $w_i \in [0.0, 1.0]$ with active rules highlighted in green.
   - Click-to-inspect: clicking a rule shows which clause was the bottleneck (minimum for `AND`, maximum for `OR`).

4. **Fuzzy Output Set & Defuzzification Visualizer**:
   - **Mamdani Visualization**:
     - Visualizes all output terms clipped at their respective firing heights.
     - Shaded aggregated fuzzy set polygon $\mu_{agg}(y)$.
     - Vertical indicator line showing the exact defuzzified crisp output value (centroid/bisector).
     - Winning dominant linguistic term badge (e.g., `"generous"`).
   - **Sugeno Visualization**:
     - Discrete stems showing weighted singleton locations and their relative influence.
     - Final weighted average output marker.

5. **Explainability & Diagnostics Inspector**:
   - Natural language summary explaining why the controller yielded the result:
     > *"At temperature = 26.5°C and humidity = 72%:*
     > *Rule 3 ('IF temperature IS hot AND humidity IS humid THEN fan_speed IS high') fired with strength **0.78**.*
     > *Aggregated Centroid produced **82.4%** fan speed with dominant term **High**."*

---

### 3.7. Preset Template Library
Pre-configured templates ready for 1-click instantiation:

| Template Name | Engine | Inputs | Outputs | Rules Summary |
| :--- | :--- | :--- | :--- | :--- |
| **Smart Fan Controller** | Mamdani | `room_temperature`, `occupancy_probability` | `fan_speed` (`%`) | Smooth ramping from silent low speeds to cooling high speeds based on heat and presence. |
| **Indoor Air Quality (IAQ) Ventilation** | Mamdani | `co2_level`, `voc_index`, `relative_humidity` | `damper_position` / `exhaust_fan` | Multi-pollutant balancing to prevent over-ventilation while maintaining fresh air standards. |
| **Intelligent Irrigation Controller** | Sugeno | `soil_moisture`, `ambient_temperature`, `rain_forecast_24h` | `watering_duration` (`minutes`) | Conservation-focused watering logic that halts irrigation on rain forecasts and scales with heat. |
| **Solar Excess Diversion** | Sugeno | `solar_surplus_watts`, `grid_import_price`, `hot_water_temp` | `diverter_duty_cycle` (`%`) | Smooth continuous diversion to resistive hot water or EV charging avoiding grid draw. |

Each template loads sensible default universes, terms, curves, and rules that users can customize immediately.
