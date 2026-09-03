'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, ChevronRight, Sparkles, Check } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type RecItem = { name: string; price: string };
type EmptyCartConfig = {
  title?: string;
  body?: string;
  cta?: string;
  recommendations?: RecItem[];
};

const DEFAULT_RECS: RecItem[] = [
  { name: 'Наушники AirBuds Pro', price: '6 990 ₽' },
  { name: 'Чехол кожаный', price: '1 490 ₽' },
  { name: 'Зарядка MagSafe', price: '2 290 ₽' },
  { name: 'Кабель USB-C 2м', price: '690 ₽' },
];

const REC_COLORS = [
  'bg-amber-100 dark:bg-amber-900/40',
  'bg-rose-100 dark:bg-rose-900/40',
  'bg-emerald-100 dark:bg-emerald-900/40',
  'bg-violet-100 dark:bg-violet-900/40',
];

/**
 * EmptyCartRecommendationsMockup — пустая корзина с CTA «Перейти в каталог»
 * и горизонтальной каруселью рекомендаций «Популярное сейчас».
 * Тап по карточке → toast «Добавлено в корзину».
 */
export function EmptyCartRecommendationsMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as EmptyCartConfig;
  const title = cfg.title ?? 'Ваша корзина пуста';
  const body = cfg.body ?? 'Самое время добавить что-то полезное — загляните в каталог.';
  const cta = cfg.cta ?? 'Перейти в каталог';
  const recs = cfg.recommendations ?? DEFAULT_RECS;

  const [toast, setToast] = useState<string | null>(null);
  const [addedIdx, setAddedIdx] = useState<number | null>(null);

  function addRec(i: number, name: string) {
    setAddedIdx(i);
    setToast(`«${name}» добавлено в корзину`);
    window.setTimeout(() => setToast(null), 2000);
    window.setTimeout(() => setAddedIdx(null), 2200);
  }

  return (
    <MockupScreen className="relative bg-white dark:bg-neutral-950">
      <PhoneNavBar title="Корзина" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto pb-6">
        {/* Empty hero */}
        <div className="flex flex-col items-center px-6 pt-8 text-center">
          {/* Large greyed cart icon */}
          <div className="relative mb-5">
            <div className="absolute inset-0 -z-10 rounded-full bg-neutral-100 blur-2xl dark:bg-neutral-900" />
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
              <ShoppingBag className="h-11 w-11 text-neutral-300 dark:text-neutral-700" strokeWidth={1.5} />
            </div>
            {/* decorative dots */}
            <div className="absolute -right-1 top-2 h-2 w-2 rounded-full bg-amber-300 dark:bg-amber-400" />
            <div className="absolute -left-2 top-9 h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500" />
            <div className="absolute -bottom-1 right-5 h-1 w-1 rounded-full bg-neutral-400" />
          </div>

          <h1 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {body}
          </p>

          <button
            type="button"
            onClick={() => {
              setToast('Каталог скоро откроется');
              window.setTimeout(() => setToast(null), 1800);
            }}
            className="mt-5 flex h-11 w-full max-w-[220px] items-center justify-center gap-2 rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            {cta}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Recommendations carousel */}
        <div className="mt-7">
          <div className="mb-2 flex items-center gap-1.5 px-4 text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Популярное сейчас
          </div>
          <div className="flex gap-2.5 overflow-x-auto px-4 pb-2">
            {recs.map((r, i) => {
              const added = addedIdx === i;
              return (
                <motion.button
                  type="button"
                  key={i}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addRec(i, r.name)}
                  className="flex w-32 shrink-0 flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white text-left shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  {/* image placeholder */}
                  <div
                    className={cn(
                      'flex h-20 items-center justify-center',
                      REC_COLORS[i % REC_COLORS.length],
                    )}
                  >
                    <ShoppingBag className="h-7 w-7 text-neutral-400 dark:text-neutral-500" strokeWidth={1.5} />
                  </div>
                  <div className="p-2">
                    <div className="line-clamp-2 text-[11px] font-medium leading-tight text-neutral-900 dark:text-white">
                      {r.name}
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[12px] font-bold text-neutral-900 dark:text-white">
                        {r.price}
                      </span>
                      <div
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full transition-colors',
                          added
                            ? 'bg-emerald-500'
                            : 'bg-neutral-100 dark:bg-neutral-800',
                        )}
                      >
                        {added ? (
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        ) : (
                          <span className="text-[14px] font-medium leading-none text-neutral-500 dark:text-neutral-400">
                            +
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
            {/* trailing spacer */}
            <div className="w-1 shrink-0" />
          </div>
        </div>

        {/* Recent activity tip */}
        <div className="mt-3 px-4">
          <div className="flex items-start gap-2 rounded-xl bg-neutral-50 px-3 py-2.5 text-[11px] leading-relaxed text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <Sparkles className="mt-px h-3 w-3 shrink-0 text-amber-500" />
            Совет: добавьте 2 товара и получите бесплатную доставку.
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-x-3 bottom-3 z-30"
          >
            <div className="flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2.5 text-white shadow-lg dark:bg-neutral-700">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </div>
              <span className="flex-1 text-[11px] font-medium">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
