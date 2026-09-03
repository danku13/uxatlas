'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Star, SlidersHorizontal, Check, X, ChevronLeft } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type FilterSection = {
  name: string;
  options: string[];
};

type Cfg = {
  quickFilters?: string[];
  activeFilter?: string;
  fullFilters?: FilterSection[];
};

type Result = {
  id: number;
  title: string;
  price: string;
  rating: number;
  color: string;
};

const RESULTS: Result[] = [
  { id: 1, title: 'Кроссовки Air Max', price: '8 990 ₽', rating: 4.8, color: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { id: 2, title: 'Куртка зимняя', price: '12 500 ₽', rating: 4.6, color: 'bg-amber-100 dark:bg-amber-900/40' },
  { id: 3, title: 'Рюкзак городской', price: '3 200 ₽', rating: 4.9, color: 'bg-rose-100 dark:bg-rose-900/40' },
  { id: 4, title: 'Часы Smart', price: '15 900 ₽', rating: 4.4, color: 'bg-teal-100 dark:bg-teal-900/40' },
];

/**
 * SearchFiltersSheetMockup — catalog search with quick filter chips + a
 * bottom sheet containing radio-style options for each full filter section.
 */
export function SearchFiltersSheetMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const quickFilters =
    Array.isArray(cfg.quickFilters) && cfg.quickFilters.length > 0
      ? (cfg.quickFilters as string[])
      : ['Со скидкой', 'В наличии', 'Новинки', 'Топ продаж'];
  const initialActive =
    typeof cfg.activeFilter === 'string' && quickFilters.includes(cfg.activeFilter)
      ? cfg.activeFilter
      : quickFilters[0] ?? 'В наличии';
  const fullFilters =
    Array.isArray(cfg.fullFilters) && cfg.fullFilters.length > 0
      ? (cfg.fullFilters as FilterSection[])
      : [
          { name: 'Цена', options: ['До 1 000 ₽', '1 000–5 000 ₽', '5 000+ ₽'] },
          { name: 'Бренд', options: ['Apple', 'Samsung', 'Xiaomi'] },
          { name: 'Доставка', options: ['Завтра', 'За 2 дня', 'За неделю'] },
        ];

  const [activeChips, setActiveChips] = useState<string[]>([initialActive]);
  const [sheetOpen, setSheetOpen] = useState(false);
  // selections: section name -> option string | null
  const [selections, setSelections] = useState<Record<string, string | null>>({});
  const [appliedCount, setAppliedCount] = useState(0);
  const [successFlash, setSuccessFlash] = useState(false);

  function toggleChip(chip: string) {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    );
  }

  function applyFilters() {
    const count = Object.values(selections).filter(Boolean).length;
    setAppliedCount(count);
    setSheetOpen(false);
    setSuccessFlash(true);
    window.setTimeout(() => setSuccessFlash(false), 900);
  }

  function resetFilters() {
    setSelections({});
  }

  const totalApplied = activeChips.length + appliedCount;

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Поиск"
        left={<ChevronLeft className="h-4 w-4" />}
        right={
          totalApplied > 0 ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">
              {totalApplied}
            </span>
          ) : null
        }
      />

      {/* Search input */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Поиск товаров"
            className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-8 pr-3 text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Quick filter chips + "Все фильтры" button */}
      <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto px-3 pb-1 no-scrollbar">
        {quickFilters.map((chip) => {
          const active = activeChips.includes(chip);
          return (
            <button
              key={chip}
              type="button"
              onClick={() => toggleChip(chip)}
              className={cn(
                'flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[11px] font-medium transition-colors',
                active
                  ? 'bg-emerald-600 text-white'
                  : 'border border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300',
              )}
            >
              {active && <Check className="h-3 w-3" />}
              {chip}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex h-8 shrink-0 items-center gap-1 rounded-full bg-neutral-900 px-3 text-[11px] font-semibold text-white dark:bg-white dark:text-neutral-900"
        >
          <SlidersHorizontal className="h-3 w-3" />
          Все фильтры
        </button>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          Найдено · {RESULTS.length}
        </span>
        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">по популярности</span>
      </div>

      {/* Results list */}
      <div
        className={cn(
          'flex-1 overflow-y-auto px-3 pb-4 transition-colors',
          successFlash && 'bg-emerald-50/60 dark:bg-emerald-950/30',
        )}
      >
        <div className="space-y-2">
          {RESULTS.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-2.5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className={cn('h-12 w-12 shrink-0 rounded-lg', r.color)} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-medium text-neutral-900 dark:text-white">
                  {r.title}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{r.rating}</span>
                  <span className="text-neutral-300 dark:text-neutral-600">·</span>
                  <span>1 234 отзыва</span>
                </div>
              </div>
              <div className="text-[13px] font-bold text-neutral-900 dark:text-white">
                {r.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom sheet with full filters */}
      <AnimatePresence>
        {sheetOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.button
              type="button"
              aria-label="Закрыть фильтры"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="relative max-h-[80%] overflow-y-auto rounded-t-2xl bg-white px-4 pb-5 pt-3 dark:bg-neutral-900"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[16px] font-bold text-neutral-900 dark:text-white">Фильтры</h3>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Закрыть"
                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {fullFilters.map((section) => {
                  const sel = selections[section.name] ?? null;
                  return (
                    <div key={section.name}>
                      <div className="mb-1.5 text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
                        {section.name}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {section.options.map((opt) => {
                          const isSel = sel === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                setSelections((prev) => ({
                                  ...prev,
                                  [section.name]: isSel ? null : opt,
                                }))
                              }
                              className={cn(
                                'flex h-8 items-center gap-1 rounded-full border px-3 text-[11px] font-medium transition-colors',
                                isSel
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400'
                                  : 'border-neutral-200 bg-white text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300',
                              )}
                              aria-pressed={isSel}
                            >
                              {isSel && <Check className="h-3 w-3" />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-11 flex-1 rounded-full border border-neutral-200 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  Сбросить
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="h-11 flex-[2] rounded-full bg-emerald-600 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
                >
                  Применить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success flash */}
      <AnimatePresence>
        {successFlash && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="absolute inset-x-3 bottom-3 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-white shadow-xl"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span className="text-[12px] font-semibold">Фильтры применены</span>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
