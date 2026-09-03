import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LucideIcon } from '@/components/lucide-icon';

/* -------------------------------------------------------------------------- */
/*  Types — match the API contract documented in the task brief              */
/* -------------------------------------------------------------------------- */
export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  accent: string | null;
  order: number;
  patternCount: number;
};

/* -------------------------------------------------------------------------- */
/*  Accent color mapping.                                                     */
/*  Tailwind needs literal class names to emit them, so we map each accent    */
/*  token to its full set of classes here.                                     */
/* -------------------------------------------------------------------------- */
type AccentClasses = {
  /** top stripe on the card */
  stripe: string;
  /** icon container background + text + ring */
  iconWrap: string;
  /** hover border */
  hoverBorder: string;
};

const ACCENT_MAP: Record<string, AccentClasses> = {
  amber: {
    stripe: 'bg-amber-500',
    iconWrap:
      'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
    hoverBorder: 'hover:border-amber-500/40',
  },
  rose: {
    stripe: 'bg-rose-500',
    iconWrap:
      'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400',
    hoverBorder: 'hover:border-rose-500/40',
  },
  emerald: {
    stripe: 'bg-emerald-500',
    iconWrap:
      'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/40',
  },
  teal: {
    stripe: 'bg-teal-500',
    iconWrap: 'bg-teal-500/10 text-teal-600 ring-teal-500/20 dark:text-teal-400',
    hoverBorder: 'hover:border-teal-500/40',
  },
  orange: {
    stripe: 'bg-orange-500',
    iconWrap:
      'bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-400',
    hoverBorder: 'hover:border-orange-500/40',
  },
  red: {
    stripe: 'bg-red-500',
    iconWrap: 'bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400',
    hoverBorder: 'hover:border-red-500/40',
  },
  violet: {
    stripe: 'bg-violet-500',
    iconWrap:
      'bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400',
    hoverBorder: 'hover:border-violet-500/40',
  },
  sky: {
    stripe: 'bg-sky-500',
    iconWrap: 'bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-400',
    hoverBorder: 'hover:border-sky-500/40',
  },
  pink: {
    stripe: 'bg-pink-500',
    iconWrap: 'bg-pink-500/10 text-pink-600 ring-pink-500/20 dark:text-pink-400',
    hoverBorder: 'hover:border-pink-500/40',
  },
  slate: {
    stripe: 'bg-slate-500',
    iconWrap:
      'bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-300',
    hoverBorder: 'hover:border-slate-500/40',
  },
};

function getAccent(token: string | null): AccentClasses {
  if (token && ACCENT_MAP[token]) return ACCENT_MAP[token];
  return ACCENT_MAP.slate;
}

/* -------------------------------------------------------------------------- */
/*  Data fetching                                                             */
/*  Reads directly from /content/ Markdown files via lib/content — no DB,     */
/*  no HTTP fetch. Works on Vercel, serverless, anywhere.                     */
/* -------------------------------------------------------------------------- */
async function fetchCategories(): Promise<Category[]> {
  try {
    const { getCategoriesDTO } = await import('@/lib/content');
    return getCategoriesDTO();
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*  UI                                                                        */
/* -------------------------------------------------------------------------- */
function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="h-1 w-full bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="size-9 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  patternsLabel,
}: {
  category: Category;
  patternsLabel: string;
}) {
  const accent = getAccent(category.accent);
  const iconName = category.icon ?? 'Circle';
  // Deep-link into the catalog: `/?category=<slug>#patterns`. The catalog
  // client reads `?category=` from URL search params and scrolls into view
  // via the `#patterns` anchor.
  const href = `/?category=${encodeURIComponent(category.slug)}#patterns`;
  return (
    <Link
      href={href}
      aria-label={`${category.name} — ${category.patternCount} ${patternsLabel}`}
      className="group focus:outline-none"
    >
      <Card
        className={`relative gap-0 overflow-hidden rounded-xl py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring ${accent.hoverBorder}`}
      >
        {/* accent stripe */}
        <div className={`h-1 w-full ${accent.stripe}`} />

        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex size-9 items-center justify-center rounded-lg ring-1 ring-inset ${accent.iconWrap}`}
            >
              <LucideIcon name={iconName} className="size-5" />
            </span>
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight tracking-tight">
              {category.name}
            </h3>
          </div>

          {category.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {category.description}
            </p>
          ) : null}

          <div className="mt-1 flex items-center justify-between">
            <Badge variant="secondary" className="font-medium">
              {category.patternCount}{' '}
              {patternsLabel}
            </Badge>
            <ArrowRight
              className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}

export async function CategoriesSection() {
  const t = await getTranslations('Categories');
  const categories = await fetchCategories();

  return (
    <section id="categories" className="border-b">
      <div className="container-px py-14 lg:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t('badge')}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {t('title')}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 auto-rows-fr">
          {categories.length === 0
            ? Array.from({ length: 10 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            : categories.map((c) => (
                <CategoryCard
                  key={c.id}
                  category={c}
                  patternsLabel={t('patternsCount', { count: c.patternCount })}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
