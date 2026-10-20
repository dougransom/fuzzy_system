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
All four stages must pass with return code 0:
1. **Ruff linting & formatting** (`uv run ruff check .`)
2. **Pytest test suite & coverage** (>=95% coverage across `custom_components.fuzzy_system`)
3. **Hassfest Docker validation** (`ghcr.io/home-assistant/hassfest:latest`)
4. **JSON Schema & translation placeholder checks**

## 2. Hassfest & Translation Rules
- **No single quotes around placeholders**: Enclosing placeholders like `'{system_id}'` or `'{entity_id}'` in single quotes in `strings.json` or `translations/*.json` violates ICU MessageFormat and will cause rejection by Home Assistant maintainers. Use `{system_id}` directly.
- **Synchronized keys**: Keep `strings.json` and all `translations/<lang>.json` files in sync with identical message keys and placeholder names.
- **Manifest consistency**: Ensure `manifest.json` specifies `"version"` matching the upcoming release tag.

## 3. Git Release Procedure
Only after `./scripts/pre_release_check.sh` succeeds:
1. Commit updated version and translation strings.
2. Tag and push release:
   ```bash
   git tag -a vX.Y.Z -m "Release vX.Y.Z"
   git push origin main --tags
   gh release create vX.Y.Z --title "vX.Y.Z" --generate-notes
   ```
3. If responding to a `hacs/default` PR review, ensure the PR is marked **Ready for review** (not Draft).
