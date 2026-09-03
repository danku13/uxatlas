'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Search, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { SubmitPatternDialog } from '@/components/submit/submit-pattern-dialog';

export function SiteHeader() {
  const t = useTranslations('Header');
  const [submitOpen, setSubmitOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container-px flex h-16 items-center gap-2 sm:gap-3">
        {/* Logo / wordmark — text only, no icon */}
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-base font-bold tracking-tight text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-amber-400">
            UX Atlas
          </span>
        </Link>

        {/* Desktop search (md+) — flex-1 to fill available width */}
        <div className="relative ml-1 hidden flex-1 items-center md:flex sm:ml-2">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchAriaLabel')}
            className="h-9 w-full max-w-md pl-9 bg-muted/40"
          />
        </div>

        {/* Spacer pushes right cluster to the end on mobile */}
        <div className="flex-1 md:hidden" />

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-1.5">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            type="button"
            size="sm"
            onClick={() => setSubmitOpen(true)}
            className="hidden bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:inline-flex"
          >
            <Plus className="size-4" />
            <span className="hidden md:inline">{t('submitPattern')}</span>
            <span className="md:hidden">{t('submitPatternShort')}</span>
          </Button>
          <Button
            type="button"
            size="icon"
            onClick={() => setSubmitOpen(true)}
            className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:hidden"
            aria-label={t('submitPattern')}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      {/* Mobile search row — appears below the main header bar on small screens */}
      <div className="border-t bg-background/80 px-4 py-2.5 backdrop-blur-md md:hidden">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchAriaLabel')}
            className="h-9 w-full pl-9 bg-muted/40"
          />
        </div>
      </div>

      {/* Submission dialog — always mounted, controlled by `open`. */}
      <SubmitPatternDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </header>
  );
}
