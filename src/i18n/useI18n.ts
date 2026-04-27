"use client";

import { useEffect, useState } from "react";
import { getLocale, t } from "./locale";
import type { SupportedLocale, TranslationKey } from "./translations";

export function useI18n() {
  const [locale, setLocale] = useState<SupportedLocale>("en");

  useEffect(() => {
    setLocale(getLocale());
  }, []);

  const translate = (key: TranslationKey) => t(key, locale);

  return { locale, t: translate };
}
