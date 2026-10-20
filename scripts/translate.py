#!/usr/bin/env python3
"""
Internationalization (i18n) Engine for Fuzzy System Home Assistant Integration.

Translates Home Assistant UI Strings (strings.json -> translations/{lang}.json)
and Frontend components (frontend/src/translations/en.json -> {lang}.json).

Features:
- Incremental translation: Only translates newly introduced files or changed/missing
  strings since the latest release tag (or on-demand).
- Protects translation placeholders (e.g. {system_id}) and enforces Hassfest rules
  (no single quotes around placeholders).
- Language tier registry stored in scripts/translations/languages.json (includes Japanese).
"""

import argparse
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

REPO_ROOT = Path(__file__).resolve().parent.parent
LANGUAGES_FILE = REPO_ROOT / "scripts" / "translations" / "languages.json"

# Source files and their corresponding translation directories
TARGET_FILES = [
    {
        "name": "Home Assistant UI Strings",
        "source": REPO_ROOT / "custom_components" / "fuzzy_system" / "strings.json",
        "output_dir": REPO_ROOT / "custom_components" / "fuzzy_system" / "translations",
    },
    {
        "name": "Frontend Editor & Card",
        "source": REPO_ROOT / "custom_components" / "fuzzy_system" / "frontend" / "src" / "translations" / "en.json",
        "output_dir": REPO_ROOT / "custom_components" / "fuzzy_system" / "frontend" / "src" / "translations",
    },
]

# Language code normalization for Google Translate API
LANG_CODE_MAP = {
    "zh-Hans": "zh-CN",
    "zh-Hant": "zh-TW",
    "es-419": "es",
    "pt-BR": "pt",
    "sr-Latn": "sr",
}


