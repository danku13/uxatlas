'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Search, X, SlidersHorizontal, ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

import { PatternCard, PatternCardSkeleton } from './pattern-card';
import {
  FilterSidebar,
  EMPTY_FILTERS,
  isFiltersActive,
  type CatalogFilters,
} from './filter-sidebar';
import type {
  CategoryDTO,
  TagDTO,
  PatternDTO,
  Paginated,
  Severity,
} from '@/lib/types';

const PAGE_SIZE = 9;

/**
 * Parse the current URLSearchParams into a CatalogFilters object.
 * Pure + reusable — used both for the initial state and for re-adopting
 * URL state after an external navigation (e.g., clicking a category card).
 */
function parseFiltersFromSp(sp: URLSearchParams | ReadonlyURLSearchParams): CatalogFilters {
  const severities = (sp.get('severity') ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s): s is Severity => s === 'high' || s === 'medium' || s === 'low');

  const platformRaw = (sp.get('platform') ?? '').toLowerCase();
  const platform =
    platformRaw === 'ios' || platformRaw === 'android' ? platformRaw : null;

  const sortRaw = (sp.get('sort') ?? '').toLowerCase();
  const sort: CatalogFilters['sort'] = sortRaw === 'severity' ? 'severity' : 'newest';

  const pageRaw = Number(sp.get('page') ?? '1');
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;

  return {
    q: sp.get('q') ?? '',
    categorySlug: sp.get('category') || null,
    severities,
    platform,
    tagSlug: sp.get('tag') || null,
    sort,
    page,
  };
}

/**
 * Serialize the filter state into a URL search string (without the leading `?`).
 * Used both for the API query (we re-derive API params separately below) and
 * for syncing state → URL.
 *
 * Params are written in a stable insertion order so the round-trip
 * `filters → URL string → filters` is deterministic.
 */
function filtersToUrlString(f: CatalogFilters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.categorySlug) p.set('category', f.categorySlug);
  if (f.severities.length > 0) p.set('severity', f.severities.join(','));
  if (f.platform) p.set('platform', f.platform);
  if (f.tagSlug) p.set('tag', f.tagSlug);
  if (f.sort !== 'newest') p.set('sort', f.sort);
  if (f.page > 1) p.set('page', String(f.page));
  return p.toString();
}

/**
 * PatternCatalogClient — interactive client-side catalog.
 *
 * Owns filter state, syncs it to the URL (so category cards can deep-link
 * via `/?category=onboarding#patterns`), fetches patterns via TanStack Query,
 * and renders the grid + pagination.
 */
