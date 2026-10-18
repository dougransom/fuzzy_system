import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { FuzzySystemConfig, HomeAssistant, InputVariableConfig, OutputVariableConfig } from "../types";
import { saveSystem } from "../api/websocket";
import { sharedStyles } from "../styles/shared-styles";

@customElement("fuzzy-system-editor")
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
        defuzzifier: "centroid",
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
      this._config.defuzzifier = "wtaverage";
    } else {
      this._config.defuzzifier = "centroid";
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
  private _addInput() {
    const inputName = prompt("Enter input variable name (e.g., temperature):");
    if (!inputName || !inputName.trim()) return;
    const key = inputName.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");

    if (this._config.inputs[key]) {
      alert(`Input '${key}' already exists.`);
      return;
    }

    this._config.inputs[key] = {
      entity_id: "",
      range: [0, 100],
      resolution: 100,
      default: 0,
      terms: {
        low: { type: "trapmf", params: [0, 0, 20, 40] },
        medium: { type: "trimf", params: [30, 50, 70] },
        high: { type: "trapmf", params: [60, 80, 100, 100] },
      },
    };
    this.requestUpdate();
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
      defuzzifier: this._config.inference === "sugeno" ? "wtaverage" : "centroid",
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

  // --- Rules Handlers ---
  private _addRule() {
    this._config.rules = [...this._config.rules, "IF  THEN "];
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
            .value=${this._config.defuzzifier || "centroid"}
            ?disabled=${isYaml}
            @change=${(e: any) => (this._config.defuzzifier = e.target.value)}
          >
            ${this._config.inference === "sugeno"
              ? html`
                  <option value="wtaverage">Weighted Average (wtaverage)</option>
                  <option value="wtsum">Weighted Sum (wtsum)</option>
                `
              : html`
                  <option value="centroid">Centroid (Center of Gravity)</option>
                  <option value="bisector">Bisector of Area</option>
                  <option value="mom">Mean of Maximum (mom)</option>
                  <option value="som">Smallest of Maximum (som)</option>
                  <option value="lom">Largest of Maximum (lom)</option>
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
              <button class="btn btn-secondary" @click=${this._addInput}>
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
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge badge-cyan">${key}</span>
                    <span class="chip">${inp.entity_id || "Unbound"}</span>
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
                    <label class="form-label">Home Assistant Entity ID</label>
                    <input
                      class="input-text"
                      type="text"
                      .value=${inp.entity_id || ""}
                      ?disabled=${isYaml}
                      placeholder="e.g. sensor.living_room_temperature"
                      @input=${(e: any) => {
                        inp.entity_id = e.target.value;
                        this.requestUpdate();
                      }}
                    />
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
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h3 class="section-title">Linguistic Rules</h3>
          <p class="helper-text">IF &lt;antecedents&gt; THEN &lt;consequents&gt; with AND, OR, NOT and linguistic hedges</p>
        </div>
        ${!isYaml
          ? html`
              <button class="btn btn-secondary" @click=${this._addRule}>
                + Add Rule
              </button>
            `
          : ""}
      </div>

      ${rules.length === 0
        ? html`<p class="subtitle" style="padding: 20px 0;">No inference rules defined yet.</p>`
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
                      <button class="btn btn-danger btn-icon" @click=${() => this._removeRule(idx)}>
                        ✕
                      </button>
                    `
                  : ""}
              </div>
            `
          )}
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
