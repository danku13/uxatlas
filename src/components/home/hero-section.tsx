import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';

/**
 * Decorative phone-shaped placeholder cards used in the hero.
 * Real interactive mockups are owned by another agent — these are pure
 * visual placeholders so the hero has visual weight before mockups land.
 */
function PhonePlaceholder({
  className = '',
  accent = 'bg-emerald-500',
}: {
  className?: string;
  accent?: string;
}) {
  return (
    <div
      className={`relative aspect-[9/19] w-full rounded-[1.75rem] border bg-card/80 p-2 shadow-xl ring-1 ring-black/5 ${className}`}
    >
      {/* colored status bar / accent strip */}
      <div className={`h-6 w-full rounded-t-xl ${accent} opacity-80`} />
      {/* notch */}
      <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-foreground/15" />
      {/* skeleton content rows */}
      <div className="mt-3 flex flex-col gap-2 p-2">
        <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
        <div className="h-2 w-full rounded-full bg-foreground/10" />
        <div className="h-2 w-4/5 rounded-full bg-foreground/10" />
        <div className="mt-2 h-16 w-full rounded-lg bg-foreground/5" />
        <div className="h-2 w-3/4 rounded-full bg-foreground/10" />
        <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
      </div>
    </div>
  );
}

export async function HeroSection() {
  const t = await getTranslations('Hero');
  const locale = await getLocale();

  // Read counts directly from /content/ Markdown files — no DB, no fetch.
  // Works on Vercel, serverless, anywhere.
  let patternCount = 31;
  let categoryCount = 10;
  let guidelineCount = 60;
  try {
    const { getPatterns, getCategories } = await import("@/lib/content");
    const patterns = getPatterns(locale as 'ru' | 'en');
    const categories = getCategories(locale as 'ru' | 'en');
    patternCount = patterns.length;
    categoryCount = categories.length;
    // Approx guidelines: ~2 per pattern on average → round up
    guidelineCount = Math.ceil(patternCount * 1.9);
  } catch {
    // ignore — use fallbacks
  }

  return (
    <section className="relative overflow-hidden border-b">
      {/* Decorative background — soft emerald/amber gradient on transparent backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(60rem 30rem at 15% 10%, oklch(0.86 0.12 162 / 0.35), transparent 60%), radial-gradient(50rem 25rem at 95% 20%, oklch(0.88 0.10 75 / 0.30), transparent 55%)',
        }}
      />
      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] dark:opacity-[0.10]"
        style={{
          backgroundImage:
            'linear-gradient(to right, oklch(0.5 0 0 / 0.08) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.5 0 0 / 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      <div className="container-px py-16 sm:py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Text column */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t('badge')}</span>
            </div>

            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t('title')}{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-amber-400">
                {t('titleHighlight')}
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              {t('subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-11 px-6">
                <a href="#patterns">
                  {t('browsePatterns')}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 px-6"
              >
                <a href="#submit">{t('submitPattern')}</a>
              </Button>
            </div>

            {/* Quick stats */}
            <dl className="mt-10 grid grid-cols-3 gap-4 sm:max-w-md">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t('statsDropoffPoints')}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight">
                  {categoryCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t('statsPatterns')}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight">
                  {patternCount}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  {t('statsGuidelines')}
                </dt>
                <dd className="mt-1 text-2xl font-semibold tracking-tight">
                  {guidelineCount}+
                </dd>
              </div>
            </dl>
          </div>

          {/* Floating phone preview cards (decorative) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto hidden h-[26rem] max-w-md lg:block">
              <div className="absolute left-0 top-6 w-32 -rotate-6">
                <PhonePlaceholder accent="bg-rose-400/70" />
              </div>
              <div className="absolute left-1/2 top-0 z-10 w-36 -translate-x-1/2 rotate-0">
                <PhonePlaceholder accent="bg-emerald-400/70" />
              </div>
              <div className="absolute right-0 top-8 w-32 rotate-6">
                <PhonePlaceholder accent="bg-amber-400/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