export function PatternCatalogClient() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // Hydrate initial filter state from URL params (one-time read).
  const [filters, setFilters] = React.useState<CatalogFilters>(() =>
    parseFiltersFromSp(sp),
  );

  // ---- Build the API query string from the filter state ----
  const apiParams = React.useMemo(() => {
    const p = new URLSearchParams();
    p.set('pageSize', String(PAGE_SIZE));
    if (filters.q.trim()) p.set('q', filters.q.trim());
    if (filters.categorySlug) p.set('categorySlug', filters.categorySlug);
    if (filters.severities.length > 0) p.set('severity', filters.severities.join(','));
    if (filters.platform) p.set('platform', filters.platform);
    if (filters.tagSlug) p.set('tag', filters.tagSlug);
    p.set('sort', filters.sort);
    p.set('page', String(filters.page));
    return p.toString();
  }, [filters]);

  // ---- Fetch patterns via TanStack Query ----
  const { data, isLoading, isFetching, isError } = useQuery<
    Paginated<PatternDTO>
  >({
    queryKey: ['patterns', apiParams],
    queryFn: async () => {
      const res = await fetch(`/api/patterns?${apiParams}`);
      if (!res.ok) throw new Error('Failed to load patterns');
      return (await res.json()) as Paginated<PatternDTO>;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  // ---- Fetch categories & tags (for the sidebar) ----
  const { data: categories = [] } = useQuery<CategoryDTO[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) return [];
      const data = (await res.json()) as CategoryDTO[] | { items: CategoryDTO[] };
      return Array.isArray(data) ? data : data.items ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: tags = [] } = useQuery<TagDTO[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await fetch('/api/tags');
      if (!res.ok) return [];
      const data = (await res.json()) as TagDTO[] | { items: TagDTO[] };
      const list = Array.isArray(data) ? data : data.items ?? [];
      // Top 8 by pattern count (descending).
      return list
        .slice()
        .sort((a, b) => b.patternCount - a.patternCount)
        .slice(0, 8);
    },
    staleTime: 5 * 60 * 1000,
  });

  // ---- Sync filter changes back to the URL ----
  // We do the state → URL direction here. The reverse direction (URL → state,
  // for external navigations like clicking a category card) is handled below
  // by comparing the current URL string with the canonical one derived from
  // filters.
  React.useEffect(() => {
    const qs = filtersToUrlString(filters);
    const nextUrl = qs ? `${pathname}?${qs}` : pathname;
    // Avoid an unnecessary replace() round-trip when the URL already matches
    // (otherwise the URL → state effect would re-trigger on every render).
    if (typeof window !== 'undefined') {
      const current = window.location.search.replace(/^\?/, '');
      if (current === qs) return;
    }
    router.replace(nextUrl, { scroll: false });
    // We intentionally do not include the hash here — it's managed by the
    // category anchor link (`#patterns`) and shouldn't be wiped on filter
    // changes inside the catalog.
  }, [filters, pathname, router]);

  // ---- Mobile filter sheet ----
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // ---- Search input (debounced into filters.q) ----
  // Declared before the URL→state adoption effect below so that hook can
  // safely reference setSearchInput.
  const [searchInput, setSearchInput] = React.useState(filters.q);
  React.useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      if (searchInput !== filters.q) {
        setFilters((f) => ({ ...f, q: searchInput, page: 1 }));
      }
    }, 250);
    return () => window.clearTimeout(handle);
  }, [searchInput, filters.q]);

  // ---- Adopt URL → state on external navigation ----
  // When useSearchParams changes (e.g., the user clicks a category card that
  // links to `/?category=auth#patterns`), check whether the URL string differs
  // from what our current filters would produce. If so, treat it as an
  // external navigation and adopt the URL's filter state into local state.
  const spKey = sp.toString();
  React.useEffect(() => {
    const expected = filtersToUrlString(filters);
    if (spKey !== expected) {
      setFilters(parseFiltersFromSp(sp));
      // Sync the search input box too so it doesn't lag behind.
      setSearchInput(sp.get('q') ?? '');
    }
  }, [spKey]); // eslint depends on sp/filters too, but we only re-adopt when the URL itself changes

  function resetFilters() {
    setFilters({ ...EMPTY_FILTERS });
    setSearchInput('');
  }

  // ---- Pagination range calc ----
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.page ?? filters.page;
  const pageSize = data?.pageSize ?? PAGE_SIZE;
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  const paginationItems = buildPageRange(currentPage, totalPages);

  function gotoPage(p: number) {
    if (p < 1 || (totalPages > 0 && p > totalPages)) return;
    setFilters((f) => ({ ...f, page: p }));
    if (typeof document !== 'undefined') {
      document
        .getElementById('patterns')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const items = data?.items ?? [];
  const showSkeletons = isLoading;
  const showEmpty = !isLoading && !isError && items.length === 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Top toolbar: search + sort + (mobile) filter button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Поиск паттернов…"
            aria-label="Поиск паттернов"
            className="h-10 w-full pl-9 pr-9"
          />
          {searchInput ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setFilters((f) => ({ ...f, q: '', page: 1 }));
              }}
              aria-label="Очистить поиск"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Select
            value={filters.sort}
            onValueChange={(v) =>
              setFilters((f) => ({
                ...f,
                sort: v as CatalogFilters['sort'],
                page: 1,
              }))
            }
          >
            <SelectTrigger className="h-10 w-[140px] sm:w-[180px]" aria-label="Сортировка">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Новинки</SelectItem>
              <SelectItem value="severity">По критичности</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile filter button */}
          <Button
            type="button"
            variant="outline"
            size="default"
            className="relative h-10 lg:hidden"
            onClick={() => setSheetOpen(true)}
            aria-label="Открыть фильтры"
          >
            <SlidersHorizontal className="size-4" />
            <span className="hidden sm:inline">Фильтры</span>
            {isFiltersActive(filters) ? (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                ●
              </span>
            ) : null}
          </Button>
        </div>
      </div>

      {/* Layout: sidebar + grid on desktop; grid only on mobile */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border bg-card/40 p-3">
            <FilterSidebar
              filters={filters}
              onChange={(next) => setFilters(next)}
              onReset={resetFilters}
              categories={categories}
              tags={tags}
            />
          </div>
        </aside>

        {/* Grid */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Active filter chips */}
          {isFiltersActive(filters) ? (
            <ActiveFiltersBar
              filters={filters}
              categories={categories}
              tags={tags}
              onRemove={(patch) => setFilters({ ...filters, ...patch, page: 1 })}
              onReset={resetFilters}
            />
          ) : null}

          {isError ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-center">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                Не удалось загрузить паттерны
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Попробуйте обновить страницу.
              </p>
            </div>
          ) : showEmpty ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Search className="size-5 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold">Ничего не найдено по фильтрам</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Попробуйте изменить запрос или сбросить фильтры, чтобы увидеть все
                паттерны.
              </p>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-fr"
              aria-busy={isFetching ? 'true' : 'false'}
            >
              {showSkeletons
                ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <PatternCardSkeleton key={i} />
                  ))
                : items.map((p) => <PatternCard key={p.id} pattern={p} />)}
            </div>
          )}

          {/* Pagination */}
          {total > 0 ? (
            <div className="mt-2 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                Показано{' '}
                <span className="font-medium text-foreground">{rangeStart}</span>
                {' – '}
                <span className="font-medium text-foreground">{rangeEnd}</span>
                {' из '}
                <span className="font-medium text-foreground">{total}</span>
              </p>

              {totalPages > 1 ? (
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => gotoPage(currentPage - 1)}
                    aria-label="Предыдущая страница"
                  >
                    <ArrowLeft className="size-4" />
                    <span className="hidden sm:inline">Назад</span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {paginationItems.map((item, idx) =>
                      item === '…' ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="px-2 text-sm text-muted-foreground"
                        >
                          …
                        </span>
                      ) : (
                        <Button
                          key={item}
                          type="button"
                          variant={item === currentPage ? 'default' : 'outline'}
                          size="sm"
                          className="h-8 min-w-8"
                          onClick={() => gotoPage(item)}
                          aria-current={item === currentPage ? 'page' : undefined}
                        >
                          {item}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => gotoPage(currentPage + 1)}
                    aria-label="Следующая страница"
                  >
                    <span className="hidden sm:inline">Дальше</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile filter Sheet (slides from left) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-[88%] max-w-sm p-0 overflow-y-auto">
          <SheetHeader className="px-4 pt-4">
            <SheetTitle className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-emerald-600 dark:text-emerald-400" />
              Фильтры
            </SheetTitle>
            <SheetDescription>
              Выберите категорию, критичность, платформу или тег.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-hidden px-2 pb-2">
            <FilterSidebar
              filters={filters}
              onChange={(next) => setFilters(next)}
              onReset={resetFilters}
              categories={categories}
              tags={tags}
            />
          </div>
          <div className="sticky bottom-0 border-t bg-background p-3">
            <Button
              type="button"
              className="w-full"
              onClick={() => setSheetOpen(false)}
            >
              Показать {total} {pluralizePatterns(total)}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/**
 * ActiveFiltersBar — small chip strip below the toolbar showing the currently
 * applied filters with a one-click remove on each.
 */
function ActiveFiltersBar({
  filters,
  categories,
  tags,
  onRemove,
  onReset,
}: {
  filters: CatalogFilters;
  categories: CategoryDTO[];
  tags: TagDTO[];
  onRemove: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
}) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.categorySlug) {
    const c = categories.find((x) => x.slug === filters.categorySlug);
    chips.push({
      label: c?.name ?? filters.categorySlug,
      onRemove: () => onRemove({ categorySlug: null }),
    });
  }

  filters.severities.forEach((s) => {
    const label =
      s === 'high' ? 'Высокая критичность' : s === 'medium' ? 'Средняя критичность' : 'Низкая критичность';
    chips.push({
      label,
      onRemove: () =>
        onRemove({
          severities: filters.severities.filter((x) => x !== s),
        }),
    });
  });

  if (filters.platform) {
    chips.push({
      label: filters.platform === 'ios' ? 'iOS' : 'Android',
      onRemove: () => onRemove({ platform: null }),
    });
  }

  if (filters.tagSlug) {
    const t = tags.find((x) => x.slug === filters.tagSlug);
    chips.push({
      label: t?.name ?? filters.tagSlug,
      onRemove: () => onRemove({ tagSlug: null }),
    });
  }

  if (filters.q.trim()) {
    chips.push({
      label: `«${filters.q.trim()}»`,
      onRemove: () => onRemove({ q: '' }),
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map((chip, i) => (
        <button
          key={i}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="max-w-[12rem] truncate">{chip.label}</span>
          <X className="size-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
      >
        Сбросить всё
      </button>
    </div>
  );
}

/**
 * Build a compact page range like `1 … 4 5 6 … 9` for pagination.
 * Returns an array of numbers and '…' strings.
 */
function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 1) return [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const out: (number | '…')[] = [];
  const showLeft = Math.max(2, current - 1);
  const showRight = Math.min(total - 1, current + 1);

  out.push(1);
  if (showLeft > 2) out.push('…');
  for (let i = showLeft; i <= showRight; i++) {
    if (i !== 1 && i !== total) out.push(i);
  }
  if (showRight < total - 1) out.push('…');
  out.push(total);
  return out;
}

function pluralizePatterns(n: number): string {
  const lastTwo = n % 100;
  const last = n % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return 'паттернов';
  if (last === 1) return 'паттерн';
  if (last >= 2 && last <= 4) return 'паттерна';
  return 'паттернов';
}
