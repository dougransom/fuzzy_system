---
name: hacs-release-validator
description: >-
  Validates Home Assistant custom integration health, translation placeholders, manifests,
  and unit test coverage locally using Hassfest (Docker) and Pytest before cutting any
  release, bumping versions, or updating HACS default PRs.
---

# HACS Integration Release Protocol

Whenever preparing a new release, bumping version numbers in `manifest.json`, creating git tags, or submitting/updating a pull request to `hacs/default`:

## 1. Local Pre-Release Gate (Mandatory)
Before tagging, creating releases, or requesting review on HACS default PRs, run:
```bash
./scripts/pre_release_check.sh
```
All five stages must pass with return code 0:
1. **Ruff linting & formatting** (`uv run ruff check .`)
2. **Pytest test suite & coverage** (>=95% coverage across `custom_components.fuzzy_system`)
3. **Hassfest Docker validation** (`ghcr.io/home-assistant/hassfest:latest`)
4. **JSON Schema & translation placeholder checks**
5. **HA Architecture & Security Audit** (`scripts/audit_ha_standards.py`)

## 2. Home Assistant Human-Review Architecture & Security Standards
Before cutting any release or submitting a PR, the codebase must strictly adhere to the 5 Home Assistant core architectural pillars:
1. **Privilege & Admin Actions**: Any service/action modifying system state, installing blueprints, adding dashboard cards, or altering config entries must be registered with `async_register_admin_service` (never plain `async_register`). Non-admin users or untrusted automations must not be able to trigger configuration changes.
2. **User YAML Immutability**: Integrations must NEVER programmatically rewrite, dump, or overwrite user YAML configuration files (`ui-lovelace.yaml`, `configuration.yaml`, or custom YAML dashboards). For YAML-mode dashboards or configurations, return the configuration snippet in the service response with instructions for the user to paste it manually.
3. **Strict Target Resolution (Fail-Fast)**: Never silently fall back to default or arbitrary targets when the user explicitly provides an identifier (e.g., `dashboard_path`, `entity_id`). If the requested identifier is not found, immediately raise an explicit `HomeAssistantError`.
4. **Event Loop Purity**: Never invoke blocking I/O (`os.path.exists`, `os.path.isfile`, `open()`, `time.sleep()`, synchronous network requests) on the asyncio event loop thread. Wrap blocking calls in `await hass.async_add_executor_job(...)` or avoid them entirely.
5. **Frontend / Web Cross-Context Isolation**: All browser window `message` listeners in frontend panel/card code must validate `event.source === window && event.origin === window.location.origin` to prevent cross-frame privilege escalation or arbitrary tool execution from embedded `iframe` cards or external web pages.

## 3. Hassfest & Translation Rules
- **No single quotes around placeholders**: Enclosing placeholders like `'{system_id}'` or `'{entity_id}'` in single quotes in `strings.json` or `translations/*.json` violates ICU MessageFormat and will cause rejection by Home Assistant maintainers. Use `{system_id}` directly.
- **Synchronized keys**: Keep `strings.json` and all `translations/<lang>.json` files in sync with identical message keys and placeholder names.
- **Manifest consistency**: Ensure `manifest.json` specifies `"version"` matching the upcoming release tag.

## 4. Git Release Procedure
Only after `./scripts/pre_release_check.sh` succeeds:
1. Commit updated version and translation strings.
2. Tag and push release:
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin main --tags
   gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
   ```
3. If responding to a `hacs/default` PR review, ensure the PR is marked **Ready for review** (not Draft).
