#!/usr/bin/env bash
# ==============================================================================
# Pre-Release Quality Gate for fuzzy_system
# Enforces Ruff, Pytest with coverage (>=95%), Home Assistant Hassfest (Docker),
# and HACS / translation JSON validations before cutting a release or PR.
# ==============================================================================
set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

echo "========================================="
echo " 1. Running Ruff Linter & Formatter..."
echo "========================================="
uv run ruff check .
echo "✓ Ruff checks passed."

echo ""
echo "========================================="
echo " 2. Running Pytest (Coverage >= 95%)..."
echo "========================================="
uv run pytest tests --cov=custom_components.fuzzy_system --cov-fail-under=95
echo "✓ Pytest and coverage gate passed."

echo ""
echo "========================================="
echo " 3. Running Home Assistant Hassfest (Docker)..."
echo "========================================="
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is required to run Hassfest validation." >&2
    exit 1
fi

docker run --rm \
  -v "${REPO_ROOT}/custom_components/fuzzy_system":"/github/workspace/custom_components/fuzzy_system" \
  ghcr.io/home-assistant/hassfest:latest
echo "✓ Hassfest validation passed."

echo ""
echo "========================================="
echo " 4. Validating JSON Schemas & Placeholder Quotes..."
echo "========================================="
python3 -c "
import glob
import json
import re
import sys

files_to_check = [
    'hacs.json',
    'custom_components/fuzzy_system/manifest.json',
    'custom_components/fuzzy_system/strings.json',
] + glob.glob('custom_components/fuzzy_system/translations/*.json') + \
    glob.glob('custom_components/fuzzy_system/frontend/src/translations/*.json')

has_error = False

for path in sorted(files_to_check):
    try:
        with open(path) as f:
            data = json.load(f)
        print(f'  ✓ Valid JSON: {path}')
    except Exception as err:
        print(f'  ✗ Invalid JSON in {path}: {err}', file=sys.stderr)
        has_error = True

# Translation placeholder quotes check (Frenck / Hassfest rule across all translation files)
check_quote_files = ['custom_components/fuzzy_system/strings.json'] + \
    glob.glob('custom_components/fuzzy_system/translations/*.json') + \
    glob.glob('custom_components/fuzzy_system/frontend/src/translations/*.json')

for path in sorted(check_quote_files):
    with open(path) as f:
        content = f.read()
    # Match '{something}' in strings
    matches = re.findall(r\"'\{[a-zA-Z0-9_]+\}'\", content)
    if matches:
        print(f'  ✗ Invalid placeholders inside single quotes in {path}: {matches}', file=sys.stderr)
        has_error = True

if has_error:
    sys.exit(1)
print('✓ All translation files and manifests verified cleanly.')
"

echo ""
echo "========================================="
echo "✓ ALL PRE-RELEASE CHECKS PASSED!"
echo "========================================="
