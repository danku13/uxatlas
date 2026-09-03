'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ShoppingCart, Check, X } from 'lucide-react';
import { MockupScreen } from './_shared';
import { cn } from '@/lib/utils';

type Step = {
  target: string;
  title: string;
  body: string;
};

type Cfg = {
  steps?: Step[];
};

const DEFAULT_STEPS: Step[] = [
  {
    target: 'search',
    title: 'Поиск товаров',
    body: 'Введите название или артикул — мгновенные подсказки помогут найти нужное.',
  },
  {
    target: 'filter',
    title: 'Фильтры',
    body: 'Сужайте выборку по цене, бренду и характеристикам в один тап.',
  },
  {
    target: 'cart',
    title: 'Корзина',
    body: 'Здесь лежат выбранные товары — оформляйте заказ в пару кликов.',
  },
];

/** Spotlight rectangle for each target — coordinates are within the 280×580 phone. */
const TARGETS: Record<
  string,
  { top: number; left: number; width: number; height: number; tooltipTop: 'below' | 'above' }
> = {
  search: { top: 124, left: 16, width: 248, height: 44, tooltipTop: 'below' },
  filter: { top: 124, left: 16, width: 44, height: 44, tooltipTop: 'below' },
  cart: { top: 60, left: 230, width: 36, height: 36, tooltipTop: 'below' },
};

/**
 * FeatureTourOverlayMockup — faux app home screen with dark overlay
 * highlighting one element at a time. Tooltip card with title/body advances
 * through steps and ends with "Готово начать!" success.
 */
export function FeatureTourOverlayMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const steps = Array.isArray(cfg.steps) && cfg.steps.length > 0 ? cfg.steps : DEFAULT_STEPS;
  const total = steps.length;

  const [stepIdx, setStepIdx] = useState<number>(0);
  const [finished, setFinished] = useState(false);

  const advance = () => {
    if (stepIdx >= total - 1) {
      setFinished(true);
      return;
    }
    setStepIdx((i) => i + 1);
  };

  const skip = () => {
    setFinished(true);
  };

  if (finished) {
    return (
      <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
        <FauxHome dimmed={false} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 px-6 text-center"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 280 }}
            className="flex flex-col items-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-emerald-400/30">
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
            <h2 className="mt-6 text-[22px] font-bold tracking-tight text-white">
              Готово начать!
            </h2>
            <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-white/70">
              Теперь вы знаете, как пользоваться приложением. Удачных покупок!
            </p>
            <button
              type="button"
              onClick={() => {
                setFinished(false);
                setStepIdx(0);
              }}
              className="mt-6 rounded-full bg-emerald-600 px-5 py-2 text-[12px] font-semibold text-white hover:bg-emerald-700"
            >
              Повторить тур
            </button>
          </motion.div>
        </motion.div>
      </MockupScreen>
    );
  }

  const step = steps[stepIdx];
  const target = TARGETS[step.target] ?? TARGETS.search;
  const isLast = stepIdx === total - 1;

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      <FauxHome dimmed />

      {/* Dark overlay covering everything except the highlighted target.
          Achieved via 4 absolutely-positioned black panels around the hole. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {/* top strip */}
        <div className="absolute inset-x-0 top-0 bg-black/70" style={{ height: target.top }} />
        {/* bottom strip */}
        <div
          className="absolute inset-x-0 bottom-0 bg-black/70"
          style={{ top: target.top + target.height + 8 }}
        />
        {/* left strip */}
        <div
          className="absolute inset-y-0 left-0 bg-black/70"
          style={{ top: target.top, height: target.height + 8, width: target.left }}
        />
        {/* right strip */}
        <div
          className="absolute inset-y-0 right-0 bg-black/70"
          style={{
            top: target.top,
            height: target.height + 8,
            left: target.left + target.width + 8,
          }}
        />
        {/* Pulsing ring around the target */}
        <motion.div
          className="absolute rounded-xl border-2 border-emerald-400"
          style={{
            top: target.top - 4,
            left: target.left - 4,
            width: target.width + 8,
            height: target.height + 8,
          }}
          animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.55)', '0 0 0 8px rgba(16,185,129,0)'] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
        />
      </div>

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-3 right-3 z-30"
          style={{ top: target.top + target.height + 16 }}
        >
          <div className="rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Шаг {stepIdx + 1} из {total}
                </div>
                <h3 className="text-[14px] font-bold tracking-tight text-neutral-900 dark:text-white">
                  {step.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={skip}
                aria-label="Пропустить"
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {step.body}
            </p>
            <div className="mt-3 flex items-center justify-between">
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      i === stepIdx ? 'w-4 bg-emerald-500' : 'w-1.5 bg-neutral-300 dark:bg-neutral-700',
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={advance}
                className="rounded-full bg-emerald-600 px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-700"
              >
                {isLast ? 'Готово' : 'Далее'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Skip link at bottom */}
      <button
        type="button"
        onClick={skip}
        className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm hover:bg-white/20"
      >
        Пропустить тур
      </button>
    </MockupScreen>
  );
}

/** Faux app home screen — only used as a backdrop. */
function FauxHome({ dimmed }: { dimmed: boolean }) {
  return (
    <div className={cn('flex h-full w-full flex-col', dimmed && 'opacity-100')}>
      {/* Nav bar */}
      <div className="flex h-11 items-center justify-between border-b border-neutral-100 px-3 dark:border-neutral-800">
        <span className="text-[13px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Маркет
        </span>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <ShoppingCart className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
            <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
              3
            </span>
          </div>
        </div>
      </div>

      {/* Search bar + filter */}
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <div className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-[13px] text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">
            Поиск товаров
          </div>
        </div>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Hero banner */}
      <div className="px-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-3 text-white">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
            Скидки недели
          </div>
          <div className="mt-1 text-[18px] font-bold leading-tight">−30% на новинки</div>
          <div className="mt-1 text-[11px] text-white/80">До конца акции 2 дня</div>
        </div>
      </div>

      {/* Section title */}
      <div className="mt-4 flex items-center justify-between px-4">
        <span className="text-[13px] font-semibold text-neutral-900 dark:text-white">
          Популярное
        </span>
        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          Все
        </span>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-2 px-3 pt-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div
              className={cn(
                'h-20 w-full',
                i % 2 === 0 ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-amber-100 dark:bg-amber-950/30',
              )}
            />
            <div className="p-2">
              <div className="text-[11px] font-medium text-neutral-900 dark:text-white">
                {['Кроссовки', 'Куртка', 'Рюкзак', 'Шапка'][i]}
              </div>
              <div className="mt-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {['4 990 ₽', '8 490 ₽', '2 290 ₽', '990 ₽'][i]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
