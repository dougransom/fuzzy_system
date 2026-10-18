import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../utils/custom-element";
import { FuzzySystemConfig, HomeAssistant, InputVariableConfig, OutputVariableConfig } from "../types";
import { saveSystem } from "../api/websocket";
import { sharedStyles } from "../styles/shared-styles";

interface RuleCondition {
  variable: string;
  hedge: string; // "" | "not" | "very" | "somewhat" | "extremely" | "slightly"
  term: string;
  connector: "AND" | "OR";
}

interface RuleConsequent {
  variable: string;
  term: string;
  isConstant: boolean;
  constantValue: number;
}

@safeCustomElement("fuzzy-system-editor")
export class FuzzySystemEditor extends LitElement {
  static styles = [
    sharedStyles,
    css`
      .tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 24px;
        border-bottom: 1px solid var(--fuzzy-card-border);
        padding-bottom: 8px;
        overflow-x: auto;
      }

      .tab-btn {
        background: transparent;
        border: none;
        color: var(--fuzzy-text-secondary);
        font-size: 14px;
        font-weight: 600;
        padding: 8px 16px;
        border-radius: var(--fuzzy-radius-md);
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .tab-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--fuzzy-text);
      }

      .tab-btn.active {
        background: rgba(2, 132, 199, 0.15);
        color: #38bdf8;
        border-bottom: 2px solid var(--fuzzy-primary);
      }

      .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .grid-2 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }

      .grid-3 {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .section-box {
        background: rgba(15, 23, 42, 0.5);
        border: 1px solid var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-md);
        padding: 18px;
        margin-bottom: 16px;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
      }

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--fuzzy-text);
      }

      .rule-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
      }

      .rule-input {
        font-family: monospace;
        font-size: 13px;
        flex: 1;
      }

      .rule-card {
        background: rgba(15, 23, 42, 0.45);
        border: 1px solid var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-md);
        padding: 14px 18px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        transition: all 0.2s ease;
      }

      .rule-card:hover {
        border-color: rgba(56, 189, 248, 0.3);
        background: rgba(15, 23, 42, 0.65);
      }

      .builder-row {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }

      .yaml-banner {
        background: rgba(168, 85, 247, 0.12);
        border: 1px solid rgba(168, 85, 247, 0.3);
        color: #d8b4fe;
        padding: 12px 18px;
        border-radius: var(--fuzzy-radius-md);
        margin-bottom: 20px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        cursor: pointer;
        user-select: none;
      }

      .checkbox-label input[type="checkbox"] {
        accent-color: var(--fuzzy-primary);
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      .helper-text {
        font-size: 12px;
        color: var(--fuzzy-text-secondary);
        margin-top: 4px;
      }
    `,
  ];

  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) public systemConfig!: FuzzySystemConfig;
  @property({ type: String }) public entryId?: string;
  @property({ type: String }) public source: "yaml" | "config_entry" = "config_entry";

  @state() private _activeTab: "general" | "inputs" | "outputs" | "rules" | "raw" = "general";
  @state() private _config!: FuzzySystemConfig;
  @state() private _rawJson = "";
  @state() private _saving = false;
  @state() private _error = "";
  @state() private _successMsg = "";

  // Add Input Modal state
  @state() private _showAddInputModal = false;
  @state() private _newInputEntityId = "";
  @state() private _newInputVarName = "";
  @state() private _newInputMin = 0;
  @state() private _newInputMax = 100;
  @state() private _newInputTermsPreset: "3_terms" | "5_terms" = "3_terms";
  @state() private _newInputModalError = "";

  // Rule Builder Modal state
  @state() private _showRuleBuilderModal = false;
  @state() private _editingRuleIndex = -1;
  @state() private _builderConditions: RuleCondition[] = [];
  @state() private _builderConsequent: RuleConsequent = {
    variable: "",
    term: "",
    isConstant: false,
    constantValue: 0,
  };
  @state() private _ruleBuilderError = "";
  @state() private _rulesViewMode: "visual" | "text" = "visual";

  connectedCallback() {
    super.connectedCallback();
    this._initForm();
  }

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has("systemConfig") && this.systemConfig) {
      this._initForm();
    }
  }

  private _initForm() {
    if (this.systemConfig) {
      this._config = JSON.parse(JSON.stringify(this.systemConfig));
    } else {
      this._config = {
        system_id: "",
        name: "",
        description: "",
        inference: "mamdani",
        defuzzifier: "cog",
        expose_system_sensor: true,
        max_updates_per_period: 20,
        update_period: 0.05,
        epsilon: 0.01,
        inputs: {},
        outputs: {},
        rules: [],
      };
    }
    this._rawJson = JSON.stringify(this._config, null, 2);
  }

  private _handleBack() {
    this.dispatchEvent(new CustomEvent("back", { bubbles: true, composed: true }));
  }

  private _handleInferenceChange(inference: "mamdani" | "sugeno") {
    this._config.inference = inference;
    if (inference === "sugeno") {
      this._config.defuzzifier = "weighted_average";
    } else {
      this._config.defuzzifier = "cog";
    }
    this.requestUpdate();
  }

  private async _handleSave() {
    this._error = "";
    this._successMsg = "";

    if (!this._config.system_id || !this._config.system_id.trim()) {
      this._error = "System Identifier is required.";
      this._activeTab = "general";
      return;
    }

    if (!this._config.name || !this._config.name.trim()) {
      this._error = "System Name is required.";
      this._activeTab = "general";
      return;
    }

    if (this._activeTab === "raw") {
      try {
        this._config = JSON.parse(this._rawJson);
      } catch (e: any) {
        this._error = `Invalid JSON: ${e.message}`;
        return;
      }
    }

    if (this._config.rules) {
      this._config.rules = this._config.rules
        .map((r) => (typeof r === "string" ? r.trim() : r))
        .filter((r) => {
          if (!r) return false;
          if (typeof r === "string") {
            const up = r.toUpperCase();
            return up !== "IF THEN" && up !== "IF  THEN" && !up.match(/^IF\s*THEN\s*$/);
          }
          return true;
        });
    }

    this._saving = true;
    try {
      const result = await saveSystem(this.hass, this._config, this.entryId);
      this._successMsg = `System '${result.system_id}' saved successfully!`;
      this.dispatchEvent(
        new CustomEvent("system-saved", {
          detail: { systemId: result.system_id, entryId: result.entry_id },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err: any) {
      this._error = err.message || "Failed to save fuzzy system.";
    } finally {
      this._saving = false;
    }
  }

  // --- Inputs Handlers ---
  private _openAddInputModal() {
    this._newInputEntityId = "";
    this._newInputVarName = "";
    this._newInputMin = 0;
    this._newInputMax = 100;
    this._newInputTermsPreset = "3_terms";
    this._newInputModalError = "";
    this._showAddInputModal = true;
  }

  private _onNewInputEntitySelected(entityId: string) {
    this._newInputEntityId = entityId;
    if (!entityId) return;

    // Auto-derive linguistic variable name if blank
    const entitySlug = entityId.split(".")[1]?.replace(/[^a-z0-9_]/g, "_") || "";
    if (!this._newInputVarName || this._newInputVarName.trim() === "") {
      this._newInputVarName = entitySlug;
    }

    // Auto-detect unit and adjust range
    const stateObj = this.hass?.states ? this.hass.states[entityId] : null;
    if (stateObj?.attributes) {
      const uom = stateObj.attributes.unit_of_measurement;
      if (uom === "°C") {
        this._newInputMin = 10;
        this._newInputMax = 35;
      } else if (uom === "°F") {
        this._newInputMin = 50;
        this._newInputMax = 95;
      } else if (uom === "%") {
        this._newInputMin = 0;
        this._newInputMax = 100;
      } else if (uom === "lx" || uom === "lux") {
        this._newInputMin = 0;
        this._newInputMax = 1000;
      } else if (uom === "ppm") {
        this._newInputMin = 400;
        this._newInputMax = 2000;
      } else if (uom === "W" || uom === "kW") {
        this._newInputMin = 0;
        this._newInputMax = 5000;
      }
    }
    this.requestUpdate();
  }

  private _confirmAddInput() {
    this._newInputModalError = "";
    const key = (this._newInputVarName || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

    if (!key) {
      this._newInputModalError = "Please specify a linguistic variable name.";
      return;
    }

    if (this._config.inputs && this._config.inputs[key]) {
      this._newInputModalError = `An input variable named '${key}' already exists.`;
      return;
    }

    const min = Number.isFinite(this._newInputMin) ? this._newInputMin : 0;
    const max = Number.isFinite(this._newInputMax) && this._newInputMax > min ? this._newInputMax : min + 100;
    const span = max - min;

    let terms: Record<string, { type: string; params: number[] }>;
    if (this._newInputTermsPreset === "5_terms") {
      terms = {
        very_low: { type: "trapmf", params: [min, min, min + span * 0.15, min + span * 0.3] },
        low: { type: "trimf", params: [min + span * 0.15, min + span * 0.35, min + span * 0.55] },
        medium: { type: "trimf", params: [min + span * 0.35, min + span * 0.5, min + span * 0.65] },
        high: { type: "trimf", params: [min + span * 0.45, min + span * 0.65, min + span * 0.85] },
        very_high: { type: "trapmf", params: [min + span * 0.7, min + span * 0.85, max, max] },
      };
    } else {
      terms = {
        low: { type: "trapmf", params: [min, min, min + span * 0.25, min + span * 0.5] },
        medium: { type: "trimf", params: [min + span * 0.25, min + span * 0.5, min + span * 0.75] },
        high: { type: "trapmf", params: [min + span * 0.5, min + span * 0.75, max, max] },
      };
    }

    if (!this._config.inputs) {
      this._config.inputs = {};
    }

    this._config.inputs[key] = {
      entity_id: this._newInputEntityId || "",
      range: [min, max],
      resolution: 100,
      default: min,
      terms,
    };

    this._showAddInputModal = false;
    this.requestUpdate();
  }

  private _getAvailableEntities(): Array<{ entity_id: string; friendly_name: string; unit: string; state: string }> {
    if (!this.hass?.states) return [];
    const list: Array<{ entity_id: string; friendly_name: string; unit: string; state: string }> = [];
    for (const [entity_id, stateObj] of Object.entries(this.hass.states)) {
      const domain = entity_id.split(".")[0];
      if (
        domain === "sensor" ||
        domain === "input_number" ||
        domain === "number" ||
        domain === "climate" ||
        domain === "weather"
      ) {
        list.push({
          entity_id,
          friendly_name: stateObj.attributes?.friendly_name || entity_id,
          unit: stateObj.attributes?.unit_of_measurement || "",
          state: stateObj.state,
        });
      }
    }
    list.sort((a, b) => a.friendly_name.localeCompare(b.friendly_name));
    return list;
  }

  private _renderEntityPicker(
    value: string,
    disabled: boolean,
    onChange: (val: string) => void
  ) {
    const isHaPickerAvailable = Boolean(customElements.get("ha-entity-picker"));
    const entities = this._getAvailableEntities();

    if (isHaPickerAvailable) {
      return html`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${value || ""}
          ?disabled=${disabled}
          .includeDomains=${["sensor", "input_number", "number", "climate", "weather"]}
          @value-changed=${(e: CustomEvent) => onChange(e.detail.value || "")}
        ></ha-entity-picker>
      `;
    }

    return html`
      <div style="position: relative;">
        <input
          class="input-text"
          type="text"
          list="ha-fuzzy-entities"
          .value=${value || ""}
          ?disabled=${disabled}
          placeholder="Search entities (e.g. sensor.temperature)..."
          @input=${(e: any) => onChange(e.target.value)}
        />
        <datalist id="ha-fuzzy-entities">
          ${entities.map(
            (ent) => html`
              <option value=${ent.entity_id}>
                ${ent.friendly_name} (${ent.state} ${ent.unit})
              </option>
            `
          )}
        </datalist>
      </div>
    `;
  }

  private _renderEntityStatusTag(entityId: string) {
    if (!entityId || !entityId.trim()) {
      return html`
        <span class="badge badge-amber" title="This variable has no live sensor bound yet">
          ⚠️ Unbound (Add entity to track live values)
        </span>
      `;
    }
    const stateObj = this.hass?.states ? this.hass.states[entityId] : null;
    if (!stateObj) {
      return html`
        <span class="badge" style="background: rgba(239,68,68,0.15); color: #f87171;">
          ❓ ${entityId} (Not found in HA)
        </span>
      `;
    }
    const unit = stateObj.attributes?.unit_of_measurement || "";
    return html`
      <span class="badge badge-emerald" title="Live sensor state in Home Assistant">
        🟢 Live: ${stateObj.state} ${unit}
      </span>
    `;
  }

  private _removeInput(key: string) {
    if (!confirm(`Delete input variable '${key}'?`)) return;
    delete this._config.inputs[key];
    this.requestUpdate();
  }

  // --- Outputs Handlers ---
  private _addOutput() {
    const outputName = prompt("Enter output variable name (e.g., fan_speed):");
    if (!outputName || !outputName.trim()) return;
    const key = outputName.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

    if (this._config.outputs[key]) {
      alert(`Output '${key}' already exists.`);
      return;
    }

    this._config.outputs[key] = {
      range: [0, 100],
      resolution: 100,
      defuzzifier: this._config.inference === "sugeno" ? "weighted_average" : "cog",
      epsilon: this._config.epsilon ?? 0.01,
      unit_of_measurement: "%",
      terms: {
        low: { type: "trimf", params: [0, 0, 50] },
        medium: { type: "trimf", params: [25, 50, 75] },
        high: { type: "trimf", params: [50, 100, 100] },
      },
    };
    this.requestUpdate();
  }

  private _removeOutput(key: string) {
    if (!confirm(`Delete output variable '${key}'?`)) return;
    delete this._config.outputs[key];
    this.requestUpdate();
  }

  // --- Rules Handlers & Visual Builder ---
  private _parseRuleToBuilder(
    ruleStr: string
  ): { conditions: RuleCondition[]; consequent: RuleConsequent } | null {
    if (!ruleStr || !ruleStr.trim()) return null;
    const match = ruleStr.trim().match(/^IF\s+(.+)\s+THEN\s+(.+)$/i);
    if (!match) return null;
    const antStr = match[1].trim();
    const conStr = match[2].trim();

    // Parse consequent
    const conMatch = conStr.match(/^([a-zA-Z0-9_]+)\s*(?:IS|=)\s*(.+)$/i);
    if (!conMatch) return null;
    const conVar = conMatch[1].trim();
    const termOrVal = conMatch[2].trim();
    const numVal = parseFloat(termOrVal);
    const isConstant = !isNaN(numVal) && isFinite(numVal) && !termOrVal.match(/[a-zA-Z]/);

    // Parse antecedent clauses
    const tokens = antStr.split(/\s+(AND|OR)\s+/i);
    const conditions: RuleCondition[] = [];
    let currentConnector: "AND" | "OR" = "AND";

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim();
      if (!token) continue;
      if (token.toUpperCase() === "AND") {
        currentConnector = "AND";
        continue;
      }
      if (token.toUpperCase() === "OR") {
        currentConnector = "OR";
        continue;
      }

      const clauseMatch = token.match(
        /^([a-zA-Z0-9_]+)\s+IS\s+(?:(not|very|somewhat|extremely|slightly)\s+)?([a-zA-Z0-9_]+)$/i
      );
      if (!clauseMatch) return null;

      conditions.push({
        variable: clauseMatch[1].trim(),
        hedge: (clauseMatch[2] || "").trim().toLowerCase(),
        term: clauseMatch[3].trim(),
        connector: conditions.length === 0 ? "AND" : currentConnector,
      });
    }

    if (conditions.length === 0) return null;

    return {
      conditions,
      consequent: {
        variable: conVar,
        term: isConstant ? "" : termOrVal,
        isConstant,
        constantValue: isConstant ? numVal : 0,
      },
    };
  }

  private _compileRuleString(
    conditions: RuleCondition[],
    consequent: RuleConsequent
  ): string {
    const antParts: string[] = [];
    conditions.forEach((cond, idx) => {
      const hedgePart = cond.hedge ? `${cond.hedge} ` : "";
      const clause = `${cond.variable} IS ${hedgePart}${cond.term}`;
      if (idx === 0) {
        antParts.push(clause);
      } else {
        antParts.push(`${cond.connector} ${clause}`);
      }
    });
    const antStr = antParts.join(" ");
    const conStr = consequent.isConstant
      ? `${consequent.variable} IS ${consequent.constantValue}`
      : `${consequent.variable} IS ${consequent.term}`;
    return `IF ${antStr} THEN ${conStr}`;
  }

  private _openAddRuleBuilder() {
    this._ruleBuilderError = "";
    const inputKeys = Object.keys(this._config.inputs || {});
    const outputKeys = Object.keys(this._config.outputs || {});

    if (inputKeys.length === 0) {
      this._error = "Please define at least one input antecedent variable before creating rules.";
      this._activeTab = "inputs";
      return;
    }
    if (outputKeys.length === 0) {
      this._error = "Please define at least one output consequent variable before creating rules.";
      this._activeTab = "outputs";
      return;
    }

    const firstInput = inputKeys[0];
    const firstInputTerms = Object.keys(this._config.inputs[firstInput]?.terms || {});
    const firstOutput = outputKeys[0];
    const firstOutputTerms = Object.keys(this._config.outputs[firstOutput]?.terms || {});

    this._editingRuleIndex = -1;
    this._builderConditions = [
      {
        variable: firstInput,
        hedge: "",
        term: firstInputTerms[0] || "low",
        connector: "AND",
      },
    ];
    this._builderConsequent = {
      variable: firstOutput,
      term: firstOutputTerms[0] || "low",
      isConstant: false,
      constantValue: 0,
    };
    this._showRuleBuilderModal = true;
  }

  private _openEditRuleBuilder(index: number) {
    this._ruleBuilderError = "";
    const ruleStr = this._config.rules[index] || "";
    const parsed = this._parseRuleToBuilder(ruleStr);

    if (parsed) {
      this._editingRuleIndex = index;
      this._builderConditions = parsed.conditions;
      this._builderConsequent = parsed.consequent;
      this._showRuleBuilderModal = true;
    } else {
      const inputKeys = Object.keys(this._config.inputs || {});
      const outputKeys = Object.keys(this._config.outputs || {});
      const firstInput = inputKeys[0] || "";
      const firstInputTerms = Object.keys(this._config.inputs[firstInput]?.terms || {});
      const firstOutput = outputKeys[0] || "";
      const firstOutputTerms = Object.keys(this._config.outputs[firstOutput]?.terms || {});

      this._editingRuleIndex = index;
      this._builderConditions = [
        {
          variable: firstInput,
          hedge: "",
          term: firstInputTerms[0] || "low",
          connector: "AND",
        },
      ];
      this._builderConsequent = {
        variable: firstOutput,
        term: firstOutputTerms[0] || "low",
        isConstant: false,
        constantValue: 0,
      };
      this._ruleBuilderError = `Notice: Rule #${index + 1} uses non-standard formatting. Configuring it here will format it as canonical syntax.`;
      this._showRuleBuilderModal = true;
    }
  }

  private _onBuilderConditionVarChange(idx: number, newVar: string) {
    const terms = Object.keys(this._config.inputs[newVar]?.terms || {});
    this._builderConditions[idx].variable = newVar;
    this._builderConditions[idx].term = terms[0] || "";
    this.requestUpdate();
  }

  private _onBuilderConsequentVarChange(newVar: string) {
    const terms = Object.keys(this._config.outputs[newVar]?.terms || {});
    this._builderConsequent.variable = newVar;
    if (!this._builderConsequent.isConstant) {
      this._builderConsequent.term = terms[0] || "";
    }
    this.requestUpdate();
  }

  private _addBuilderCondition(connector: "AND" | "OR" = "AND") {
    const inputKeys = Object.keys(this._config.inputs || {});
    const firstInput = inputKeys[0] || "";
    const terms = Object.keys(this._config.inputs[firstInput]?.terms || {});
    this._builderConditions.push({
      variable: firstInput,
      hedge: "",
      term: terms[0] || "",
      connector,
    });
    this.requestUpdate();
  }

  private _removeBuilderCondition(idx: number) {
    if (this._builderConditions.length <= 1) return;
    this._builderConditions.splice(idx, 1);
    this.requestUpdate();
  }

  private _saveBuilderRule() {
    this._ruleBuilderError = "";
    if (this._builderConditions.length === 0) {
      this._ruleBuilderError = "At least one antecedent condition is required.";
      return;
    }
    for (const c of this._builderConditions) {
      if (!c.variable || !c.term) {
        this._ruleBuilderError = "All conditions must have an input variable and a term selected.";
        return;
      }
    }
    if (!this._builderConsequent.variable) {
      this._ruleBuilderError = "An output consequent variable must be selected.";
      return;
    }
    if (!this._builderConsequent.isConstant && !this._builderConsequent.term) {
      this._ruleBuilderError = "An output linguistic term must be selected.";
      return;
    }

    const compiled = this._compileRuleString(
      this._builderConditions,
      this._builderConsequent
    );
    if (this._editingRuleIndex >= 0) {
      this._config.rules[this._editingRuleIndex] = compiled;
    } else {
      this._config.rules = [...this._config.rules, compiled];
    }
    this._showRuleBuilderModal = false;
    this.requestUpdate();
  }

  private _addRule() {
    this._config.rules = [...this._config.rules, "IF  THEN "];
    this._rulesViewMode = "text";
    this.requestUpdate();
  }

  private _updateRule(index: number, val: string) {
    this._config.rules[index] = val;
  }

  private _removeRule(index: number) {
    this._config.rules.splice(index, 1);
    this.requestUpdate();
  }

  render() {
    if (!this._config) return html``;
    const isYaml = this.source === "yaml";

    return html`
      <div class="header-actions">
        <div>
          <button class="btn btn-secondary" @click=${this._handleBack}>
            ← Back to Catalog
          </button>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          ${this._saving ? html`<span class="chip">Saving...</span>` : ""}
          ${!isYaml
            ? html`
                <button
                  class="btn btn-primary"
                  @click=${this._handleSave}
                  ?disabled=${this._saving}
                >
                  💾 Save Controller
                </button>
              `
            : ""}
        </div>
      </div>

      ${isYaml
        ? html`
            <div class="yaml-banner">
              <span>⚠️</span>
              <div>
                <strong>Defined in configuration.yaml</strong> — This controller is managed via YAML configuration and is shown in read-only inspection mode.
              </div>
            </div>
          `
        : ""}
      ${this._error ? html`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">${this._error}</div>` : ""}
      ${this._successMsg ? html`<div style="color: var(--fuzzy-success); margin-bottom: 16px;">${this._successMsg}</div>` : ""}

      <div class="card">
        <div class="tabs">
          <button
            class="tab-btn ${this._activeTab === "general" ? "active" : ""}"
            @click=${() => (this._activeTab = "general")}
          >
            ⚙️ General
          </button>
          <button
            class="tab-btn ${this._activeTab === "inputs" ? "active" : ""}"
            @click=${() => (this._activeTab = "inputs")}
          >
            📥 Inputs (${Object.keys(this._config.inputs || {}).length})
          </button>
          <button
            class="tab-btn ${this._activeTab === "outputs" ? "active" : ""}"
            @click=${() => (this._activeTab = "outputs")}
          >
            📤 Outputs (${Object.keys(this._config.outputs || {}).length})
          </button>
          <button
            class="tab-btn ${this._activeTab === "rules" ? "active" : ""}"
            @click=${() => (this._activeTab = "rules")}
          >
            📜 Rules (${(this._config.rules || []).length})
          </button>
          <button
            class="tab-btn ${this._activeTab === "raw" ? "active" : ""}"
            @click=${() => {
              this._rawJson = JSON.stringify(this._config, null, 2);
              this._activeTab = "raw";
            }}
          >
            { } Raw Config
          </button>
        </div>

        ${this._renderActiveTab(isYaml)}
      </div>

      ${this._showAddInputModal ? this._renderAddInputModal() : ""}
      ${this._showRuleBuilderModal ? this._renderRuleBuilderModal() : ""}
    `;
  }

  private _renderAddInputModal() {
    return html`
      <div
        class="modal-overlay"
        @click=${(e: any) => {
          if (e.target.classList.contains("modal-overlay")) {
            this._showAddInputModal = false;
          }
        }}
      >
        <div class="modal-content" style="max-width: 640px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <h2 style="font-size: 20px; font-weight: 700;">Add Input Antecedent Variable</h2>
            <button
              class="btn btn-icon"
              @click=${() => (this._showAddInputModal = false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          <div
            style="background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.25); border-radius: var(--fuzzy-radius-md); padding: 14px; margin-bottom: 20px; font-size: 13px; line-height: 1.5;"
          >
            <div style="font-weight: 600; color: #38bdf8; margin-bottom: 4px;">
              💡 Linguistic Variable vs. Bound Sensor Entity
            </div>
            <div>
              • <strong>Bound Sensor Entity</strong>: The Home Assistant device feeding real-time numeric measurements.<br />
              • <strong>Linguistic Variable Name</strong>: The identifier used in rules (e.g. <code>IF indoor_temp IS hot THEN ...</code>).
            </div>
          </div>

          ${this._newInputModalError
            ? html`<div style="color: var(--fuzzy-danger); margin-bottom: 14px; font-size: 13px;">${this._newInputModalError}</div>`
            : ""}

          <div class="form-group">
            <label class="form-label" style="font-weight: 600;">1. Select Home Assistant Sensor Entity</label>
            ${this._renderEntityPicker(
              this._newInputEntityId,
              false,
              (val) => this._onNewInputEntitySelected(val)
            )}
            <div class="helper-text">
              Search and pick a live entity. Selecting one will auto-suggest the linguistic name and range.
            </div>
          </div>

          ${this._newInputEntityId
            ? html`
                <div
                  style="margin-bottom: 18px; padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: var(--fuzzy-radius-sm); display: flex; align-items: center; justify-content: space-between;"
                >
                  <span style="font-size: 13px; color: var(--fuzzy-text-secondary);">Current Entity State:</span>
                  ${this._renderEntityStatusTag(this._newInputEntityId)}
                </div>
              `
            : ""}

          <div class="form-group">
            <label class="form-label" style="font-weight: 600;">2. Linguistic Variable Name (for rules)</label>
            <input
              class="input-text"
              type="text"
              placeholder="e.g. indoor_temperature"
              .value=${this._newInputVarName}
              @input=${(e: any) =>
                (this._newInputVarName = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
            />
            <div class="helper-text">
              Used in rules: <code>IF ${this._newInputVarName || "variable_name"} IS &lt;term&gt; THEN ...</code>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Range Minimum</label>
              <input
                class="input-text"
                type="number"
                .value=${String(this._newInputMin)}
                @input=${(e: any) => (this._newInputMin = parseFloat(e.target.value))}
              />
            </div>
            <div class="form-group">
              <label class="form-label">Range Maximum</label>
              <input
                class="input-text"
                type="number"
                .value=${String(this._newInputMax)}
                @input=${(e: any) => (this._newInputMax = parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Initial Linguistic Terms Preset</label>
            <select
              class="input-select"
              .value=${this._newInputTermsPreset}
              @change=${(e: any) => (this._newInputTermsPreset = e.target.value)}
            >
              <option value="3_terms">3 Terms (Low, Medium, High)</option>
              <option value="5_terms">5 Terms (Very Low, Low, Medium, High, Very High)</option>
            </select>
            <div class="helper-text">You can fine-tune or add custom terms at any time.</div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
            <button
              class="btn btn-secondary"
              @click=${() => (this._showAddInputModal = false)}
            >
              Cancel
            </button>
            <button class="btn btn-primary" @click=${this._confirmAddInput}>
              + Add Variable
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderActiveTab(isYaml: boolean) {
    switch (this._activeTab) {
      case "general":
        return this._renderGeneralTab(isYaml);
      case "inputs":
        return this._renderInputsTab(isYaml);
      case "outputs":
        return this._renderOutputsTab(isYaml);
      case "rules":
        return this._renderRulesTab(isYaml);
      case "raw":
        return this._renderRawTab(isYaml);
    }
  }

  private _renderGeneralTab(isYaml: boolean) {
    return html`
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">System Identifier (system_id)</label>
          <input
            class="input-text"
            type="text"
            .value=${this._config.system_id || ""}
            ?disabled=${isYaml || Boolean(this.entryId)}
            placeholder="e.g. climate_controller"
            @input=${(e: any) => (this._config.system_id = e.target.value)}
          />
          <div class="helper-text">Unique alphanumeric slug for entity IDs (sensor.fuzzy_system_*)</div>
        </div>

        <div class="form-group">
          <label class="form-label">Display Name</label>
          <input
            class="input-text"
            type="text"
            .value=${this._config.name || ""}
            ?disabled=${isYaml}
            placeholder="e.g. Climate Controller"
            @input=${(e: any) => (this._config.name = e.target.value)}
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea
          class="input-textarea"
          rows="2"
          .value=${this._config.description || ""}
          ?disabled=${isYaml}
          placeholder="Brief description of the control objectives..."
          @input=${(e: any) => (this._config.description = e.target.value)}
        ></textarea>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">Inference Engine</label>
          <select
            class="input-select"
            .value=${this._config.inference || "mamdani"}
            ?disabled=${isYaml}
            @change=${(e: any) => this._handleInferenceChange(e.target.value)}
          >
            <option value="mamdani">Mamdani (Fuzzy Output Sets)</option>
            <option value="sugeno">Takagi-Sugeno (Crisp Function/Singleton Outputs)</option>
          </select>
          <div class="helper-text">Mamdani defuzzifies full distributions; Sugeno computes weighted averages</div>
        </div>

        <div class="form-group">
          <label class="form-label">Default Defuzzifier</label>
          <select
            class="input-select"
            .value=${this._config.defuzzifier || (this._config.inference === "sugeno" ? "weighted_average" : "cog")}
            ?disabled=${isYaml}
            @change=${(e: any) => (this._config.defuzzifier = e.target.value)}
          >
            ${this._config.inference === "sugeno"
              ? html`
                  <option value="weighted_average">Weighted Average (weighted_average)</option>
                  <option value="wtsum">Weighted Sum (wtsum)</option>
                `
              : html`
                  <option value="cog">Centroid / Center of Gravity (cog)</option>
                  <option value="boa">Bisector of Area (boa)</option>
                  <option value="mom">Mean of Maximum (mom)</option>
                  <option value="som">Smallest of Maximum (som)</option>
                  <option value="lom">Largest of Maximum (lom)</option>
                  <option value="cos">Center of Sums (cos)</option>
                  <option value="coa">Center of Area (coa)</option>
                `}
          </select>
        </div>
      </div>

      <h3 style="font-size: 15px; font-weight: 600; margin: 24px 0 12px; color: var(--fuzzy-accent);">
        ⏱️ Recurrence & Stability Guardrails
      </h3>
      <div class="grid-3">
        <div class="form-group">
          <label class="form-label">Max Updates per Period</label>
          <input
            class="input-text"
            type="number"
            min="1"
            .value=${String(this._config.max_updates_per_period ?? 20)}
            ?disabled=${isYaml}
            @input=${(e: any) => (this._config.max_updates_per_period = parseInt(e.target.value, 10))}
          />
          <div class="helper-text">Default: 20 updates</div>
        </div>

        <div class="form-group">
          <label class="form-label">Update Period (Seconds)</label>
          <input
            class="input-text"
            type="number"
            step="0.005"
            min="0.001"
            .value=${String(this._config.update_period ?? 0.05)}
            ?disabled=${isYaml}
            @input=${(e: any) => (this._config.update_period = parseFloat(e.target.value))}
          />
          <div class="helper-text">Default: 0.05s sliding window</div>
        </div>

        <div class="form-group">
          <label class="form-label">Epsilon Deadband (ε)</label>
          <input
            class="input-text"
            type="number"
            step="0.001"
            min="0"
            .value=${String(this._config.epsilon ?? 0.01)}
            ?disabled=${isYaml}
            @input=${(e: any) => (this._config.epsilon = parseFloat(e.target.value))}
          />
          <div class="helper-text">Suppresses updates if |Δy| &lt; ε (Default: 0.01)</div>
        </div>
      </div>

      <div class="form-group" style="margin-top: 14px;">
        <label class="checkbox-label">
          <input
            type="checkbox"
            .checked=${this._config.expose_system_sensor !== false}
            ?disabled=${isYaml}
            @change=${(e: any) => (this._config.expose_system_sensor = e.target.checked)}
          />
          Expose System Status Diagnostic Sensor (sensor.fuzzy_system_{id}_status)
        </label>
      </div>
    `;
  }

  private _renderInputsTab(isYaml: boolean) {
    const inputs = this._config.inputs || {};
    const keys = Object.keys(inputs);

    return html`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Input Antecedents</h3>
          <p class="helper-text">Sensors and numerical inputs mapped to linguistic membership terms</p>
        </div>
        ${!isYaml
          ? html`
              <button class="btn btn-secondary" @click=${this._openAddInputModal}>
                + Add Input Variable
              </button>
            `
          : ""}
      </div>

      ${keys.length === 0
        ? html`<p class="subtitle" style="padding: 20px 0;">No input variables defined yet.</p>`
        : keys.map((key) => {
            const inp: InputVariableConfig = inputs[key];
            return html`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span class="badge badge-cyan">${key}</span>
                    ${this._renderEntityStatusTag(inp.entity_id)}
                    <span class="chip">Range: [${inp.range[0]}, ${inp.range[1]}]</span>
                  </div>
                  ${!isYaml
                    ? html`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeInput(key)} title="Delete Input">
                          ✕
                        </button>
                      `
                    : ""}
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Bound Home Assistant Sensor Entity</label>
                    ${this._renderEntityPicker(inp.entity_id, isYaml, (val) => {
                      inp.entity_id = val;
                      this.requestUpdate();
                    })}
                    <div class="helper-text">
                      ${inp.entity_id
                        ? html`Feeds live numerical measurements from <code>${inp.entity_id}</code> into <code>${key}</code>.`
                        : html`<span style="color: #fbbf24;">⚠️ Unbound: select an entity to evaluate live rules in HA.</span>`}
                    </div>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label class="form-label">Range Min</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(inp.range[0])}
                        ?disabled=${isYaml}
                        @input=${(e: any) => {
                          inp.range[0] = parseFloat(e.target.value);
                          this.requestUpdate();
                        }}
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Range Max</label>
                      <input
                        class="input-text"
                        type="number"
                        .value=${String(inp.range[1])}
                        ?disabled=${isYaml}
                        @input=${(e: any) => {
                          inp.range[1] = parseFloat(e.target.value);
                          this.requestUpdate();
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <span class="helper-text">Linguistic Terms: </span>
                  ${Object.keys(inp.terms || {}).map(
                    (t) => html`<span class="badge" style="margin-right: 4px;">${t} (${inp.terms[t].type})</span>`
                  )}
                </div>
              </div>
            `;
          })}
    `;
  }

  private _renderOutputsTab(isYaml: boolean) {
    const outputs = this._config.outputs || {};
    const keys = Object.keys(outputs);

    return html`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Output Consequents</h3>
          <p class="helper-text">Control targets defuzzified and published to Home Assistant sensors</p>
        </div>
        ${!isYaml
          ? html`
              <button class="btn btn-secondary" @click=${this._addOutput}>
                + Add Output Variable
              </button>
            `
          : ""}
      </div>

      ${keys.length === 0
        ? html`<p class="subtitle" style="padding: 20px 0;">No output variables defined yet.</p>`
        : keys.map((key) => {
            const out: OutputVariableConfig = outputs[key];
            return html`
              <div class="section-box">
                <div class="section-header">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-amber">${key}</span>
                    <span class="chip">Range: [${out.range[0]}, ${out.range[1]}]</span>
                    ${out.unit_of_measurement ? html`<span class="chip">${out.unit_of_measurement}</span>` : ""}
                  </div>
                  ${!isYaml
                    ? html`
                        <button class="btn btn-danger btn-icon" @click=${() => this._removeOutput(key)} title="Delete Output">
                          ✕
                        </button>
                      `
                    : ""}
                </div>

                <div class="grid-3">
                  <div class="form-group">
                    <label class="form-label">Range Min</label>
                    <input
                      class="input-text"
                      type="number"
                      .value=${String(out.range[0])}
                      ?disabled=${isYaml}
                      @input=${(e: any) => {
                        out.range[0] = parseFloat(e.target.value);
                        this.requestUpdate();
                      }}
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Range Max</label>
                    <input
                      class="input-text"
                      type="number"
                      .value=${String(out.range[1])}
                      ?disabled=${isYaml}
                      @input=${(e: any) => {
                        out.range[1] = parseFloat(e.target.value);
                        this.requestUpdate();
                      }}
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Output Epsilon Deadband</label>
                    <input
                      class="input-text"
                      type="number"
                      step="0.001"
                      placeholder="Inherit system default"
                      .value=${out.epsilon !== undefined ? String(out.epsilon) : ""}
                      ?disabled=${isYaml}
                      @input=${(e: any) => {
                        const val = e.target.value.trim();
                        out.epsilon = val ? parseFloat(val) : undefined;
                        this.requestUpdate();
                      }}
                    />
                  </div>
                </div>

                <div style="margin-top: 8px;">
                  <span class="helper-text">Linguistic Terms: </span>
                  ${Object.keys(out.terms || {}).map(
                    (t) => html`<span class="badge" style="margin-right: 4px;">${t} (${out.terms[t].type})</span>`
                  )}
                </div>
              </div>
            `;
          })}
    `;
  }

  private _renderRulesTab(isYaml: boolean) {
    const rules = this._config.rules || [];

    return html`
      <div
        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;"
      >
        <div>
          <h3 class="section-title">Linguistic Rules</h3>
          <p class="helper-text">
            Declarative IF &lt;antecedents&gt; THEN &lt;consequents&gt; with AND, OR, NOT and linguistic hedges
          </p>
        </div>
        ${!isYaml
          ? html`
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <div
                  style="display: inline-flex; background: rgba(255, 255, 255, 0.05); border-radius: var(--fuzzy-radius-md); padding: 2px; border: 1px solid var(--fuzzy-card-border);"
                >
                  <button
                    class="btn ${this._rulesViewMode === "visual" ? "btn-primary" : "btn-secondary"}"
                    style="padding: 6px 12px; font-size: 12px;"
                    @click=${() => {
                      this._rulesViewMode = "visual";
                      this.requestUpdate();
                    }}
                  >
                    🎨 Visual Cards
                  </button>
                  <button
                    class="btn ${this._rulesViewMode === "text" ? "btn-primary" : "btn-secondary"}"
                    style="padding: 6px 12px; font-size: 12px;"
                    @click=${() => {
                      this._rulesViewMode = "text";
                      this.requestUpdate();
                    }}
                  >
                    📝 Raw Text
                  </button>
                </div>
                <button class="btn btn-primary" @click=${this._openAddRuleBuilder}>
                  ✨ + Rule Builder
                </button>
                <button
                  class="btn btn-secondary"
                  @click=${this._addRule}
                  title="Add empty rule string to type manually"
                >
                  + Quick Text
                </button>
              </div>
            `
          : ""}
      </div>

      ${rules.length === 0
        ? html`
            <div
              style="text-align: center; padding: 40px 20px; background: rgba(15, 23, 42, 0.3); border-radius: var(--fuzzy-radius-md); border: 1px dashed var(--fuzzy-card-border);"
            >
              <div style="font-size: 28px; margin-bottom: 8px;">📜</div>
              <h4 style="font-weight: 600; margin-bottom: 6px;">No Inference Rules Defined Yet</h4>
              <p class="helper-text" style="margin-bottom: 18px;">
                Rules map your input linguistic terms (e.g. temperature IS hot) to output targets (e.g. fan_speed IS fast).
              </p>
              ${!isYaml
                ? html`
                    <button class="btn btn-primary" @click=${this._openAddRuleBuilder}>
                      ✨ Create First Rule with Builder
                    </button>
                  `
                : ""}
            </div>
          `
        : this._rulesViewMode === "visual"
        ? rules.map((rule, idx) => {
            const parsed = this._parseRuleToBuilder(rule);
            if (!parsed) {
              return html`
                <div class="rule-card">
                  <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <span class="badge badge-purple" style="width: 24px; justify-content: center;">${idx + 1}</span>
                    <span style="font-family: monospace; font-size: 13px;">${rule}</span>
                  </div>
                  ${!isYaml
                    ? html`
                        <div style="display: flex; gap: 8px; align-items: center;">
                          <button
                            class="btn btn-secondary"
                            style="padding: 6px 12px; font-size: 12px;"
                            @click=${() => this._openEditRuleBuilder(idx)}
                          >
                            ✏️ Builder
                          </button>
                          <button
                            class="btn btn-danger btn-icon"
                            @click=${() => this._removeRule(idx)}
                            title="Delete Rule"
                          >
                            ✕
                          </button>
                        </div>
                      `
                    : ""}
                </div>
              `;
            }

            return html`
              <div class="rule-card">
                <div style="display: flex; flex-direction: column; gap: 8px; flex: 1;">
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span class="badge badge-purple" style="width: 24px; justify-content: center;">${idx + 1}</span>
                    <span class="badge badge-cyan">IF</span>
                    ${parsed.conditions.map(
                      (c, cIdx) => html`
                        ${cIdx > 0 ? html`<span class="badge badge-purple">${c.connector}</span>` : ""}
                        <span class="chip" style="font-weight: 600; color: #38bdf8; background: rgba(56, 189, 248, 0.1);">
                          ${c.variable}
                        </span>
                        <span class="chip" style="color: #94a3b8;">
                          ${c.hedge ? `is ${c.hedge}` : "is"}
                        </span>
                        <span class="chip" style="font-weight: 600; color: #34d399; background: rgba(52, 211, 153, 0.1);">
                          ${c.term}
                        </span>
                      `
                    )}
                    <span class="badge badge-amber">THEN</span>
                    <span class="chip" style="font-weight: 600; color: #fbbf24; background: rgba(245, 158, 11, 0.1);">
                      ${parsed.consequent.variable}
                    </span>
                    <span class="chip" style="color: #94a3b8;">is</span>
                    <span class="chip" style="font-weight: 600; color: #34d399; background: rgba(52, 211, 153, 0.1);">
                      ${parsed.consequent.isConstant
                        ? parsed.consequent.constantValue
                        : parsed.consequent.term}
                    </span>
                  </div>
                  <div style="font-family: monospace; font-size: 11px; color: var(--fuzzy-text-secondary); padding-left: 32px;">
                    ${rule}
                  </div>
                </div>

                ${!isYaml
                  ? html`
                      <div style="display: flex; gap: 8px; align-items: center;">
                        <button
                          class="btn btn-secondary"
                          style="padding: 6px 12px; font-size: 12px;"
                          @click=${() => this._openEditRuleBuilder(idx)}
                          title="Edit in Visual Builder"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          class="btn btn-danger btn-icon"
                          @click=${() => this._removeRule(idx)}
                          title="Delete Rule"
                        >
                          ✕
                        </button>
                      </div>
                    `
                  : ""}
              </div>
            `;
          })
        : rules.map(
            (rule, idx) => html`
              <div class="rule-item">
                <span class="badge badge-purple" style="width: 24px; justify-content: center;">${idx + 1}</span>
                <input
                  class="input-text rule-input"
                  type="text"
                  .value=${rule}
                  ?disabled=${isYaml}
                  @input=${(e: any) => this._updateRule(idx, e.target.value)}
                />
                ${!isYaml
                  ? html`
                      <button
                        class="btn btn-secondary"
                        style="padding: 6px 10px; font-size: 12px;"
                        @click=${() => this._openEditRuleBuilder(idx)}
                        title="Edit in Visual Builder"
                      >
                        ✏️
                      </button>
                      <button
                        class="btn btn-danger btn-icon"
                        @click=${() => this._removeRule(idx)}
                        title="Delete Rule"
                      >
                        ✕
                      </button>
                    `
                  : ""}
              </div>
            `
          )}
    `;
  }

  private _renderRuleBuilderModal() {
    const inputKeys = Object.keys(this._config.inputs || {});
    const outputKeys = Object.keys(this._config.outputs || {});

    return html`
      <div
        class="modal-overlay"
        @click=${(e: any) => {
          if (e.target.classList.contains("modal-overlay")) {
            this._showRuleBuilderModal = false;
          }
        }}
      >
        <div class="modal-content" style="max-width: 780px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
            <h2 style="font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
              <span>🪄</span>
              <span>${this._editingRuleIndex >= 0 ? `Edit Rule #${this._editingRuleIndex + 1}` : "Add Rule (Visual Builder)"}</span>
            </h2>
            <button
              class="btn btn-icon"
              @click=${() => (this._showRuleBuilderModal = false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          <div
            style="background: rgba(2, 132, 199, 0.1); border: 1px solid rgba(2, 132, 199, 0.25); border-radius: var(--fuzzy-radius-md); padding: 12px 16px; margin-bottom: 20px; font-size: 13px; line-height: 1.5;"
          >
            <div style="font-weight: 600; color: #38bdf8; margin-bottom: 2px;">
              💡 Guided Linguistic Rule Builder
            </div>
            <div style="color: var(--fuzzy-text-secondary);">
              Configure linguistic clauses using dropdown controls. Variables and terms are automatically populated from your system definition.
            </div>
          </div>

          ${this._ruleBuilderError
            ? html`<div style="color: var(--fuzzy-danger); margin-bottom: 14px; font-size: 13px;">${this._ruleBuilderError}</div>`
            : ""}

          <!-- Antecedents (IF) -->
          <div
            class="section-box"
            style="background: rgba(14, 165, 233, 0.05); border: 1px solid rgba(14, 165, 233, 0.25); padding: 18px; margin-bottom: 18px; border-radius: var(--fuzzy-radius-md);"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <span style="font-weight: 700; color: #38bdf8; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
                🔹 IF (Antecedent Conditions)
              </span>
              <button
                class="btn btn-secondary"
                style="padding: 6px 12px; font-size: 12px;"
                @click=${() => this._addBuilderCondition("AND")}
              >
                + Add Condition (AND)
              </button>
            </div>

            ${this._builderConditions.map((cond, idx) => {
              const inputTerms = Object.keys(this._config.inputs[cond.variable]?.terms || {});
              return html`
                <div class="builder-row">
                  ${idx > 0
                    ? html`
                        <select
                          class="input-select"
                          style="width: 85px; font-weight: 700; color: #c084fc; border-color: rgba(168, 85, 247, 0.4);"
                          .value=${cond.connector}
                          @change=${(e: any) => {
                            cond.connector = e.target.value;
                            this.requestUpdate();
                          }}
                        >
                          <option value="AND">AND</option>
                          <option value="OR">OR</option>
                        </select>
                      `
                    : html`<span class="badge badge-cyan" style="width: 70px; justify-content: center;">IF</span>`}

                  <!-- Input Variable -->
                  <select
                    class="input-select"
                    style="flex: 1; min-width: 140px; font-weight: 600;"
                    .value=${cond.variable}
                    @change=${(e: any) => this._onBuilderConditionVarChange(idx, e.target.value)}
                  >
                    ${inputKeys.map((inpKey) => html`<option value=${inpKey}>${inpKey}</option>`)}
                  </select>

                  <!-- Hedge -->
                  <select
                    class="input-select"
                    style="width: 130px;"
                    .value=${cond.hedge}
                    @change=${(e: any) => {
                      cond.hedge = e.target.value;
                      this.requestUpdate();
                    }}
                  >
                    <option value="">IS</option>
                    <option value="not">IS NOT</option>
                    <option value="very">IS VERY</option>
                    <option value="somewhat">IS SOMEWHAT</option>
                    <option value="extremely">IS EXTREMELY</option>
                    <option value="slightly">IS SLIGHTLY</option>
                  </select>

                  <!-- Linguistic Term -->
                  <select
                    class="input-select"
                    style="flex: 1; min-width: 120px; font-weight: 600; color: #34d399;"
                    .value=${cond.term}
                    @change=${(e: any) => {
                      cond.term = e.target.value;
                      this.requestUpdate();
                    }}
                  >
                    ${inputTerms.map((termKey) => html`<option value=${termKey}>${termKey}</option>`)}
                  </select>

                  ${this._builderConditions.length > 1
                    ? html`
                        <button
                          class="btn btn-danger btn-icon"
                          title="Remove Condition"
                          @click=${() => this._removeBuilderCondition(idx)}
                        >
                          ✕
                        </button>
                      `
                    : ""}
                </div>
              `;
            })}
          </div>

          <!-- Consequent (THEN) -->
          <div
            class="section-box"
            style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.25); padding: 18px; margin-bottom: 20px; border-radius: var(--fuzzy-radius-md);"
          >
            <div style="font-weight: 700; color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 14px;">
              🔸 THEN (Consequent Action)
            </div>

            <div class="builder-row">
              <span class="badge badge-amber" style="width: 70px; justify-content: center;">THEN</span>

              <!-- Output Variable -->
              <select
                class="input-select"
                style="flex: 1; min-width: 150px; font-weight: 600;"
                .value=${this._builderConsequent.variable}
                @change=${(e: any) => this._onBuilderConsequentVarChange(e.target.value)}
              >
                ${outputKeys.map((outKey) => html`<option value=${outKey}>${outKey}</option>`)}
              </select>

              <span style="font-size: 13px; font-weight: 700; color: var(--fuzzy-text-secondary);">IS</span>

              ${this._builderConsequent.isConstant
                ? html`
                    <input
                      class="input-text"
                      style="flex: 1; min-width: 120px;"
                      type="number"
                      step="any"
                      .value=${String(this._builderConsequent.constantValue)}
                      @input=${(e: any) => {
                        this._builderConsequent.constantValue = parseFloat(e.target.value);
                        this.requestUpdate();
                      }}
                    />
                  `
                : html`
                    <select
                      class="input-select"
                      style="flex: 1; min-width: 120px; font-weight: 600; color: #34d399;"
                      .value=${this._builderConsequent.term}
                      @change=${(e: any) => {
                        this._builderConsequent.term = e.target.value;
                        this.requestUpdate();
                      }}
                    >
                      ${Object.keys(
                        this._config.outputs[this._builderConsequent.variable]?.terms || {}
                      ).map((tKey) => html`<option value=${tKey}>${tKey}</option>`)}
                    </select>
                  `}

              ${this._config.inference === "sugeno"
                ? html`
                    <label class="checkbox-label" style="font-size: 12px; margin-left: 8px;">
                      <input
                        type="checkbox"
                        .checked=${this._builderConsequent.isConstant}
                        @change=${(e: any) => {
                          this._builderConsequent.isConstant = e.target.checked;
                          this.requestUpdate();
                        }}
                      />
                      Numeric Constant
                    </label>
                  `
                : ""}
            </div>
          </div>

          <!-- Live Preview -->
          <div
            style="background: #020617; border: 1px solid rgba(56, 189, 248, 0.4); border-radius: var(--fuzzy-radius-md); padding: 14px 18px; margin-bottom: 24px;"
          >
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fuzzy-text-secondary); font-weight: 600;">
                Live Linguistic Rule Preview
              </span>
              <span class="badge badge-emerald" style="font-size: 10px;">✓ Canonical Syntax</span>
            </div>
            <div style="font-family: monospace; font-size: 14px; color: #e2e8f0; word-break: break-all;">
              ${this._compileRuleString(this._builderConditions, this._builderConsequent)}
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button class="btn btn-secondary" @click=${() => (this._showRuleBuilderModal = false)}>
              Cancel
            </button>
            <button class="btn btn-primary" @click=${this._saveBuilderRule}>
              ${this._editingRuleIndex >= 0 ? "Update Rule" : "+ Add Rule to System"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderRawTab(isYaml: boolean) {
    return html`
      <div class="form-group">
        <label class="form-label">Full Configuration JSON</label>
        <textarea
          class="input-textarea"
          rows="16"
          style="font-family: monospace; font-size: 13px;"
          .value=${this._rawJson}
          ?disabled=${isYaml}
          @input=${(e: any) => (this._rawJson = e.target.value)}
        ></textarea>
        <div class="helper-text">You can directly copy, edit, or paste your entire controller definition here.</div>
      </div>
    `;
  }
}
