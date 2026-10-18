import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../utils/custom-element";
import { HomeAssistant } from "../types";
import "./aggregated-graph";

// Register custom card in Home Assistant's card picker
(window as any).customCards = (window as any).customCards || [];
if (!(window as any).customCards.some((c: any) => c.type === "fuzzy-system-card")) {
  (window as any).customCards.push({
    type: "fuzzy-system-card",
    name: "Fuzzy System Controller",
    description: "Display live fuzzy logic controller status, inputs, and real-time aggregated output distributions.",
    preview: true,
    documentationURL: "https://github.com/dougransom/fuzzy_system",
  });
}

@safeCustomElement("fuzzy-system-card")
export class FuzzySystemCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      background: var(--ha-card-background, var(--card-background-color, #1e293b));
      border: 1px solid var(--ha-card-border-color, rgba(255, 255, 255, 0.08));
      border-radius: var(--ha-card-border-radius, 16px);
      box-shadow: var(--ha-card-box-shadow, 0 4px 20px rgba(0, 0, 0, 0.25));
      padding: 18px 20px;
      color: var(--primary-text-color, #f8fafc);
      font-family: var(--ha-font-family, sans-serif);
      box-sizing: border-box;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }

    .title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .card-title {
      font-size: 16px;
      font-weight: 700;
    }

    .card-subtitle {
      font-size: 12px;
      color: var(--secondary-text-color, #94a3b8);
      font-family: monospace;
    }

    .badge-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color, #94a3b8);
      margin-top: 14px;
      margin-bottom: 8px;
    }

    .inputs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 8px;
      margin-bottom: 12px;
    }

    .metric-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-label {
      font-size: 11px;
      color: var(--secondary-text-color, #94a3b8);
    }

    .metric-val {
      font-size: 14px;
      font-weight: 700;
      color: #38bdf8;
    }

    .rule-bar-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 12px;
    }

    .rule-progress-bg {
      flex: 1;
      height: 6px;
      background: rgba(255, 255, 255, 0.06);
      border-radius: 3px;
      overflow: hidden;
    }

    .rule-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #0284c7, #38bdf8);
      border-radius: 3px;
      transition: width 0.3s ease;
    }
  `;

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config: any = {};

  setConfig(config: any) {
    if (!config.system_id) {
      throw new Error("Please define a 'system_id' for fuzzy-system-card (e.g. system_id: 'climate_controller').");
    }
    this._config = config;
  }

  getCardSize() {
    return 4;
  }

  private _findSensors() {
    if (!this.hass?.states || !this._config.system_id) return { outputs: [], status: null };

    const sysId = this._config.system_id.toLowerCase();
    const outputs: Array<{ entityId: string; stateObj: any }> = [];
    let status: any = null;

    for (const [entityId, stateObj] of Object.entries(this.hass.states)) {
      if (!entityId.startsWith("sensor.")) continue;

      if (entityId === `sensor.fuzzy_${sysId}_status`) {
        status = stateObj;
        continue;
      }

      if (
        (entityId.startsWith(`sensor.fuzzy_${sysId}_`) || stateObj.attributes?.system === this._config.system_id) &&
        !entityId.endsWith("_set") &&
        !entityId.endsWith("_status")
      ) {
        outputs.push({ entityId, stateObj });
      }
    }

    return { outputs, status };
  }

  render() {
    if (!this.hass || !this._config.system_id) {
      return html`<ha-card><p style="padding: 16px;">Configuring fuzzy-system-card...</p></ha-card>`;
    }

    const { outputs } = this._findSensors();
    const sysId = this._config.system_id;
    const title = this._config.title || `Fuzzy System: ${sysId}`;

    // Grab first output sensor for aggregated set
    const primaryOut = outputs[0];
    const attrs = primaryOut?.stateObj?.attributes || {};
    const universe = attrs.universe || [];
    const aggregatedSet = attrs.aggregated_set || [];
    const defuzzVal = primaryOut?.stateObj?.state ? parseFloat(primaryOut.stateObj.state) : undefined;
    const unit = attrs.unit_of_measurement || "";
    const defuzzMethod = attrs.defuzzifier || "cog";
    const dominantTerm = attrs.dominant_term || "";
    const inputsMap: Record<string, number> = attrs.inputs || {};
    const ruleStrengths: Array<{ rule: string; firing_strength: number }> = attrs.rule_strengths || [];

    return html`
      <ha-card>
        <div class="card-header">
          <div class="title-group">
            <div class="card-icon">⚡</div>
            <div>
              <div class="card-title">${title}</div>
              <div class="card-subtitle">${sysId}</div>
            </div>
          </div>
          <div class="badge-status">
            <span class="pulse-dot"></span>
            <span>Active</span>
          </div>
        </div>

        ${Object.keys(inputsMap).length > 0
          ? html`
              <div class="section-title">Live Inputs</div>
              <div class="inputs-grid">
                ${Object.entries(inputsMap).map(
                  ([varName, val]) => html`
                    <div class="metric-pill">
                      <span class="metric-label">${varName}</span>
                      <span class="metric-val">${typeof val === "number" ? val.toFixed(1) : val}</span>
                    </div>
                  `
                )}
              </div>
            `
          : ""}

        ${universe.length > 0
          ? html`
              <div class="section-title">Live Aggregated Output Set</div>
              <fuzzy-aggregated-graph
                .universe=${universe}
                .aggregatedSet=${aggregatedSet}
                .defuzzifiedValue=${defuzzVal}
                .defuzzifier=${defuzzMethod}
                .dominantTerm=${dominantTerm}
                .unit=${unit}
                .outputName=${primaryOut.entityId.replace(`sensor.fuzzy_${sysId}_`, "")}
              ></fuzzy-aggregated-graph>
            `
          : html`
              <div class="section-title">Outputs</div>
              ${outputs.map(
                (out) => html`
                  <div class="metric-pill" style="margin-bottom: 6px;">
                    <span class="metric-label">${out.entityId}</span>
                    <span class="metric-val">${out.stateObj.state} ${out.stateObj.attributes?.unit_of_measurement || ""}</span>
                  </div>
                `
              )}
            `}

        ${ruleStrengths.length > 0
          ? html`
              <div class="section-title">Active Rule Firing Strengths</div>
              ${ruleStrengths.slice(0, 4).map(
                (r, idx) => html`
                  <div class="rule-bar-row">
                    <span style="font-size: 11px; width: 45px; color: var(--secondary-text-color);">R${idx + 1}</span>
                    <div class="rule-progress-bg">
                      <div class="rule-progress-fill" style="width: ${(r.firing_strength * 100).toFixed(0)}%;"></div>
                    </div>
                    <span style="font-size: 11px; width: 35px; text-align: right; font-weight: 700; color: #38bdf8;">
                      ${r.firing_strength.toFixed(2)}
                    </span>
                  </div>
                `
              )}
            `
          : ""}
      </ha-card>
    `;
  }
}
