# Fuzzy System: Open Architecture & Design Questions

This document identifies missing specifications, architectural decisions, and design choices that must be resolved before proceeding with full code implementation.

---

## 1. Storage Architecture & Configuration Persistence
1. **Primary Persistence Engine**:
   - **Resolved**: **Option A (Individual Config Entries)**. Each UI-managed fuzzy system will be represented as its own `config_entries.ConfigEntry`, allowing full native integration with Home Assistant's Helper registry, entity registry, and lifecycle, while being managed visually via the custom panel.
2. **YAML & UI Coexistence & Conflict Resolution**:
   - **Resolved**: **Option A (YAML takes precedence & locks ID)**. Systems defined in YAML take precedence and appear in the UI catalog as read-only with a `YAML (Read-Only)` badge. Creating or saving a UI system with a colliding ID is blocked with an explicit validation error to prevent duplicate entity IDs.
3. **YAML Migration Flow**:
   - **Resolved**: **Option A ("Clone to UI" with Guidance)**. YAML system cards include a "Clone to UI" button that loads the system into the visual editor. If saving with the same ID, a clear modal informs the user to comment out/remove the YAML block in `configuration.yaml` to activate the UI version, or they can save under a new ID immediately.

---

## 2. UI Placement, Navigation & Access Control
4. **Panel vs Options Flow Navigation**:
   - **Resolved**: **Option A (Both Dedicated Sidebar Panel & Settings Shortcut)**. Register a dedicated sidebar panel at `/fuzzy-system` with sidebar icon `mdi:chart-bell-curve-cumulative`. Provide deep-links to `/fuzzy-system?system_id=<id>` from the Config Entry options flow in **Settings > Devices & Services**.
5. **Role-Based Access Control**:
   - **Resolved**: **Option A (Require Administrator)**. The panel and WebSocket modification endpoints enforce `require_admin=True`. Standard non-admin users do not see the panel in their sidebar and cannot access the editor or simulation tools.

---

## 3. Mathematical & Engine Capabilities in the UI
6. **Sugeno Consequent Complexity (Zero-Order vs First-Order)**:
   - **Resolved**: **Option A (Zero-Order Sugeno: Constants & Singletons)**. The visual UI and rule builder will support zero-order Sugeno consequents (predefined singleton terms and numeric constants). This keeps the UI intuitive and covers common automation domains.
7. **Rule Syntax & Compound Expression Parsing**:
   - **Resolved**: **Option A (DNF: OR of AND groups)**. The visual builder and DSL will use Disjunctive Normal Form (groups of `AND` conditions joined by `OR`). This aligns cleanly with human intuition and the current pre-compiled engine architecture.
8. **Interactive SVG Vertex Dragging Scope**:
   - **Resolved**: **Option A (Direct vertex drag for piecewise; sliders for continuous)**. Piecewise functions (`trimf`, `trapmf`, `singleton`) feature direct on-canvas draggable vertices with snapping. Continuous curves (`gaussmf`, `sigmf`, `gbellmf`) feature parameter sliders and numeric inputs with instant reactive curve redraw.

---

## 4. Frontend Asset Packaging & Distribution
9. **Pre-compiled Distribution Assets in Repository**:
   - **Resolved**: **Option A (Commit compiled bundle in Git)**. The compiled `fuzzy-system-panel.js` bundle will be committed to `custom_components/fuzzy_system/frontend/dist/` so that git clones and HACS installations function immediately without requiring a Node build step.
10. **Companion Lovelace Card Scope**:
    - **Resolved**: **Option B (Include companion Lovelace card in scope)**. In addition to the full `/fuzzy-system` configuration panel, the frontend build will produce and export a reusable `fuzzy-system-card` custom element for standard Home Assistant dashboards.

---

## 5. Python Dependencies & Test Environment
11. **`scipy` Manifest & Dependency Declaration**:
    - **Resolved**: Keep `scipy` omitted from both `manifest.json` and `pyproject.toml`. Rely on pip/uv dependency resolution for `scikit-fuzzy` to pull in SciPy, avoiding any explicit version pinning that could conflict with Home Assistant or other packages.

---

## 6. Recurrence Relations, Rate Limiting & Convergence Epsilon
12. **Handling Recurrent Feedback Loops (Output to Input)**:
    - **Resolved**: Support recurrent relationships where an output sensor feeds back into an input variable (either directly or via external automations/entities).
    - **Rate Limiting / Circuit Breaker**:
      - Default `max_updates_per_period`: `20`
      - Default `update_period`: `0.05` seconds
      - System-level sliding-window rate limiter halts runaway cascades when update frequencies exceed this budget.
    - **Convergence Epsilon ($\epsilon$) / Deadband**:
      - Configurable per output (default `0.01`).
      - State updates are suppressed if $|y_{new} - y_{prev}| < \epsilon$.
      - Suppressing the commit prevents emitting Home Assistant `state_changed` events, enabling stable convergence and eliminating useless calculations and micro-jitter.

