'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Check, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { MockupScreen, PhoneNavBar, PhoneBottomBar } from './_shared';
import { cn } from '@/lib/utils';

type FacetOption = { label: string; count: number };
type Facet = { name: string; options: FacetOption[] };

type Cfg = {
  facets?: Facet[];
};

const DEFAULT_FACETS: Facet[] = [
  {
    name: 'Категория',
    options: [
      { label: 'Кроссовки', count: 86 },
      { label: 'Кеды', count: 42 },
      { label: 'Ботинки', count: 31 },
    ],
  },
  {
    name: 'Бренд',
    options: [
      { label: 'Nike', count: 54 },
      { label: 'Adidas', count: 38 },
      { label: 'Puma', count: 19 },
    ],
  },
  {
    name: 'Размер',
    options: [
      { label: '38–40', count: 27 },
      { label: '41–43', count: 64 },
      { label: '44–46', count: 18 },
    ],
  },
];

/**
 * ProductFilterFacetsMockup — bottom sheet with sections (Категория, Бренд,
 * Размер). Each option shows label + count badge. Tapping toggles emerald
 * check. Counts update dynamically when other facets selected (simulated by
 * reducing counts proportionally). Bottom: "Применить (N товаров)" with live
 * count + "Сбросить" link.
 */
export function ProductFilterFacetsMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const facets =
    Array.isArray(cfg.facets) && cfg.facets.length > 0 ? (cfg.facets as Facet[]) : DEFAULT_FACETS;

  // Selection per facet: facetName -> Set<label>
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});
  const [appliedCount, setAppliedCount] = useState(234);
  const [justApplied, setJustApplied] = useState(false);

  const totalSelected = useMemo(
    () => Object.values(selected).reduce((acc, set) => acc + set.size, 0),
    [selected],
  );

  // Live count: simulate reduction as user selects options.
  const liveCount = useMemo(() => {
    if (totalSelected === 0) return 234;
    // each selection reduces ~25%, with floor at 12.
    const factor = Math.pow(0.72, totalSelected);
    return Math.max(12, Math.round(234 * factor));
  }, [totalSelected]);

  function toggle(facetName: string, label: string) {
    setSelected((prev) => {
      const next = { ...prev };
      const set = new Set(next[facetName] ?? []);
      if (set.has(label)) set.delete(label);
      else set.add(label);
      if (set.size === 0) delete next[facetName];
      else next[facetName] = set;
      return next;
    });
  }

  function reset() {
    setSelected({});
  }

  function apply() {
    setAppliedCount(liveCount);
    setJustApplied(true);
    window.setTimeout(() => setJustApplied(false), 900);
  }

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Фильтры" left={<ChevronLeft className="h-4 w-4" />} />

      {/* Trigger + summary header */}
      <div className="border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
            <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-400" />
            Подбор по параметрам
          </div>
          {totalSelected > 0 && (
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <RotateCcw className="h-3 w-3" />
              Сбросить
            </button>
          )}
        </div>
        <div className="mt-1 text-[11px] text-neutral-400">
          Выбрано: <span className="font-semibold text-neutral-600 dark:text-neutral-300">{totalSelected}</span>
          {appliedCount !== liveCount && (
            <span className="ml-1 text-emerald-600 dark:text-emerald-400">· обновится после применения</span>
          )}
        </div>
      </div>

      {/* Facet sections (the sheet body, rendered inline as the main scrollable content) */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 pt-2">
        {facets.map((facet, fi) => {
          const sel = selected[facet.name] ?? new Set<string>();
          return (
            <div key={facet.name} className={cn(fi > 0 && 'mt-3')}>
              <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {facet.name}
              </div>
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                {facet.options.map((opt, oi) => {
                  const isSel = sel.has(opt.label);
                  // reduce count dynamically if other options selected
                  const otherSelCount = totalSelected - sel.size;
                  const dynCount = isSel
                    ? opt.count
                    : Math.max(0, Math.round(opt.count * Math.pow(0.78, otherSelCount)));
                  const disabled = !isSel && dynCount === 0;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      disabled={disabled}
                      onClick={() => toggle(facet.name, opt.label)}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors',
                        oi > 0 && 'border-t border-neutral-100 dark:border-neutral-800',
                        disabled && 'opacity-40',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all',
                          isSel
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-neutral-300 dark:border-neutral-600',
                        )}
                      >
                        {isSel && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                      </span>
                      <span
                        className={cn(
                          'flex-1 text-[12px] transition-colors',
                          isSel
                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                            : 'text-neutral-700 dark:text-neutral-200',
                        )}
                      >
                        {opt.label}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums transition-colors',
                          isSel
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
                        )}
                      >
                        {dynCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <PhoneBottomBar>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={totalSelected === 0}
            className="h-11 flex-1 rounded-full border border-neutral-200 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-40 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Сбросить
          </button>
          <button
            type="button"
            onClick={apply}
            className={cn(
              'relative h-11 flex-[2] overflow-hidden rounded-full text-[13px] font-semibold text-white shadow-sm transition-colors',
              justApplied ? 'bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800',
            )}
          >
            <AnimatePresence>
              {justApplied && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
            Применить ({liveCount} товаров)
          </button>
        </div>
      </PhoneBottomBar>

      {/* "X" close handle (top right) — decorative for sheet semantics */}
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute right-2 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </MockupScreen>
  );
}
