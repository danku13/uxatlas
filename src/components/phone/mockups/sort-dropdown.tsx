'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Check, ArrowUpDown, CheckCircle2 } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Opt = { id: string; label: string };

type Cfg = {
  options?: Opt[];
  current?: string;
};

const DEFAULT_OPTIONS: Opt[] = [
  { id: 'popular', label: 'По популярности' },
  { id: 'price-asc', label: 'Сначала дешёвые' },
  { id: 'price-desc', label: 'Сначала дорогие' },
  { id: 'rating', label: 'По рейтингу' },
  { id: 'newest', label: 'Новинки' },
];

/**
 * SortDropdownMockup — a sort button showing the current sort; tapping opens
 * a dropdown sheet that slides up with 5 options. Each option is selectable
 * (emerald check on the selected one). Tap outside or "Готово" closes. On
 * select: brief "Сортировка обновлена" toast.
 */
export function SortDropdownMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const options =
    Array.isArray(cfg.options) && cfg.options.length > 0 ? (cfg.options as Opt[]) : DEFAULT_OPTIONS;
  const initial =
    typeof cfg.current === 'string' && options.some((o) => o.id === cfg.current)
      ? cfg.current
      : options[0].id;

  const [selected, setSelected] = useState<string>(initial);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastKey, setToastKey] = useState(0);
  const [pendingSel, setPendingSel] = useState<string | null>(null);

  function choose(opt: Opt) {
    setPendingSel(opt.id);
    window.setTimeout(() => {
      setSelected(opt.id);
      setPendingSel(null);
      setOpen(false);
      setToast(`Сортировка обновлена: ${opt.label}`);
      setToastKey((k) => k + 1);
      window.setTimeout(() => setToast(null), 2000);
    }, 180);
  }

  const selectedLabel = options.find((o) => o.id === selected)?.label ?? '—';

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Каталог" />

      {/* Catalog list faux header + sort row */}
      <div className="border-b border-neutral-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Найдено · 234
          </span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-xl border bg-white px-3 text-left transition-colors dark:bg-neutral-900',
            open
              ? 'border-emerald-400 ring-1 ring-emerald-500/30'
              : 'border-neutral-200 dark:border-neutral-800',
          )}
        >
          <span className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-[12px] text-neutral-400">Сортировка:</span>
            <span className="text-[12px] font-semibold text-neutral-900 dark:text-white">
              {selectedLabel}
            </span>
          </span>
          <ChevronDown
            className={cn(
              'h-4 w-4 text-neutral-400 transition-transform',
              open && 'rotate-180',
            )}
          />
        </button>
      </div>

      {/* Faux catalog rows (decorative) */}
      <div className="space-y-2 p-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-2.5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="h-12 w-12 shrink-0 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="h-2.5 w-3/4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
              <div className="h-2 w-1/2 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
            </div>
            <div className="h-3 w-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
          </div>
        ))}
      </div>

      {/* Dropdown sheet */}
      <AnimatePresence>
        {open && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.button
              type="button"
              aria-label="Закрыть"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="relative rounded-t-2xl bg-white px-4 pb-3 pt-3 dark:bg-neutral-900"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white">
                  Сортировка
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  Готово
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                {options.map((opt, i) => {
                  const isSel = selected === opt.id;
                  const isPending = pendingSel === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => choose(opt)}
                      className={cn(
                        'flex w-full items-center justify-between px-3 py-3 text-left transition-colors',
                        i > 0 && 'border-t border-neutral-100 dark:border-neutral-800',
                        isSel
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
                      )}
                    >
                      <span
                        className={cn(
                          'text-[13px] transition-colors',
                          isSel
                            ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                            : 'text-neutral-700 dark:text-neutral-200',
                        )}
                      >
                        {opt.label}
                      </span>
                      <AnimatePresence>
                        {(isSel || isPending) && (
                          <motion.span
                            key={`${opt.id}-${isPending ? 'p' : 's'}`}
                            initial={{ scale: 0.4, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.4, opacity: 0 }}
                            transition={{ type: 'spring', damping: 14, stiffness: 320 }}
                          >
                            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
                Выберите вариант сортировки списка товаров
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toastKey}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="absolute inset-x-3 bottom-3 z-50 flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2.5 text-white shadow-xl dark:bg-neutral-800"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/25">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </span>
            <span className="flex-1 text-[12px] font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
