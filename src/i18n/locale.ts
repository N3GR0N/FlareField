import { normalizedTranslations, type SupportedLocale, type TranslationKey } from "./translations";

export function normalizeLocale(rawLocale: string | undefined): SupportedLocale {
  if (!rawLocale) return "en";
  const short = rawLocale.toLowerCase().split("-")[0] as SupportedLocale;
  if (short in normalizedTranslations) {
    return short;
  }
  return "en";
}

export function getLocale(): SupportedLocale {
  if (typeof window === "undefined") {
    return "en";
  }
  return normalizeLocale(window.navigator.language);
}

export function t(key: TranslationKey, localeOverride?: SupportedLocale): string {
  const locale = localeOverride ?? getLocale();
  const table = normalizedTranslations[locale] ?? normalizedTranslations.en;
  return table[key] ?? normalizedTranslations.en[key] ?? key;
}
