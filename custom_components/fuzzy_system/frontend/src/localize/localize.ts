/**
 * Localization helper for Fuzzy System Frontend components and card.
 * Loads translations statically/bundled via Vite import.meta.glob.
 */

const languages: Record<string, any> = {};

// Eagerly bundle all translation JSON files in ../translations/
const translationModules = (import.meta as any).glob("../translations/*.json", { eager: true });
for (const path in translationModules) {
  const match = path.match(/\/([^/]+)\.json$/);
  if (match) {
    const lang = match[1];
    languages[lang] = (translationModules[path] as any).default || translationModules[path];
  }
}

/**
 * Translate a dotted key (e.g. "card.live_inputs", "editor.target_system")
 * into the current language, falling back to English.
 */
export function localize(
  key: string,
  params?: Record<string, string | number> | string,
  replaceValue?: string | number,
  language?: string
): string {
  const lang = (language || "en").replace(/_/g, "-");
  let translated: string | undefined;

  // Try exact language (e.g. "pt-BR"), then primary subtag (e.g. "pt"), then fallback to "en"
  const candidates = [lang, lang.split("-")[0], "en"];
  for (const candidate of candidates) {
    if (languages[candidate]) {
      const keys = key.split(".");
      let val: any = languages[candidate];
      for (const k of keys) {
        val = val ? val[k] : undefined;
      }
      if (typeof val === "string") {
        translated = val;
        break;
      }
    }
  }

  if (!translated) {
    translated = key;
  }

  if (typeof params === "object" && params !== null) {
    for (const [k, v] of Object.entries(params)) {
      translated = translated.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  } else if (typeof params === "string" && replaceValue !== undefined) {
    translated = translated.replace(new RegExp(params, "g"), String(replaceValue));
  }

  return translated;
}
