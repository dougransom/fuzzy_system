import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../utils/custom-element";
import { HomeAssistant, TemplateSummary } from "../types";
import { fetchTemplates, instantiateTemplate } from "../api/websocket";
import { sharedStyles } from "../styles/shared-styles";

@safeCustomElement("fuzzy-template-modal")
export class FuzzyTemplateModal extends LitElement {
  static styles = [
    sharedStyles,
    css`
      .template-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        margin-top: 18px;
        margin-bottom: 24px;
      }

      .template-card {
        background: var(--secondary-background-color, rgba(125, 125, 125, 0.06));
        border: 1px solid var(--divider-color, rgba(125, 125, 125, 0.22));
        border-radius: var(--fuzzy-radius-md);
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .template-card:hover {
        border-color: var(--fuzzy-primary);
        background: rgba(2, 132, 199, 0.08);
        transform: translateY(-2px);
      }

      .template-card.selected {
        border-color: var(--fuzzy-primary);
        background: rgba(2, 132, 199, 0.15);
        box-shadow: 0 0 0 2px var(--fuzzy-primary);
      }

      .template-title {
        font-weight: 600;
        font-size: 15px;
        color: var(--fuzzy-text);
        margin-bottom: 6px;
      }

      .template-desc {
        font-size: 12px;
        color: var(--fuzzy-text-secondary);
        line-height: 1.4;
        margin-bottom: 12px;
      }

      .template-meta {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
    `,
  ];

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _templates: TemplateSummary[] = [];
  @state() private _selectedTemplate: TemplateSummary | null = null;
  @state() private _systemId = "";
  @state() private _systemName = "";
  @state() private _loading = false;
  @state() private _error = "";

  async connectedCallback() {
    super.connectedCallback();
    if (this.hass) {
      await this._loadTemplates();
    }
  }

  willUpdate(changedProps: Map<string | number | symbol, unknown>) {
    if (changedProps.has("hass") && this.hass && this._templates.length === 0 && !this._loading) {
      this._loadTemplates();
    }
  }

  private async _loadTemplates() {
    if (!this.hass) return;
    this._loading = true;
    try {
      this._templates = await fetchTemplates(this.hass);
    } catch (err: any) {
      this._error = err.message || "Failed to load templates";
    } finally {
      this._loading = false;
    }
  }

  private _selectTemplate(template: TemplateSummary) {
    this._selectedTemplate = template;
    this._systemId = template.id;
    this._systemName = template.name;
    this._error = "";
  }

  private async _handleInstantiate() {
    if (!this._selectedTemplate) return;
    const cleanId = this._systemId.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!cleanId) {
      this._error = "Please provide a valid system identifier";
      return;
    }

    this._loading = true;
    this._error = "";
    try {
      const res = await instantiateTemplate(
        this.hass,
        this._selectedTemplate.id,
        cleanId,
        this._systemName.trim() || undefined
      );
      this.dispatchEvent(
        new CustomEvent("template-instantiated", {
          detail: { system: res.system },
          bubbles: true,
          composed: true,
        })
      );
    } catch (err: any) {
      this._error = err.message || "Failed to instantiate template";
    } finally {
      this._loading = false;
    }
  }

  private _close() {
    this.dispatchEvent(new CustomEvent("close", { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="modal-overlay" @click=${(e: Event) => e.target === e.currentTarget && this._close()}>
        <div class="modal-content">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div>
              <h2 class="title-lg">Choose a Template</h2>
              <p class="subtitle">Quickly scaffold a pre-engineered fuzzy logic controller</p>
            </div>
            <button class="btn btn-icon" @click=${this._close}>✕</button>
          </div>

          ${this._error ? html`<div style="color: var(--fuzzy-danger); font-size: 13px; margin-bottom: 12px;">${this._error}</div>` : ""}

          <div class="template-grid">
            ${this._templates.map(
              (tmpl) => html`
                <div
                  class="template-card ${this._selectedTemplate?.id === tmpl.id ? "selected" : ""}"
                  @click=${() => this._selectTemplate(tmpl)}
                >
                  <div class="template-title">${tmpl.name}</div>
                  <div class="template-desc">${tmpl.description}</div>
                  <div class="template-meta">
                    <span class="badge ${tmpl.inference === "sugeno" ? "badge-amber" : "badge-cyan"}">
                      ${tmpl.inference}
                    </span>
                    <span class="chip">${tmpl.input_count} in</span>
                    <span class="chip">${tmpl.output_count} out</span>
                    <span class="chip">${tmpl.rule_count} rules</span>
                  </div>
                </div>
              `
            )}
          </div>

          ${this._selectedTemplate
            ? html`
                <div style="border-top: 1px solid var(--fuzzy-card-border); padding-top: 18px; margin-bottom: 18px;">
                  <div class="form-group">
                    <label class="form-label">System Identifier (slug)</label>
                    <input
                      class="input-text"
                      type="text"
                      .value=${this._systemId}
                      @input=${(e: any) => (this._systemId = e.target.value)}
                      placeholder="e.g. living_room_comfort"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Friendly Name</label>
                    <input
                      class="input-text"
                      type="text"
                      .value=${this._systemName}
                      @input=${(e: any) => (this._systemName = e.target.value)}
                      placeholder="e.g. Living Room Comfort"
                    />
                  </div>
                </div>
              `
            : ""}

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn btn-secondary" @click=${this._close}>Cancel</button>
            <button
              class="btn btn-primary"
              ?disabled=${!this._selectedTemplate || this._loading}
              @click=${this._handleInstantiate}
            >
              ${this._loading ? "Instantiating..." : "Use Template"}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
