// EU24 locales — all 24 official EU languages
// Priority tier (handcrafted) : fr, en, de, es, it, nl, pl, pt
// Stub tier (auto/minimal)    : cs, da, fi, sv, el, hu, ro, bg, hr, sk, sl, lv, lt, et, mt, ga

export const LOCALES = [
  "fr",
  "en",
  "de",
  "es",
  "it",
  "nl",
  "pl",
  "pt",
  "cs",
  "da",
  "fi",
  "sv",
  "el",
  "hu",
  "ro",
  "bg",
  "hr",
  "sk",
  "sl",
  "lv",
  "lt",
  "et",
  "mt",
  "ga",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const PRIORITY_LOCALES = new Set<Locale>([
  "fr",
  "en",
  "de",
  "es",
  "it",
  "nl",
  "pl",
  "pt",
]);

// Native names shown in the language picker
export const LOCALE_NAMES: Record<Locale, { native: string; english: string; flag: string }> = {
  fr: { native: "Français", english: "French", flag: "🇫🇷" },
  en: { native: "English", english: "English", flag: "🇬🇧" },
  de: { native: "Deutsch", english: "German", flag: "🇩🇪" },
  es: { native: "Español", english: "Spanish", flag: "🇪🇸" },
  it: { native: "Italiano", english: "Italian", flag: "🇮🇹" },
  nl: { native: "Nederlands", english: "Dutch", flag: "🇳🇱" },
  pl: { native: "Polski", english: "Polish", flag: "🇵🇱" },
  pt: { native: "Português", english: "Portuguese", flag: "🇵🇹" },
  cs: { native: "Čeština", english: "Czech", flag: "🇨🇿" },
  da: { native: "Dansk", english: "Danish", flag: "🇩🇰" },
  fi: { native: "Suomi", english: "Finnish", flag: "🇫🇮" },
  sv: { native: "Svenska", english: "Swedish", flag: "🇸🇪" },
  el: { native: "Ελληνικά", english: "Greek", flag: "🇬🇷" },
  hu: { native: "Magyar", english: "Hungarian", flag: "🇭🇺" },
  ro: { native: "Română", english: "Romanian", flag: "🇷🇴" },
  bg: { native: "Български", english: "Bulgarian", flag: "🇧🇬" },
  hr: { native: "Hrvatski", english: "Croatian", flag: "🇭🇷" },
  sk: { native: "Slovenčina", english: "Slovak", flag: "🇸🇰" },
  sl: { native: "Slovenščina", english: "Slovenian", flag: "🇸🇮" },
  lv: { native: "Latviešu", english: "Latvian", flag: "🇱🇻" },
  lt: { native: "Lietuvių", english: "Lithuanian", flag: "🇱🇹" },
  et: { native: "Eesti", english: "Estonian", flag: "🇪🇪" },
  mt: { native: "Malti", english: "Maltese", flag: "🇲🇹" },
  ga: { native: "Gaeilge", english: "Irish", flag: "🇮🇪" },
};

// hreflang strings (BCP 47)
export const HREFLANG: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
  nl: "nl-NL",
  pl: "pl-PL",
  pt: "pt-PT",
  cs: "cs-CZ",
  da: "da-DK",
  fi: "fi-FI",
  sv: "sv-SE",
  el: "el-GR",
  hu: "hu-HU",
  ro: "ro-RO",
  bg: "bg-BG",
  hr: "hr-HR",
  sk: "sk-SK",
  sl: "sl-SI",
  lv: "lv-LV",
  lt: "lt-LT",
  et: "et-EE",
  mt: "mt-MT",
  ga: "ga-IE",
};

// OG locale codes
export const OG_LOCALE: Record<Locale, string> = {
  fr: "fr_FR",
  en: "en_GB",
  de: "de_DE",
  es: "es_ES",
  it: "it_IT",
  nl: "nl_NL",
  pl: "pl_PL",
  pt: "pt_PT",
  cs: "cs_CZ",
  da: "da_DK",
  fi: "fi_FI",
  sv: "sv_SE",
  el: "el_GR",
  hu: "hu_HU",
  ro: "ro_RO",
  bg: "bg_BG",
  hr: "hr_HR",
  sk: "sk_SK",
  sl: "sl_SI",
  lv: "lv_LV",
  lt: "lt_LT",
  et: "et_EE",
  mt: "mt_MT",
  ga: "ga_IE",
};

export function isValidLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
