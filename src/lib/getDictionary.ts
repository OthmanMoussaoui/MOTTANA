import { Locale } from './i18n';
import type { Dictionary } from './types';

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  try {
    return (await import(`./dictionaries/${locale}.json`)).default as Dictionary;
  } catch (error) {
    console.error(`Error loading dictionary for locale ${locale}:`, error);
    // Fallback to English
    return (await import('./dictionaries/en.json')).default as Dictionary;
  }
} 