def load_languages_config() -> Dict[str, Any]:
    """Load the languages registry."""
    if not LANGUAGES_FILE.exists():
        raise FileNotFoundError(f"Languages configuration not found: {LANGUAGES_FILE}")
    with open(LANGUAGES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_latest_git_tag() -> Optional[str]:
    """Retrieve the most recent git release tag, or None if no tag exists."""
    try:
        result = subprocess.run(
            ["git", "describe", "--tags", "--abbrev=0"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        tag = result.stdout.strip()
        return tag if tag else None
    except Exception:
        return None


def get_file_content_at_tag(relative_path: str, tag: str) -> Optional[Dict[str, Any]]:
    """Retrieve parsed JSON content of a file at a specific git tag."""
    try:
        result = subprocess.run(
            ["git", "show", f"{tag}:{relative_path}"],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        return json.loads(result.stdout)
    except Exception:
        return None


def flatten_dict(d: Dict[str, Any], prefix: str = "") -> Dict[str, str]:
    """Flatten a nested dictionary into dot-separated keys."""
    items: Dict[str, str] = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            items.update(flatten_dict(v, key))
        elif isinstance(v, str):
            items[key] = v
    return items


def unflatten_dict(flat: Dict[str, Any]) -> Dict[str, Any]:
    """Convert flat dot-separated keys back into a nested dictionary."""
    result: Dict[str, Any] = {}
    for key, value in flat.items():
        parts = key.split(".")
        current = result
        for part in parts[:-1]:
            if part not in current or not isinstance(current[part], dict):
                current[part] = {}
            current = current[part]
        current[parts[-1]] = value
    return result


def find_changed_or_new_keys(
    current_data: Dict[str, Any], old_data: Optional[Dict[str, Any]]
) -> Set[str]:
    """Find dot-keys that were added or whose English string changed."""
    current_flat = flatten_dict(current_data)
    if not old_data:
        return set(current_flat.keys())
    old_flat = flatten_dict(old_data)
    changed = set()
    for k, val in current_flat.items():
        if k not in old_flat or old_flat[k] != val:
            changed.add(k)
    return changed


def translate_text(text: str, target_lang: str) -> str:
    """
    Translate English text to target_lang while strictly protecting
    placeholders like {system_id} and stripping single quotes around them.
    """
    if not text.strip():
        return text

    # Extract all {placeholder} patterns
    placeholders = re.findall(r"\{[a-zA-Z0-9_]+\}", text)
    token_map = {}
    prepared_text = text
    for i, ph in enumerate(placeholders):
        token = f"ZZZPH{i}ZZZ"
        token_map[token] = ph
        prepared_text = prepared_text.replace(ph, token)

    api_lang = LANG_CODE_MAP.get(target_lang, target_lang)

    try:
        url = (
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en"
            f"&tl={api_lang}&dt=t&q=" + urllib.parse.quote(prepared_text)
        )
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            translated = "".join(part[0] for part in data[0] if part[0])
    except Exception as err:
        print(f"    [!] Translation API warning ({target_lang}): {err}. Falling back to source text.", file=sys.stderr)
        return text

    # Restore placeholders
    for token, ph in token_map.items():
        pattern = re.compile(r"\s*".join(list(token)), re.IGNORECASE)
        translated = pattern.sub(ph, translated)
        translated = translated.replace(token, ph)

    # Enforce Home Assistant Hassfest rule: No single quotes around placeholders
    translated = re.sub(r"'(\{([a-zA-Z0-9_]+)\})'", r"\1", translated)
    return translated


def _update_language_file(
    output_dir: Path,
    lang: str,
    source_flat: Dict[str, str],
    changed_keys: Set[str],
    force: bool,
    since_release: bool,
) -> int:
    """Translate and write a single target language file. Returns count of translated strings."""
    target_file = output_dir / f"{lang}.json"
    existing_flat = {}
    if target_file.exists():
        try:
            with open(target_file, "r", encoding="utf-8") as f:
                existing_flat = flatten_dict(json.load(f))
        except Exception:
            existing_flat = {}

    keys_to_translate = []
    for k in source_flat:
        if force:
            keys_to_translate.append(k)
        elif since_release and k in changed_keys:
            keys_to_translate.append(k)
        elif k not in existing_flat or not existing_flat[k].strip():
            keys_to_translate.append(k)

    if not keys_to_translate:
        return 0

    print(f"  -> Translating {len(keys_to_translate)} strings for '{lang}'...")
    updated_flat = dict(existing_flat)

    for k in keys_to_translate:
        orig_text = source_flat[k]
        updated_flat[k] = translate_text(orig_text, lang)
        time.sleep(0.04)

    # Prune keys no longer in source
    pruned_flat = {k: v for k, v in updated_flat.items() if k in source_flat}
    nested_data = unflatten_dict(pruned_flat)

    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(nested_data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    return len(keys_to_translate)


def process_target_file(
    target_info: Dict[str, Any],
    target_languages: List[str],
    last_tag: Optional[str],
    force: bool = False,
    since_release: bool = False,
) -> Tuple[int, int]:
    """Process a source file and update translation files."""
    source_path: Path = target_info["source"]
    output_dir: Path = target_info["output_dir"]
    name: str = target_info["name"]

    if not source_path.exists():
        print(f"Skipping {name}: source file {source_path} does not exist.")
        return 0, 0

    output_dir.mkdir(parents=True, exist_ok=True)

    with open(source_path, "r", encoding="utf-8") as f:
        source_data = json.load(f)

    relative_source = str(source_path.relative_to(REPO_ROOT))
    old_data = None
    if since_release and last_tag:
        old_data = get_file_content_at_tag(relative_source, last_tag)
        if old_data:
            print(f"[{name}] Comparing against last release tag '{last_tag}'...")
        else:
            print(f"[{name}] File was introduced since last release '{last_tag}'. Full translation required.")

    changed_keys = find_changed_or_new_keys(source_data, old_data if since_release else None)
    source_flat = flatten_dict(source_data)

    print(f"[{name}] Found {len(source_flat)} total strings ({len(changed_keys)} new/changed).")

    total_translated = 0
    total_files_updated = 0

    for lang in target_languages:
        if lang == "en":
            target_file = output_dir / "en.json"
            with open(target_file, "w", encoding="utf-8") as f:
                json.dump(source_data, f, indent=2, ensure_ascii=False)
                f.write("\n")
            continue

        n_translated = _update_language_file(
            output_dir=output_dir,
            lang=lang,
            source_flat=source_flat,
            changed_keys=changed_keys,
            force=force,
            since_release=since_release,
        )
        if n_translated > 0:
            total_translated += n_translated
            total_files_updated += 1

    return total_translated, total_files_updated


def main() -> int:
    parser = argparse.ArgumentParser(description="Fuzzy System Internationalization & Release Translator")
    parser.add_argument(
        "--since-last-release",
        action="store_true",
        help="Translate only strings/files changed or introduced since the last release tag.",
    )
    parser.add_argument(
        "--on-demand",
        action="store_true",
        help="On-demand translation mode (translates all missing keys across specified languages).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force re-translation of all strings, overwriting existing translations.",
    )
    parser.add_argument(
        "--tier",
        type=str,
        default="1,2",
        help="Comma-separated tiers to translate (e.g. '1', '1,2', '3', or 'all'). Default: '1,2'.",
    )
    parser.add_argument(
        "--lang",
        type=str,
        default="",
        help="Comma-separated language codes to translate (e.g. 'ja,de,fr'). Overrides --tier.",
    )
    parser.add_argument(
        "--build-frontend",
        action="store_true",
        help="Rebuild frontend bundle (npm run build) after updating translations.",
    )

    args = parser.parse_args()

    cfg = load_languages_config()
    all_langs_map = cfg.get("languages", {})
    tiers_map = cfg.get("tiers", {})

    target_languages: List[str] = []
    if args.lang:
        requested = [lang_code.strip() for lang_code in args.lang.split(",") if lang_code.strip()]
        for r in requested:
            if r in all_langs_map:
                target_languages.append(r)
            else:
                print(f"Warning: Unknown language code '{r}', proceeding anyway.")
                target_languages.append(r)
    else:
        if args.tier.lower() == "all":
            selected_tiers = ["1", "2", "3"]
        else:
            selected_tiers = [t.strip() for t in args.tier.split(",") if t.strip()]

        for t in selected_tiers:
            target_languages.extend(tiers_map.get(t, []))

    # Always ensure English is present for source mirroring
    if "en" not in target_languages:
        target_languages.insert(0, "en")

    # Deduplicate while preserving order
    target_languages = list(dict.fromkeys(target_languages))

    last_tag = get_latest_git_tag()
    print("=================================================================")
    print(" Fuzzy System i18n Translation Engine")
    print("=================================================================")
    print(f"Target Languages Count: {len(target_languages)}")
    print(f"Target Languages: {', '.join(target_languages)}")
    print(f"Latest Git Release Tag: {last_tag or 'None (initial release mode)'}")
    print(f"Mode: {'Incremental since release' if args.since_last_release else 'On-demand'}")
    print("=================================================================")

    grand_translated = 0
    grand_files = 0

    for target_info in TARGET_FILES:
        n_trans, n_files = process_target_file(
            target_info=target_info,
            target_languages=target_languages,
            last_tag=last_tag,
            force=args.force,
            since_release=args.since_last_release,
        )
        grand_translated += n_trans
        grand_files += n_files

    print("")
    print("=================================================================")
    print(f"✓ Translation complete: {grand_translated} strings translated across {grand_files} files.")
    print("=================================================================")

    if args.build_frontend:
        frontend_dir = REPO_ROOT / "custom_components" / "fuzzy_system" / "frontend"
        print("Rebuilding frontend bundle...")
        subprocess.run(["npm", "run", "build"], cwd=frontend_dir, check=True)
        print("✓ Frontend bundle rebuilt successfully.")

    return 0


if __name__ == "__main__":
    sys.exit(main())
