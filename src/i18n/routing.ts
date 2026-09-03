import { defineRouting } from 'next-intl/routing';

/**
 * Routing configuration for next-intl.
 *
 * Locales:
 *   - 'ru' — Russian (default, since the catalog content is in Russian)
 *   - 'en' — English
 *
 * The locale is part of the URL: /ru/... or /en/...
 * The root path / redirects to the default locale.
 */
export const routing = defineRouting({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
  localePrefix: 'as-needed',
});

export type Locale = 'ru' | 'en';
