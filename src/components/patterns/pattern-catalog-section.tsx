import * as React from 'react';
import { getTranslations, getLocale } from 'next-intl/server';
import { PatternCatalogClient } from './pattern-catalog-client';

/**
 * PatternCatalogSection — server component wrapper.
 *
 * Renders the catalog anchor (`#patterns`) and a heading, then defers
 * interactivity to the client island below.
 *
 * The client island uses `useSearchParams`, which requires a Suspense
 * boundary in Next.js 16 App Router, so we wrap it in one.
 *
 * The total pattern count is fetched server-side so the subtitle stays
 * accurate as the catalog grows.
 */
export async function PatternCatalogSection() {
  const t = await getTranslations('Catalog');
  const locale = (await getLocale()) as 'ru' | 'en';

  // Read count directly from /content/ Markdown files — no DB, no fetch.
  let totalPatterns = 31; // sensible fallback
  try {
    const { getPatterns } = await import('@/lib/content');
    totalPatterns = getPatterns(locale).filter(
      (p) => p.published && p.moderationStatus === 'approved',
    ).length;
  } catch {
    // ignore — use fallback
  }

  return (
    <section
      id="patterns"
      className="scroll-mt-20 border-b"
      aria-labelledby="patterns-heading"
    >
      <div className="container-wide py-14 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {t('badge')}
          </p>
          <h2
            id="patterns-heading"
            className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {t('title')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {t('subtitle', { count: totalPatterns })}
          </p>
        </div>

        <React.Suspense
          fallback={
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CatalogSkeleton key={i} />
              ))}
            </div>
          }
        >
          <div className="mt-8">
            <PatternCatalogClient />
          </div>
        </React.Suspense>
      </div>
    </section>
  );
}

function CatalogSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex h-[280px] items-center justify-center bg-muted/30">
        <div className="size-[140px] animate-pulse rounded-[1.5rem] bg-muted" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
