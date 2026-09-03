'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { routing, type Locale } from '@/i18n/routing';

/**
 * LanguageToggle — переключатель языков (RU / EN).
 *
 * При смене языка делает router.replace на тот же pathname,
 * но с другим префиксом локали (/ru/... → /en/...).
 */
export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const t = useTranslations('Language');
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // pathname from next/navigation in app router with locale prefix
    // already includes /ru/... or /en/... — we need to swap the prefix
    const segments = pathname.split('/');
    // segments[0] is empty string (leading slash), segments[1] is locale
    if (segments.length > 1 && routing.locales.includes(segments[1] as Locale)) {
      segments[1] = next;
      router.replace(segments.join('/') || '/');
    } else {
      // No locale prefix — just prepend
      router.replace(`/${next}${pathname}`);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          aria-label={t('toggle')}
        >
          <Languages className="size-4" />
          <span className="sr-only">{t('toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchTo('ru')}
          className={locale === 'ru' ? 'font-semibold' : ''}
        >
          🇷🇺 {t('ru')}
          {locale === 'ru' ? <span className="ml-auto text-emerald-600">✓</span> : null}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchTo('en')}
          className={locale === 'en' ? 'font-semibold' : ''}
        >
          🇬🇧 {t('en')}
          {locale === 'en' ? <span className="ml-auto text-emerald-600">✓</span> : null}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
