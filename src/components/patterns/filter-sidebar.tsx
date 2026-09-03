'use client';

import * as React from 'react';
import { X, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LucideIcon } from '@/components/lucide-icon';
import { cn } from '@/lib/utils';
import type { CategoryDTO, TagDTO, Severity } from '@/lib/types';

/**
 * FilterSidebar — left-column filter panel.
 *
 * Sections:
 *  - Категории:  single-select buttons with count badge + emerald active state.
 *  - Критичность: multi-select chips (High=red / Medium=amber / Low=slate).
 *  - Платформа:   single-select radio (Все / iOS / Android).
 *  - Теги:        top-N tag chips, toggle on click.
 *
 * The component is fully controlled — caller owns the `filters` state and
 * passes setters. A "Сбросить фильтры" button is shown whenever any filter
 * is active.
 */

export type CatalogFilters = {
  q: string;
  categorySlug: string | null;
  severities: Severity[];
  platform: 'ios' | 'android' | null;
  tagSlug: string | null;
  sort: 'newest' | 'severity';
  page: number;
};

export const EMPTY_FILTERS: CatalogFilters = {
  q: '',
  categorySlug: null,
  severities: [],
  platform: null,
  tagSlug: null,
  sort: 'newest',
  page: 1,
};

const SEVERITY_CHIPS: { value: Severity; label: string; classes: string }[] = [
  {
    value: 'high',
    label: 'Высокая',
    classes:
      'bg-red-500/10 text-red-700 ring-red-500/30 hover:bg-red-500/15 dark:text-red-300',
  },
  {
    value: 'medium',
    label: 'Средняя',
    classes:
      'bg-amber-500/10 text-amber-700 ring-amber-500/30 hover:bg-amber-500/15 dark:text-amber-300',
  },
  {
    value: 'low',
    label: 'Низкая',
    classes:
      'bg-slate-500/10 text-slate-700 ring-slate-500/30 hover:bg-slate-500/15 dark:text-slate-300',
  },
];

const PLATFORM_OPTIONS: { value: 'ios' | 'android' | null; label: string }[] = [
  { value: null, label: 'Все' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
];

export type FilterSidebarProps = {
  filters: CatalogFilters;
  onChange: (next: CatalogFilters) => void;
  onReset: () => void;
  categories: CategoryDTO[];
  tags: TagDTO[];
  className?: string;
};

export function isFiltersActive(f: CatalogFilters): boolean {
  return Boolean(
    f.q.trim() ||
      f.categorySlug ||
      f.severities.length > 0 ||
      f.platform ||
      f.tagSlug,
  );
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  categories,
  tags,
  className,
}: FilterSidebarProps) {
  const active = isFiltersActive(filters);

  function setCategory(slug: string) {
    onChange({
      ...filters,
      categorySlug: filters.categorySlug === slug ? null : slug,
      page: 1,
    });
  }

  function toggleSeverity(s: Severity) {
    const has = filters.severities.includes(s);
    onChange({
      ...filters,
      severities: has
        ? filters.severities.filter((x) => x !== s)
        : [...filters.severities, s],
      page: 1,
    });
  }

  function setPlatform(p: 'ios' | 'android' | null) {
    onChange({ ...filters, platform: p, page: 1 });
  }

  function toggleTag(slug: string) {
    onChange({
      ...filters,
      tagSlug: filters.tagSlug === slug ? null : slug,
      page: 1,
    });
  }

  return (
    <div className={cn('flex h-full flex-col', className)}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 px-1 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Filter className="size-4 text-emerald-600 dark:text-emerald-400" />
          Фильтры
        </h2>
        {active ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
            Сбросить
          </Button>
        ) : null}
      </div>

      <ScrollArea className="max-h-[600px] flex-1 rounded-lg">
        <div className="flex flex-col gap-5 px-1 pb-6">
          {/* Категории */}
          <FilterSection title="Категории">
            <div className="flex flex-col gap-1">
              {categories.length === 0 ? (
                <p className="text-xs text-muted-foreground">Загрузка…</p>
              ) : (
                categories.map((c) => {
                  const isOn = filters.categorySlug === c.slug;
                  const iconName = c.icon ?? 'Circle';
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategory(c.slug)}
                      aria-pressed={isOn}
                      className={cn(
                        'group flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                        'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isOn
                          ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                          : 'text-foreground',
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <LucideIcon
                          name={iconName}
                          className={cn(
                            'size-4 shrink-0',
                            isOn ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
                          )}
                        />
                        <span className="truncate font-medium">{c.name}</span>
                      </span>
                      <Badge
                        variant={isOn ? 'default' : 'secondary'}
                        className={cn(
                          'shrink-0 text-[10px] font-medium',
                          isOn
                            ? 'border-transparent bg-emerald-600 text-white dark:bg-emerald-500'
                            : '',
                        )}
                      >
                        {c.patternCount}
                      </Badge>
                    </button>
                  );
                })
              )}
            </div>
          </FilterSection>

          <Separator />

          {/* Критичность */}
          <FilterSection title="Критичность">
            <div className="flex flex-wrap gap-2">
              {SEVERITY_CHIPS.map((chip) => {
                const isOn = filters.severities.includes(chip.value);
                return (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() => toggleSeverity(chip.value)}
                    aria-pressed={isOn}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium ring-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isOn
                        ? cn(chip.classes, 'ring-2 font-semibold')
                        : cn(chip.classes, 'opacity-70 hover:opacity-100'),
                    )}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          <Separator />

          {/* Платформа */}
          <FilterSection title="Платформа">
            <div
              role="radiogroup"
              aria-label="Платформа"
              className="grid grid-cols-3 gap-1.5"
            >
              {PLATFORM_OPTIONS.map((opt) => {
                const isOn = filters.platform === opt.value;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    role="radio"
                    aria-checked={isOn}
                    onClick={() => setPlatform(opt.value)}
                    className={cn(
                      'rounded-md px-2 py-1.5 text-xs font-medium ring-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isOn
                        ? 'bg-emerald-500/15 text-emerald-700 ring-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-300'
                        : 'bg-muted/40 text-muted-foreground ring-transparent hover:bg-muted',
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          <Separator />

          {/* Теги */}
          <FilterSection title="Теги">
            {tags.length === 0 ? (
              <p className="text-xs text-muted-foreground">Загрузка…</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => {
                  const isOn = filters.tagSlug === t.slug;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(t.slug)}
                      aria-pressed={isOn}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isOn
                          ? 'bg-teal-500/15 text-teal-700 ring-teal-500/40 dark:bg-teal-500/20 dark:text-teal-300'
                          : 'bg-muted/40 text-muted-foreground ring-transparent hover:bg-muted',
                      )}
                    >
                      <span className="max-w-[8rem] truncate">{t.name}</span>
                      <span className="text-[10px] opacity-70">{t.patternCount}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </FilterSection>
        </div>
      </ScrollArea>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  );
}
