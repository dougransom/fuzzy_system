import { LitElement, html, css, svg } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../utils/custom-element";
import { TermConfig } from "../types";

export function evalMembership(type: string, params: number[], x: number, span: number): number {
  switch (type.toLowerCase()) {
    case "trimf": {
      const [a, b, c] = params;
      if (x <= a || x >= c) return 0;
      if (x === b) return 1;
      if (x < b) return (x - a) / (b - a || 1e-6);
      return (c - x) / (c - b || 1e-6);
    }
    case "trapmf": {
      const [a, b, c, d] = params;
      if (x <= a || x >= d) return 0;
      if (x >= b && x <= c) return 1;
      if (x < b) return (x - a) / (b - a || 1e-6);
      return (d - x) / (d - c || 1e-6);
    }
    case "gaussmf": {
      const [mean, sigma] = params;
      const s = sigma || 1.0;
      return Math.exp(-0.5 * Math.pow((x - mean) / s, 2));
    }
    case "sigmf": {
      const [b, c] = params;
      return 1 / (1 + Math.exp(-b * (x - c)));
    }
    case "gbellmf": {
      const [a, b, c] = params;
      return 1 / (1 + Math.pow(Math.abs((x - c) / (a || 1e-6)), 2 * (b || 1)));
    }
    case "singleton":
    case "constant": {
      const [c] = params;
      const tol = (span || 100) * 0.015;
      return Math.abs(x - c) <= tol ? 1 : 0;
    }
    default:
      return 0;
  }
}

const TERM_COLORS = [
  { stroke: "#38bdf8", fill: "rgba(56, 189, 248, 0.15)" },   // cyan
  { stroke: "#34d399", fill: "rgba(52, 211, 153, 0.15)" },   // emerald
  { stroke: "#fbbf24", fill: "rgba(251, 191, 36, 0.15)" },   // amber
  { stroke: "#c084fc", fill: "rgba(192, 132, 252, 0.15)" },  // purple
  { stroke: "#fb7185", fill: "rgba(251, 113, 133, 0.15)" },  // rose
  { stroke: "#60a5fa", fill: "rgba(96, 165, 250, 0.15)" },   // blue
  { stroke: "#a3e635", fill: "rgba(163, 230, 53, 0.15)" },   // lime
];

