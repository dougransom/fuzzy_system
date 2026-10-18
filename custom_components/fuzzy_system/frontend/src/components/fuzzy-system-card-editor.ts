import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../utils/custom-element";
import { HomeAssistant } from "../types";

export interface FuzzySystemCardConfig {
  type?: string;
  system_id?: string;
  title?: string;
  show_graph?: boolean;
  show_inputs?: boolean;
  show_rules?: boolean;
}

@safeCustomElement("fuzzy-system-card-editor")
export class FuzzySystemCardEditor extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px 0;
      color: var(--primary-text-color, #f8fafc);
      font-family: var(--ha-font-family, sans-serif);
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--primary-text-color, #e2e8f0);
    }

    .form-helper {
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
      margin-top: 4px;
    }

    .input-field,
    .select-field {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      background: var(--card-background-color, #1e293b);
      border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      border-radius: 8px;
      color: var(--primary-text-color, #f8fafc);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .input-field:focus,
    .select-field:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }

    .select-field option {
      background: #1e293b;
      color: #f8fafc;
    }

    .toggles-group {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .toggle-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .toggle-title {
      font-size: 13px;
      font-weight: 600;
    }

    .toggle-desc {
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
    }

    /* Switch styling */
    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      flex-shrink: 0;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.15);
      transition: 0.3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #0284c7;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .system-badge {
      display: inline-block;
      margin-left: 6px;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
    }
  `;

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: FuzzySystemCardConfig;

  public setConfig(config: FuzzySystemCardConfig): void {
    this._config = {
      show_graph: true,
      show_inputs: true,
      show_rules: true,
      ...config,
    };
  }

  private _getAvailableSystems(): string[] {
    const systems = new Set<string>();
    if (!this.hass?.states) return ["fan_simulator", "tipping"];

    for (const [entityId, stateObj] of Object.entries(this.hass.states)) {
      const match = entityId.match(/^sensor\.fuzzy_([a-zA-Z0-9_-]+)_status$/);
      if (match) {
        systems.add(match[1]);
      }
      if (stateObj.attributes?.system) {
        systems.add(stateObj.attributes.system);
      }
    }

    if (systems.size === 0) {
      systems.add("fan_simulator");
      systems.add("tipping");
    }

    return Array.from(systems).sort();
  }

  private _valueChanged(ev: Event): void {
    if (!this._config) return;
    const target = ev.target as HTMLInputElement | HTMLSelectElement;
    const configValue = target.dataset.configValue as keyof FuzzySystemCardConfig;
    if (!configValue) return;

    let newValue: any;
    if (target.type === "checkbox") {
      newValue = (target as HTMLInputElement).checked;
    } else {
      newValue = target.value;
    }

    this._config = {
      ...this._config,
      [configValue]: newValue,
    };

    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const availableSystems = this._getAvailableSystems();
    const currentSystem = this._config.system_id || availableSystems[0] || "";

    return html`
      <div class="card-config">
        <!-- Fuzzy System Selector -->
        <div class="form-group">
          <label class="form-label" for="system-select">
            Target Fuzzy System
            <span class="system-badge">${availableSystems.length} detected</span>
          </label>
          <select
            id="system-select"
            class="select-field"
            data-config-value="system_id"
            .value=${currentSystem}
            @change=${this._valueChanged}
          >
            ${availableSystems.map(
              (sys) => html`
                <option value=${sys} ?selected=${sys === currentSystem}>
                  ${sys} (${this.hass.states[`sensor.fuzzy_${sys}_status`]?.state || "active"})
                </option>
              `
            )}
          </select>
          <div class="form-helper">
            Select the fuzzy logic controller to monitor and visualize on this dashboard card.
          </div>
        </div>

        <!-- Custom Card Title -->
        <div class="form-group">
          <label class="form-label" for="card-title">Card Title (Optional)</label>
          <input
            id="card-title"
            class="input-field"
            type="text"
            data-config-value="title"
            placeholder="e.g. Living Room Fan Controller"
            .value=${this._config.title || ""}
            @input=${this._valueChanged}
          />
          <div class="form-helper">Leave blank to use the fuzzy system name automatically.</div>
        </div>

        <!-- Display Toggles -->
        <div class="form-group">
          <label class="form-label">Visual Card Components</label>
          <div class="toggles-group">
            <!-- Aggregated Graph Toggle -->
            <label class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">Aggregated Output Waveform</span>
                <span class="toggle-desc">Real-time shaded fuzzy set distribution with defuzzification slice</span>
              </div>
              <div class="switch">
                <input
                  type="checkbox"
                  data-config-value="show_graph"
                  .checked=${this._config.show_graph !== false}
                  @change=${this._valueChanged}
                />
                <span class="slider"></span>
              </div>
            </label>

            <!-- Inputs Grid Toggle -->
            <label class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">Live Inputs Grid</span>
                <span class="toggle-desc">Show input metric pills and values feeding into the engine</span>
              </div>
              <div class="switch">
                <input
                  type="checkbox"
                  data-config-value="show_inputs"
                  .checked=${this._config.show_inputs !== false}
                  @change=${this._valueChanged}
                />
                <span class="slider"></span>
              </div>
            </label>

            <!-- Rule Strengths Toggle -->
            <label class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-title">Active Rule Firing Strengths</span>
                <span class="toggle-desc">Show firing strength progress bars for active rules</span>
              </div>
              <div class="switch">
                <input
                  type="checkbox"
                  data-config-value="show_rules"
                  .checked=${this._config.show_rules !== false}
                  @change=${this._valueChanged}
                />
                <span class="slider"></span>
              </div>
            </label>
          </div>
        </div>
      </div>
    `;
  }
}
