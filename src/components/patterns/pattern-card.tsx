'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from '@/components/lucide-icon';
import { MockupRenderer } from '@/components/phone/mockup-registry';
import { SeverityBadge } from './severity-badge';
import { PatternDetailDialog } from './pattern-detail-dialog';
import type { PatternDTO } from '@/lib/types';

/**
 * PatternCard — карточка паттерна в сетке каталога.
 *
 * Адаптивная ширина phone mockup:
 *   - mobile (< 640px, 1 col):     phone = 150px (узкая колонка)
 *   - sm (≥ 640px, 2 cols):        phone = 160px
 *   - xl (≥ 1280px, 3 cols):       phone = 170px
 *
 * Карточка имеет overflow-hidden, но phone масштабируется через max-w, не
 * transform: scale — поэтому layout никогда не ломается.
 */

const ACCENT_ICON: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400',
  emerald:
    'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
  teal: 'bg-teal-500/10 text-teal-600 ring-teal-500/20 dark:text-teal-400',
  orange:
    'bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-400',
  red: 'bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400',
  violet:
    'bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400',
  sky: 'bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-400',
  pink: 'bg-pink-500/10 text-pink-600 ring-pink-500/20 dark:text-pink-400',
  slate:
    'bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-300',
};

function accentIconClass(accent: string | null): string {
  if (accent && ACCENT_ICON[accent]) return ACCENT_ICON[accent];
  return ACCENT_ICON.slate;
}

export function PatternCard({ pattern }: { pattern: PatternDTO }) {
  const [open, setOpen] = React.useState(false);
  const cat = pattern.category;
  const iconName = cat?.icon ?? 'Circle';
  const tags = pattern.tags ?? [];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Открыть паттерн: ${pattern.title}`}
        className="group block w-full text-left focus:outline-none"
      >
        <Card className="relative flex h-full flex-col gap-0 overflow-hidden rounded-xl py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-500/40 focus-within:ring-2 focus-within:ring-ring">
          {/*
            Phone preview area — responsive height that adapts to phone size.
            Phone aspect ratio is 9/19.5, so at width W the height is W*2.17.
            We use min-h to ensure card doesn't collapse, but allow growth.

            At mobile (phone ~150px): height ≈ 150*2.17 + 48px padding ≈ 374px
            At sm (phone ~160px):     height ≈ 160*2.17 + 48px padding ≈ 395px
            At xl (phone ~170px):     height ≈ 170*2.17 + 48px padding ≈ 417px

            We pick h-[380px] sm:h-[400px] xl:h-[440px] to give phone room.
          */}
          <div className="relative flex h-[380px] items-center justify-center overflow-hidden border-b bg-gradient-to-br from-muted/40 via-muted/20 to-muted/10 px-3 pb-3 pt-10 sm:h-[400px] sm:px-4 sm:pt-12 xl:h-[440px]">
            {/* Top-left: severity badge */}
            <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-background/85 px-1.5 py-0.5 shadow-sm backdrop-blur sm:left-2 sm:top-2">
              <SeverityBadge severity={pattern.severity} className="px-1 py-0 text-[9px] sm:text-[10px]" />
            </span>

            {/* Top-right: category badge — max-w to prevent overflow on narrow cards */}
            <span className="absolute right-1.5 top-1.5 z-10 inline-flex max-w-[60%] items-center gap-1 rounded-full bg-background/85 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground shadow-sm backdrop-blur sm:right-2 sm:top-2 sm:px-2 sm:text-[10px]">
              <span
                className={`flex size-3 shrink-0 items-center justify-center rounded-[0.25rem] ring-1 ring-inset ${accentIconClass(
                  cat?.accent,
                )}`}
              >
                <LucideIcon name={iconName} className="size-2" />
              </span>
              <span className="truncate">{cat?.name}</span>
            </span>

            {/*
              Phone mockup — responsive width via max-w classes.
              Container is overflow-hidden so phone never causes horizontal scroll.
              pointer-events-none so card click works (not mockup interactions).
            */}
            <div className="pointer-events-none flex h-full w-full items-center justify-center overflow-hidden">
              <MockupRenderer
                type={pattern.mockupType}
                config={pattern.mockupConfig}
                className="!max-w-[150px] sm:!max-w-[160px] xl:!max-w-[170px]"
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
            <h3 className="line-clamp-1 text-sm font-semibold tracking-tight">
              {pattern.title}
            </h3>
            <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
              {pattern.summary}
            </p>

            {/* Tags row — wraps to multiple lines, never overflows */}
            {tags.length > 0 ? (
              <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
                {tags.slice(0, 2).map((t) => (
                  <Badge
                    key={t.slug}
                    variant="secondary"
                    className="max-w-[6rem] truncate text-[10px] font-medium sm:max-w-[7rem] sm:text-[11px]"
                  >
                    {t.name}
                  </Badge>
                ))}
                {tags.length > 2 ? (
                  <span className="text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                    +{tags.length - 2}
                  </span>
                ) : null}
              </div>
            ) : (
              <div className="mt-auto pt-2" />
            )}
          </div>
        </Card>
      </button>

      {open ? (
        <PatternDetailDialog
          pattern={pattern}
          open={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  );
}

/**
 * Skeleton that matches the PatternCard layout — used during loading.
 * Matches responsive heights so layout doesn't shift on data arrival.
 */
export function PatternCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <div className="flex h-[380px] items-center justify-center bg-muted/30 pt-10 sm:h-[400px] sm:pt-12 xl:h-[440px]">
        <div className="size-[140px] animate-pulse rounded-[1.5rem] bg-muted sm:size-[150px] xl:size-[160px]" />
      </div>
      <div className="flex flex-col gap-2 p-3 sm:p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        <div className="flex gap-1.5 pt-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}
