import { LitElement, html, css, svg } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../utils/custom-element";

@safeCustomElement("fuzzy-aggregated-graph")
export class FuzzyAggregatedGraph extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      user-select: none;
    }

    .graph-card {
      background: #060913;
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 12px;
      padding: 14px 16px 12px;
      box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(2, 132, 199, 0.15);
    }

    .graph-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .graph-title {
      font-size: 13px;
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .header-badges {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .badge-crisp {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .badge-dominant {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
    }

    svg {
      width: 100%;
      height: auto;
      display: block;
      overflow: visible;
    }

    .axis-line {
      stroke: rgba(255, 255, 255, 0.15);
      stroke-width: 1;
    }

    .grid-line {
      stroke: rgba(255, 255, 255, 0.05);
      stroke-dasharray: 2 3;
      stroke-width: 1;
    }

    .axis-text {
      fill: #94a3b8;
      font-size: 10px;
      font-family: monospace;
    }

    .defuzz-line {
      stroke: #38bdf8;
      stroke-width: 2.5;
      filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.8));
    }

    .pulse-marker {
      fill: #38bdf8;
      filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.9));
    }
  `;

  @property({ type: Array }) public universe: number[] = [];
  @property({ type: Array }) public aggregatedSet: number[] = [];
  @property({ type: Number }) public defuzzifiedValue?: number;
  @property({ type: String }) public defuzzifier = "cog";
  @property({ type: String }) public dominantTerm = "";
  @property({ type: String }) public unit = "";
  @property({ type: String }) public outputName = "";

  render() {
    if (!this.universe || this.universe.length === 0) {
      return html`
        <div class="graph-card">
          <div style="text-align: center; color: var(--fuzzy-text-secondary); padding: 20px 0; font-size: 12px;">
            Awaiting inference evaluation data...
          </div>
        </div>
      `;
    }

    const uMin = this.universe[0];
    const uMax = this.universe[this.universe.length - 1];
    const uSpan = uMax - uMin || 1;

    // Viewbox layout dimensions
    const width = 640;
    const height = 190;
    const padL = 36;
    const padR = 24;
    const padT = 20;
    const padB = 28;

    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const toSvgX = (val: number) => padL + ((val - uMin) / uSpan) * plotW;
    const toSvgY = (mu: number) => padT + (1 - Math.max(0, Math.min(1, mu))) * plotH;

    // Build SVG path for aggregated fuzzy distribution
    const agg = this.aggregatedSet || [];
    const pts: Array<[number, number]> = [];
    const step = Math.max(1, Math.floor(this.universe.length / 140));

    for (let i = 0; i < this.universe.length; i += step) {
      const uVal = this.universe[i];
      const muVal = agg[i] ?? 0;
      pts.push([toSvgX(uVal), toSvgY(muVal)]);
    }

    // Ensure last point included
    const lastIdx = this.universe.length - 1;
    pts.push([toSvgX(this.universe[lastIdx]), toSvgY(agg[lastIdx] ?? 0)]);

    const pathD = pts.reduce(
      (acc, [px, py], i) => (i === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`),
      ""
    );
    const fillD = `${pathD} L ${padL + plotW} ${padT + plotH} L ${padL} ${padT + plotH} Z`;

    const hasCrisp = this.defuzzifiedValue !== undefined && !isNaN(this.defuzzifiedValue);
    const crispX = hasCrisp ? toSvgX(Math.max(uMin, Math.min(uMax, this.defuzzifiedValue!))) : 0;

    return html`
      <div class="graph-card">
        <div class="graph-header">
          <div class="graph-title">
            <span>📈</span>
            <span>${this.outputName || "Aggregated Output Distribution"}</span>
          </div>
          <div class="header-badges">
            ${this.dominantTerm
              ? html`<span class="badge-dominant">Dominant: ${this.dominantTerm}</span>`
              : ""}
            ${hasCrisp
              ? html`
                  <span class="badge-crisp">
                    ${this.defuzzifier.toUpperCase()}: ${this.defuzzifiedValue!.toFixed(2)} ${this.unit}
                  </span>
                `
              : ""}
          </div>
        </div>

        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="aggGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.55" />
              <stop offset="60%" stop-color="#0284c7" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#0f172a" stop-opacity="0.05" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid lines at mu = 0.5, 1.0 -->
          <line class="grid-line" x1=${padL} y1=${toSvgY(0.5)} x2=${padL + plotW} y2=${toSvgY(0.5)} />
          <line class="grid-line" x1=${padL} y1=${toSvgY(1.0)} x2=${padL + plotW} y2=${toSvgY(1.0)} />

          <!-- Axes -->
          <line class="axis-line" x1=${padL} y1=${padT} x2=${padL} y2=${padT + plotH} />
          <line class="axis-line" x1=${padL} y1=${padT + plotH} x2=${padL + plotW} y2=${padT + plotH} />

          <!-- Y-axis labels -->
          <text class="axis-text" x=${padL - 6} y=${toSvgY(1.0) + 3} text-anchor="end">1.0</text>
          <text class="axis-text" x=${padL - 6} y=${toSvgY(0.5) + 3} text-anchor="end">0.5</text>
          <text class="axis-text" x=${padL - 6} y=${toSvgY(0.0) + 3} text-anchor="end">0.0</text>

          <!-- X-axis labels -->
          <text class="axis-text" x=${padL} y=${height - 10} text-anchor="start">${uMin.toFixed(0)}</text>
          <text class="axis-text" x=${padL + plotW / 2} y=${height - 10} text-anchor="middle">
            ${(uMin + uSpan / 2).toFixed(1)}
          </text>
          <text class="axis-text" x=${padL + plotW} y=${height - 10} text-anchor="end">
            ${uMax.toFixed(0)} ${this.unit}
          </text>

          <!-- Aggregated Fuzzy Set Area & Stroke -->
          <path d=${fillD} fill="url(#aggGradient)" />
          <path d=${pathD} fill="none" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" />

          <!-- Defuzzified Crisp Slice Line -->
          ${hasCrisp
            ? svg`
                <g>
                  <line
                    class="defuzz-line"
                    x1=${crispX}
                    y1=${padT}
                    x2=${crispX}
                    y2=${padT + plotH}
                  />
                  <circle class="pulse-marker" cx=${crispX} cy=${padT + plotH} r="4.5" />
                  <rect
                    x=${Math.min(padL + plotW - 90, Math.max(padL, crispX - 45))}
                    y=${padT - 18}
                    width="90"
                    height="18"
                    rx="4"
                    fill="#0284c7"
                  />
                  <text
                    x=${Math.min(padL + plotW - 45, Math.max(padL + 45, crispX))}
                    y=${padT - 5}
                    text-anchor="middle"
                    fill="#ffffff"
                    font-size="10"
                    font-weight="700"
                    font-family="monospace"
                  >
                    ${this.defuzzifiedValue!.toFixed(1)} ${this.unit}
                  </text>
                </g>
              `
            : svg``}
        </svg>
      </div>
    `;
  }
}
