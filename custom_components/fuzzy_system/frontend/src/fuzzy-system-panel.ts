import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "./utils/custom-element";
import { FuzzySystemConfig, HomeAssistant } from "./types";
import { sharedStyles } from "./styles/shared-styles";

// Import subcomponents
import "./components/system-catalog";
import "./components/system-editor";
import "./components/template-modal";
import "./components/curve-canvas";
import "./components/aggregated-graph";
import "./components/fuzzy-system-card";

@safeCustomElement("fuzzy-system-panel")
export class FuzzySystemPanel extends LitElement {
  static styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--fuzzy-bg);
        color: var(--fuzzy-text);
      }

      .app-header {
        background: rgba(15, 23, 42, 0.8);
        border-bottom: 1px solid var(--fuzzy-card-border);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        position: sticky;
        top: 0;
        z-index: 50;
        padding: 14px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .brand-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
      }

      .brand-title {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .panel-content {
        padding-top: 10px;
        padding-bottom: 60px;
      }
    `,
  ];

  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow = false;
  @property({ type: Object }) public route?: any;
  @property({ type: Object }) public panel?: any;

  @state() private _view: "catalog" | "editor" = "catalog";
  @state() private _selectedConfig?: FuzzySystemConfig;
  @state() private _selectedEntryId?: string;
  @state() private _selectedSource: "yaml" | "config_entry" = "config_entry";

  private _handleCreateSystem() {
    this._selectedConfig = undefined;
    this._selectedEntryId = undefined;
    this._selectedSource = "config_entry";
    this._view = "editor";
  }

  private _handleEditSystem(e: CustomEvent) {
    this._selectedConfig = e.detail.config;
    this._selectedEntryId = e.detail.entryId;
    this._selectedSource = e.detail.source || (e.detail.entryId ? "config_entry" : "yaml");
    this._view = "editor";
  }

  private _handleSystemSaved() {
    this._view = "catalog";
    const catalog = this.shadowRoot?.querySelector("fuzzy-system-catalog") as any;
    if (catalog && typeof catalog.refresh === "function") {
      catalog.refresh();
    }
  }

  render() {
    return html`
      <header class="app-header">
        <div class="brand">
          <div class="brand-icon">⚡</div>
          <div>
            <div class="brand-title">Fuzzy System Control</div>
          </div>
        </div>

        <div class="nav-links">
          <span class="badge badge-cyan">v0.2.0 Phase 2</span>
        </div>
      </header>

      <main class="panel-content container">
        ${this._view === "catalog"
          ? html`
              <fuzzy-system-catalog
                .hass=${this.hass}
                @create-system=${this._handleCreateSystem}
                @edit-system=${this._handleEditSystem}
              ></fuzzy-system-catalog>
            `
          : html`
              <fuzzy-system-editor
                .hass=${this.hass}
                .systemConfig=${this._selectedConfig}
                .entryId=${this._selectedEntryId}
                .source=${this._selectedSource}
                @back=${() => (this._view = "catalog")}
                @system-saved=${this._handleSystemSaved}
              ></fuzzy-system-editor>
            `}
      </main>
    `;
  }
}
