import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../utils/custom-element";
import { HomeAssistant, SystemSummary } from "../types";
import { deleteSystem, fetchSystems } from "../api/websocket";
import { sharedStyles } from "../styles/shared-styles";
import "./aggregated-graph";

@safeCustomElement("fuzzy-system-catalog")
export class FuzzySystemCatalog extends LitElement {
  static styles = [
    sharedStyles,
    css`
      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
      }

      .actions-group {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .search-box {
        max-width: 320px;
        position: relative;
      }

      .systems-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
        gap: 20px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .card-title {
        font-size: 18px;
        font-weight: 700;
        color: var(--fuzzy-text);
      }

      .card-id {
        font-size: 12px;
        color: var(--fuzzy-text-secondary);
        font-family: monospace;
      }

      .card-badges {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }

      .card-metrics {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 18px;
        padding-top: 10px;
        border-top: 1px solid var(--fuzzy-card-border);
      }

      .card-live-outputs {
        background: rgba(15, 23, 42, 0.45);
        border: 1px solid var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-md);
        padding: 12px 14px;
        margin: 12px 0;
      }

      .live-outputs-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        flex-wrap: wrap;
        gap: 6px;
      }

      .live-outputs-title {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--fuzzy-text-secondary);
      }

      .live-outputs-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .output-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s ease;
        background: transparent;
        color: var(--fuzzy-text);
      }

      .output-badge.live-active {
        background: rgba(16, 185, 129, 0.12);
        border-color: rgba(16, 185, 129, 0.35);
        color: #34d399;
      }

      .output-badge.live-active:hover {
        background: rgba(16, 185, 129, 0.22);
        border-color: rgba(16, 185, 129, 0.6);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
      }

      .output-badge.live-idle {
        background: rgba(255, 255, 255, 0.04);
        border-color: var(--fuzzy-card-border);
        color: var(--fuzzy-text-secondary);
        cursor: default;
      }

      .output-name {
        font-weight: 600;
        color: var(--fuzzy-text);
      }

      .output-value {
        font-weight: 700;
      }

      .dominant-term {
        font-size: 11px;
        opacity: 0.85;
        font-style: italic;
      }

      .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
        display: inline-block;
        animation: pulse 2s infinite;
      }

      .idle-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #64748b;
        display: inline-block;
      }

      @keyframes pulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
      }

      .card-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        background: var(--fuzzy-card-bg);
        border: 1px dashed var(--fuzzy-card-border);
        border-radius: var(--fuzzy-radius-lg);
      }
    `,
  ];

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _systems: SystemSummary[] = [];
  @state() private _searchQuery = "";
  @state() private _loading = false;
  @state() private _error = "";
  @state() private _showTemplateModal = false;
  @state() private _expandedWaveforms: Record<string, boolean> = {};

