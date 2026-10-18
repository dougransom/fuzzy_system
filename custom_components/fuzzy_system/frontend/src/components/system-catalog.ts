import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { HomeAssistant, SystemSummary } from "../types";
import { deleteSystem, fetchSystems } from "../api/websocket";
import { sharedStyles } from "../styles/shared-styles";

@customElement("fuzzy-system-catalog")
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
