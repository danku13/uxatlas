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
 * Структура:
 *   ┌──────────────────────────────────┐
 *   │  [accent badge]   [severity]     │  ← top overlays
 *   │                                  │
 *   │     [phone frame, ~190px wide]   │  ← h-[400px], phone fits fully
 *   │                                  │
 *   ├──────────────────────────────────┤
 *   │ Pattern Title                    │
 *   │ Summary text two lines...        │
 *   │ [tag] [tag] [+N]                 │  ← flex-wrap, no overflow
 *   └──────────────────────────────────┘
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
        <Card className="relative flex flex-col gap-0 overflow-hidden rounded-xl py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-500/40 focus-within:ring-2 focus-within:ring-ring">
          {/* Phone preview area — fixed height, phone fits fully with breathing room for top overlays */}
          <div className="relative flex h-[440px] items-center justify-center overflow-hidden border-b bg-gradient-to-br from-muted/40 via-muted/20 to-muted/10 px-4 pb-4 pt-12">
            {/* Top-left: severity badge */}
            <span className="absolute left-2 top-2 z-10 rounded-full bg-background/85 px-2 py-0.5 shadow-sm backdrop-blur">
              <SeverityBadge severity={pattern.severity} className="px-1.5 py-0 text-[10px]" />
            </span>

            {/* Top-right: category badge */}
            <span className="absolute right-2 top-2 z-10 inline-flex max-w-[55%] items-center gap-1 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur">
              <span
                className={`flex size-3.5 shrink-0 items-center justify-center rounded-[0.25rem] ring-1 ring-inset ${accentIconClass(
                  cat?.accent,
                )}`}
              >
                <LucideIcon name={iconName} className="size-2.5" />
              </span>
              <span className="truncate">{cat?.name}</span>
            </span>

            {/*
              The phone mockup, sized to fit fully inside the preview area.
              Container: 440px tall - 48px padding (12 top + 4 bottom for home indicator safe area) = ~392px usable.
              Phone aspect 9/19.5 → at max-w-[170px] phone height = 170 * 19.5/9 ≈ 368px. Fits with margin.
            */}
            <div className="pointer-events-none flex h-full w-full items-center justify-center">
              <MockupRenderer
                type={pattern.mockupType}
                config={pattern.mockupConfig}
                className="!max-w-[170px]"
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-2 p-4">
            <h3 className="line-clamp-1 text-sm font-semibold tracking-tight">
              {pattern.title}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {pattern.summary}
            </p>

            {/* Tags row — wraps to multiple lines, never overflows */}
            {tags.length > 0 ? (
              <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
                {tags.slice(0, 2).map((t) => (
                  <Badge
                    key={t.slug}
                    variant="secondary"
                    className="max-w-[7rem] truncate text-[11px] font-medium"
                  >
                    {t.name}
                  </Badge>
                ))}
                {tags.length > 2 ? (
                  <span className="text-[11px] font-medium text-muted-foreground">
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
 */
export function PatternCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card">
      <div className="flex h-[440px] items-center justify-center bg-muted/30 pt-12">
        <div className="size-[160px] animate-pulse rounded-[1.5rem] bg-muted" />
      </div>
      <div className="flex flex-col gap-2 p-4">
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