  private _toggleWaveform(systemId: string, outputKey: string) {
    const key = `${systemId}_${outputKey}`;
    this._expandedWaveforms = {
      ...this._expandedWaveforms,
      [key]: !this._expandedWaveforms[key],
    };
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.hass) {
      await this.refresh();
    }
  }

  willUpdate(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has("hass") && this.hass && this._systems.length === 0 && !this._loading) {
      this.refresh();
    }
  }

  public async refresh() {
    if (!this.hass) return;
    this._loading = true;
    this._error = "";
    try {
      this._systems = await fetchSystems(this.hass);
    } catch (err: any) {
      this._error = err.message || "Failed to load fuzzy systems";
    } finally {
      this._loading = false;
    }
  }

  private _filteredSystems() {
    if (!this._searchQuery.trim()) return this._systems;
    const q = this._searchQuery.toLowerCase();
    return this._systems.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.system_id.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  private _handleCreateBlank() {
    this.dispatchEvent(
      new CustomEvent("create-system", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleEdit(system: SystemSummary) {
    this.dispatchEvent(
      new CustomEvent("edit-system", {
        detail: { systemId: system.system_id, entryId: system.entry_id, config: system.config },
        bubbles: true,
        composed: true,
      })
    );
  }

  private async _handleDelete(system: SystemSummary) {
    if (!system.entry_id) return;
    if (!confirm(`Are you sure you want to delete '${system.name}'?`)) return;

    try {
      await deleteSystem(this.hass, system.entry_id);
      await this.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete system");
    }
  }

  private _findOutputSensor(
    systemId: string,
    outputKey: string
  ): { entityId: string; stateObj: any } | null {
    if (!this.hass?.states) return null;
    const sId = systemId.toLowerCase();
    const oKey = outputKey.toLowerCase();

    // Common entity ID patterns
    const candidates = [
      `sensor.fuzzy_${sId}_${oKey}`,
      `sensor.${sId}_${oKey}`,
      `sensor.fuzzy_${oKey}`,
    ];

    for (const id of candidates) {
      if (this.hass.states[id]) {
        return { entityId: id, stateObj: this.hass.states[id] };
      }
    }

    // Fallback: search states by system attribute or substring
    for (const [entityId, stateObj] of Object.entries(this.hass.states)) {
      if (!entityId.startsWith("sensor.")) continue;
      if (entityId.endsWith("_set") || entityId.endsWith("_status")) continue;

      const attrs = stateObj.attributes || {};
      if (
        attrs.system === systemId &&
        (entityId.endsWith(`_${oKey}`) || entityId.includes(oKey))
      ) {
        return { entityId, stateObj };
      }
    }

    return null;
  }

  private _getInputsStatus(sys: SystemSummary): { total: number; bound: number } {
    const inputs = sys.config?.inputs || {};
    const total = Object.keys(inputs).length;
    let bound = 0;
    for (const inp of Object.values(inputs)) {
      if (inp.entity_id && inp.entity_id.trim()) {
        bound++;
      }
    }
    return { total, bound };
  }

  private _openMoreInfo(entityId: string, e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _renderLiveOutputs(sys: SystemSummary) {
    const outputs = sys.config?.outputs || {};
    const outputKeys = Object.keys(outputs);
    if (outputKeys.length === 0) return html``;

    const inputStatus = this._getInputsStatus(sys);

    return html`
      <div class="card-live-outputs">
        <div class="live-outputs-header">
          <span class="live-outputs-title">Live Runtime Outputs</span>
          ${inputStatus.total > 0 && inputStatus.bound < inputStatus.total
            ? html`
                <span
                  class="chip"
                  style="color: #fbbf24; background: rgba(245, 158, 11, 0.1); font-size: 11px;"
                  title="Some input antecedents do not have live sensor entities bound yet"
                >
                  ⚠️ ${inputStatus.total - inputStatus.bound} unbound input${inputStatus.total - inputStatus.bound > 1 ? "s" : ""}
                </span>
              `
            : html`
                <span
                  class="chip"
                  style="color: #34d399; background: rgba(52, 211, 153, 0.1); font-size: 11px;"
                  title="Inputs bound to live sensors; rules actively evaluating"
                >
                  🟢 Reactive
                </span>
              `}
        </div>

        <div class="live-outputs-list">
          ${outputKeys.map((outKey) => {
            const outSensor = this._findOutputSensor(sys.system_id, outKey);
            const outCfg = outputs[outKey] || {};
            const unit =
              outSensor?.stateObj?.attributes?.unit_of_measurement ||
              outCfg.unit_of_measurement ||
              "";
            const dominantTerm = outSensor?.stateObj?.attributes?.dominant_term;
            const stateVal = outSensor?.stateObj?.state;
            const isValidNumber =
              stateVal !== undefined &&
              stateVal !== "unknown" &&
              stateVal !== "unavailable" &&
              !isNaN(parseFloat(stateVal));
            const isExpanded = Boolean(this._expandedWaveforms[`${sys.system_id}_${outKey}`]);

            if (outSensor && isValidNumber) {
              const numDisplay = parseFloat(stateVal).toFixed(1);
              return html`
                <div style="display: inline-flex; align-items: center; gap: 4px;">
                  <button
                    class="output-badge live-active"
                    @click=${(e: Event) => this._openMoreInfo(outSensor.entityId, e)}
                    title="Entity: ${outSensor.entityId} — Click to view Home Assistant history graph and diagnostic attributes"
                  >
                    <span class="pulse-dot"></span>
                    <span class="output-name">${outKey}:</span>
                    <span class="output-value">${numDisplay}${unit ? ` ${unit}` : ""}</span>
                    ${dominantTerm
                      ? html`<span class="dominant-term">(${dominantTerm})</span>`
                      : ""}
                  </button>
                  <button
                    class="btn btn-secondary"
                    style="padding: 2px 7px; font-size: 11px; border-radius: 9999px; height: 26px; line-height: 1;"
                    title="${isExpanded ? "Hide live waveform graph" : "View live aggregated fuzzy set waveform"}"
                    @click=${(e: Event) => {
                      e.stopPropagation();
                      this._toggleWaveform(sys.system_id, outKey);
                    }}
                  >
                    📈 ${isExpanded ? "Hide" : "Graph"}
                  </button>
                </div>
              `;
            }

            return html`
              <div
                class="output-badge live-idle"
                title="${outSensor ? `Entity: ${outSensor.entityId} (State: ${stateVal})` : `Sensor entity not yet registered in Home Assistant`}"
              >
                <span class="idle-dot"></span>
                <span class="output-name">${outKey}:</span>
                <span class="output-value" style="color: var(--fuzzy-text-secondary);">
                  ${stateVal === "unavailable" ? "Unavailable" : "Awaiting inputs"}
                </span>
              </div>
            `;
          })}
        </div>

        ${outputKeys.map((outKey) => {
          if (!this._expandedWaveforms[`${sys.system_id}_${outKey}`]) return "";
          const outSensor = this._findOutputSensor(sys.system_id, outKey);
          const outCfg = outputs[outKey] || {};
          const unit =
            outSensor?.stateObj?.attributes?.unit_of_measurement ||
            outCfg.unit_of_measurement ||
            "";
          const universe = outSensor?.stateObj?.attributes?.universe || [];
          const aggregatedSet = outSensor?.stateObj?.attributes?.aggregated_set || [];
          const stateVal = outSensor?.stateObj?.state;
          const isValidNumber = stateVal !== undefined && !isNaN(parseFloat(stateVal));
          const dominantTerm = outSensor?.stateObj?.attributes?.dominant_term || "";

          return html`
            <div style="margin-top: 12px;">
              <fuzzy-aggregated-graph
                .universe=${universe}
                .aggregatedSet=${aggregatedSet}
                .defuzzifiedValue=${isValidNumber ? parseFloat(stateVal) : undefined}
                .defuzzifier=${sys.defuzzifier}
                .dominantTerm=${dominantTerm}
                .unit=${unit}
                .outputName=${outKey}
              ></fuzzy-aggregated-graph>
            </div>
          `;
        })}
      </div>
    `;
  }

  render() {
    const list = this._filteredSystems();

    return html`
      <div class="header-row">
        <div>
          <h1 class="title-lg">Fuzzy Logic Controllers</h1>
          <p class="subtitle">Declarative linguistic rule engines with Mamdani and Sugeno inference</p>
        </div>

        <div class="actions-group">
          <input
            class="input-text search-box"
            type="text"
            placeholder="Search systems..."
            .value=${this._searchQuery}
            @input=${(e: any) => (this._searchQuery = e.target.value)}
          />
          <button class="btn btn-secondary" @click=${() => (this._showTemplateModal = true)}>
            ⚡ Templates
          </button>
          <button class="btn btn-primary" @click=${this._handleCreateBlank}>
            + Create System
          </button>
        </div>
      </div>

      ${this._error ? html`<div style="color: var(--fuzzy-danger); margin-bottom: 16px;">${this._error}</div>` : ""}

      ${list.length === 0 && !this._loading
        ? html`
            <div class="empty-state">
              <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">No Fuzzy Systems Found</h3>
              <p class="subtitle" style="margin-bottom: 20px;">
                ${this._searchQuery ? "No controllers match your search." : "Get started by using a starter template or creating a blank controller."}
              </p>
              <button class="btn btn-primary" @click=${() => (this._showTemplateModal = true)}>
                Browse Starter Templates
              </button>
            </div>
          `
        : html`
            <div class="systems-grid">
              ${list.map(
                (sys) => html`
                  <div class="card">
                    <div class="card-header">
                      <div>
                        <div class="card-title">${sys.name}</div>
                        <div class="card-id">${sys.system_id}</div>
                      </div>
                      <span class="badge ${sys.source === "yaml" ? "badge-purple" : "badge-emerald"}">
                        ${sys.source === "yaml" ? "YAML" : "UI"}
                      </span>
                    </div>

                    ${sys.description ? html`<p class="subtitle" style="margin-bottom: 12px;">${sys.description}</p>` : ""}

                    <div class="card-badges">
                      <span class="badge ${sys.inference === "sugeno" ? "badge-amber" : "badge-cyan"}">
                        ${sys.inference}
                      </span>
                      <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--fuzzy-text-secondary);">
                        ${sys.defuzzifier}
                      </span>
                      ${sys.max_updates_per_period
                        ? html`<span class="badge" style="background: rgba(16,185,129,0.1); color: #34d399;" title="Rate limiter budget">
                            ⏱️ ${sys.max_updates_per_period} / ${sys.update_period}s
                          </span>`
                        : ""}
                    </div>

                    ${this._renderLiveOutputs(sys)}

                    <div class="card-metrics">
                      <span class="chip">${sys.input_count} inputs</span>
                      <span class="chip">${sys.output_count} outputs</span>
                      <span class="chip">${sys.rule_count} rules</span>
                      ${sys.epsilon !== undefined ? html`<span class="chip">ε = ${sys.epsilon}</span>` : ""}
                    </div>

                    <div class="card-actions">
                      <button class="btn btn-secondary" @click=${() => this._handleEdit(sys)}>
                        ${sys.source === "yaml" ? "Inspect" : "Edit"}
                      </button>
                      ${sys.source === "config_entry"
                        ? html`
                            <button class="btn btn-danger" @click=${() => this._handleDelete(sys)}>
                              Delete
                            </button>
                          `
                        : ""}
                    </div>
                  </div>
                `
              )}
            </div>
          `}

      ${this._showTemplateModal
        ? html`
            <fuzzy-template-modal
              .hass=${this.hass}
              @close=${() => (this._showTemplateModal = false)}
              @template-instantiated=${(e: any) => {
                this._showTemplateModal = false;
                this.dispatchEvent(
                  new CustomEvent("edit-system", {
                    detail: { config: e.detail.system },
                    bubbles: true,
                    composed: true,
                  })
                );
              }}
            ></fuzzy-template-modal>
          `
        : ""}
    `;
  }
}
