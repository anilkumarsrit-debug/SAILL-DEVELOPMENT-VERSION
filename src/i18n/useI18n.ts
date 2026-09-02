/**
 * SAILL - SRIT AI Language Laboratory
 * Centralized Internationalization & String Resources Hook (Localization Ready)
 */

import { enLocale, LocaleDictionary } from './locales/en';

export function useI18n() {
  const currentLocale: LocaleDictionary = enLocale;

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: any = currentLocale;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback || path;
      }
    }

    return typeof current === 'string' ? current : fallback || path;
  };

  return {
    t,
    locale: 'en',
    dictionary: currentLocale
  };
}
