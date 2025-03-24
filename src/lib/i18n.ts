export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Direction for each locale
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
}; 