# AI Agent Instructions for Fuzzy System

> **Scope**: This file defines developer and AI agent instructions for the `fuzzy_system` Home Assistant integration.
> **Workspace Rule**: Do not create instruction, goal, or configuration files at the root of `ha-dev`. All project goals, guidelines, and agent instructions must remain inside this folder (`config/custom_components/fuzzy_system/`).

---

## 1. Project Goal
Implement **Fuzzy Control for Home Assistant** to provide declarative, linguistic automation rules with Mamdani and Sugeno inference engines, rich Lovelace diagnostic attributes, initial distribution via HACS, and eventual inclusion in Home Assistant Core as an official built-in helper.

Refer to [`README.md`](README.md) for the detailed project goals, technical specification, and configuration reference.

---

## 2. Directory Layout & Key Files
- `__init__.py`: Component lifecycle, YAML schema parsing, setup of platforms, and config entry setup (`async_setup`, `async_setup_entry`, `async_unload_entry`).
- `fuzzy_engine.py`: Core fuzzy logic engine wrapping `scikit-fuzzy` (`skfuzzy`). Evaluates membership functions, hedges, inference rules, and defuzzification algorithms independently of Home Assistant internals.
- `sensor.py`: Home Assistant sensor entity implementations (`FuzzySystemSensor`, pre-defuzzified set sensors, and system status sensor). Manages state listeners on input entities.
- `config_flow.py`: UI configuration flow for onboarding the integration through Home Assistant's UI.
- `const.py`: Shared constants, domain keys, and default values.
- `manifest.json`: Home Assistant integration manifest (requirements, iot_class, codeowners, config_flow flag).
- `strings.json`: Localized strings for UI config flows.

---

## 3. Engineering & Code Standards
1. **Separation of Concerns**:
   - Keep mathematical fuzzy calculations in `fuzzy_engine.py`.
   - Keep Home Assistant entity lifecycle, state tracking, and event listeners in `sensor.py` and `__init__.py`.
2. **Reactivity**:
   - Any input entity state transition must trigger re-evaluation of the corresponding fuzzy system and immediately update output sensor states and attributes.
3. **Observability**:
   - Preserve sensor attributes needed for diagnostics and Lovelace dashboards: `rule_strengths`, `term_memberships`, `universe`, `aggregated_set`.
4. **Testing**:
   - Tests live under the workspace `tests/` directory (e.g. `tests/test_sensor.py`, `tests/test_fuzzy_engine.py`).
   - Run tests using `uv run pytest tests` or `pytest tests`.
   - Run linting with `uv run ruff check`.
5. **No Workspace Clutter**:
   - Keep all documentation, design docs, agent notes, and project goals localized inside `config/custom_components/fuzzy_system/`.
6. **Documentation & Diagrams**:
   - Always use Mermaid (`mermaid` code blocks) for diagrams, architectures, flowcharts, and state machines in markdown files.

---

## 4. Pre-Release Validation Gate (Mandatory)
Before cutting any release, bumping version numbers in `manifest.json`, creating git tags, or submitting/updating PRs to `hacs/default`:
1. **Incremental Translation**: Run `./scripts/translate.py --since-last-release --tier 1,2 --build-frontend` to translate new or modified Home Assistant UI strings and frontend card/editor components across target language tiers (including Japanese `ja`). For on-demand translation testing, run `./scripts/translate.py --on-demand --lang ja,de`.
2. **Quality Gate Script**: The agent **MUST** run `./scripts/pre_release_check.sh`.
3. All 4 checks must pass cleanly (Ruff linting, Pytest with $\ge 95\%$ coverage, Home Assistant Hassfest via Docker, and JSON/translation placeholder checks across all languages).
4. **Translation placeholders rule**: Never wrap placeholders in single quotes (e.g. use `{system_id}`, never `'{system_id}'`) in `strings.json` or `translations/*.json`.