@safeCustomElement("fuzzy-curve-canvas")
export class FuzzyCurveCanvas extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      user-select: none;
    }

    .canvas-container {
      background: #090d16;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px 14px 10px;
      box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
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

    .curve-path {
      stroke-width: 2.2;
      stroke-linejoin: round;
      stroke-linecap: round;
      transition: all 0.2s ease;
    }

    .curve-fill {
      transition: all 0.2s ease;
    }

    .current-val-line {
      stroke: #f43f5e;
      stroke-width: 2;
      stroke-dasharray: 4 3;
    }

    .legend-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 600;
    }

    .legend-swatch {
      width: 10px;
      height: 10px;
      border-radius: 3px;
    }
  `;

  @property({ type: Array }) public range: [number, number] = [0, 100];
  @property({ type: Object }) public terms: Record<string, TermConfig> = {};
  @property({ type: Number }) public currentValue?: number;
  @property({ type: String }) public unit?: string;

  render() {
    const min = Number.isFinite(this.range[0]) ? this.range[0] : 0;
    const max = Number.isFinite(this.range[1]) && this.range[1] > min ? this.range[1] : min + 100;
    const span = max - min || 1;

    // Viewbox layout dimensions
    const width = 600;
    const height = 180;
    const padL = 36;
    const padR = 24;
    const padT = 16;
    const padB = 28;

    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    const toSvgX = (val: number) => padL + ((val - min) / span) * plotW;
    const toSvgY = (mu: number) => padT + (1 - Math.max(0, Math.min(1, mu))) * plotH;

    const termKeys = Object.keys(this.terms || {});
    const numPoints = 120;

    return html`
      <div class="canvas-container">
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
          <!-- Horizontal Grid lines at mu = 0.0, 0.5, 1.0 -->
          <line class="grid-line" x1=${padL} y1=${toSvgY(0.5)} x2=${padL + plotW} y2=${toSvgY(0.5)} />
          <line class="grid-line" x1=${padL} y1=${toSvgY(1.0)} x2=${padL + plotW} y2=${toSvgY(1.0)} />

          <!-- Axes -->
          <line class="axis-line" x1=${padL} y1=${padT} x2=${padL} y2=${padT + plotH} />
          <line class="axis-line" x1=${padL} y1=${padT + plotH} x2=${padL + plotW} y2=${padT + plotH} />

          <!-- Y-axis tick labels -->
          <text class="axis-text" x=${padL - 6} y=${toSvgY(1.0) + 3} text-anchor="end">1.0</text>
          <text class="axis-text" x=${padL - 6} y=${toSvgY(0.5) + 3} text-anchor="end">0.5</text>
          <text class="axis-text" x=${padL - 6} y=${toSvgY(0.0) + 3} text-anchor="end">0.0</text>

          <!-- X-axis tick labels -->
          <text class="axis-text" x=${padL} y=${height - 10} text-anchor="start">${min}</text>
          <text class="axis-text" x=${padL + plotW / 2} y=${height - 10} text-anchor="middle">
            ${(min + span / 2).toFixed(1)}
          </text>
          <text class="axis-text" x=${padL + plotW} y=${height - 10} text-anchor="end">
            ${max} ${this.unit || ""}
          </text>

          <!-- Curves for each membership term -->
          ${termKeys.map((termKey, idx) => {
            const term = this.terms[termKey];
            if (!term || !term.params) return svg``;

            const color = TERM_COLORS[idx % TERM_COLORS.length];
            const pts: Array<[number, number]> = [];

            for (let i = 0; i <= numPoints; i++) {
              const xVal = min + (i / numPoints) * span;
              const mu = evalMembership(term.type, term.params, xVal, span);
              pts.push([toSvgX(xVal), toSvgY(mu)]);
            }

            const pathD = pts.reduce(
              (acc, [px, py], i) => (i === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`),
              ""
            );
            const fillD = `${pathD} L ${padL + plotW} ${padT + plotH} L ${padL} ${padT + plotH} Z`;

            return svg`
              <g>
                <path class="curve-fill" d=${fillD} fill=${color.fill} />
                <path class="curve-path" d=${pathD} fill="none" stroke=${color.stroke} />
              </g>
            `;
          })}

          <!-- Current Value Marker (if provided) -->
          ${this.currentValue !== undefined && !isNaN(this.currentValue)
            ? (() => {
                const markerX = toSvgX(Math.max(min, Math.min(max, this.currentValue)));
                return svg`
                  <g>
                    <line
                      class="current-val-line"
                      x1=${markerX}
                      y1=${padT}
                      x2=${markerX}
                      y2=${padT + plotH}
                    />
                    <circle cx=${markerX} cy=${padT + plotH} r="4" fill="#f43f5e" />
                    <text
                      class="axis-text"
                      x=${markerX}
                      y=${padT - 4}
                      text-anchor="middle"
                      fill="#f43f5e"
                      font-weight="700"
                    >
                      ${this.currentValue.toFixed(1)}${this.unit ? ` ${this.unit}` : ""}
                    </text>
                  </g>
                `;
              })()
            : svg``}
        </svg>

        <!-- Color Legend -->
        <div class="legend-row">
          ${termKeys.map((termKey, idx) => {
            const term = this.terms[termKey];
            const color = TERM_COLORS[idx % TERM_COLORS.length];
            return html`
              <div class="legend-item" style="color: ${color.stroke};">
                <span class="legend-swatch" style="background: ${color.stroke};"></span>
                <span>${termKey}</span>
                <span style="opacity: 0.6; font-size: 10px;">(${term.type})</span>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}
