'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus, ShoppingBag, Check, AlertTriangle } from 'lucide-react';
import { MockupScreen, PhoneNavBar, PhoneBottomBar } from './_shared';
import { cn } from '@/lib/utils';

type QuantityStepperConfig = {
  min?: number;
  max?: number;
  current?: number;
  stock?: number;
  stockLabel?: string;
  price?: string;
};

/**
 * QuantityStepperMockup — степпер количества товара с учётом остатков.
 * «+» блокируется при достижении максимума (показывается тултип «Максимум»).
 * Если остаток < 5 — показывается amber-предупреждение «Осталось мало!».
 */
export function QuantityStepperMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as QuantityStepperConfig;
  const min = typeof cfg.min === 'number' ? cfg.min : 1;
  const max = typeof cfg.max === 'number' ? cfg.max : 7;
  const stock = typeof cfg.stock === 'number' ? cfg.stock : 7;
  const stockLabel = cfg.stockLabel ?? `В наличии: ${stock} шт`;
  const price = cfg.price ?? '8 990 ₽';

  const [qty, setQty] = useState(
    Math.min(Math.max(typeof cfg.current === 'number' ? cfg.current : 1, min), max),
  );
  const [showMaxHint, setShowMaxHint] = useState(false);
  const [added, setAdded] = useState(false);

  const atMax = qty >= max;
  const atMin = qty <= min;
  const lowStock = stock > 0 && stock < 5;

  function inc() {
    if (atMax) {
      setShowMaxHint(true);
      window.setTimeout(() => setShowMaxHint(false), 1800);
      return;
    }
    setQty((q) => Math.min(max, q + 1));
  }
  function dec() {
    if (atMin) return;
    setQty((q) => Math.max(min, q - 1));
  }
  function add() {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  // Total price rough estimate
  const unitNumeric = parseInt(price.replace(/\D/g, ''), 10) || 8990;
  const totalStr = `${(unitNumeric * qty).toLocaleString('ru-RU')} ₽`;

  return (
    <MockupScreen className="relative bg-white dark:bg-neutral-950">
      <PhoneNavBar title="Товар" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="flex h-[calc(100%-7rem)] flex-col px-4 pb-3">
        {/* Product summary */}
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-950">
            <ShoppingBag className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
              Бутылка для воды Steel 750 мл
            </div>
            <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
              Цвет: графит
            </div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-bold text-neutral-900 dark:text-white">
              {price}
            </div>
          </div>
        </div>

        {/* Stock indicator */}
        <div className="mt-3 flex items-center gap-1.5 text-[12px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-medium text-emerald-700 dark:text-emerald-400">
            {stockLabel}
          </span>
        </div>

        {/* Low stock urgency hint */}
        <AnimatePresence>
          {lowStock && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Осталось мало! Успейте заказать.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quantity stepper */}
        <div className="mt-4">
          <div className="mb-2 text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
            Количество
          </div>
          <div className="relative flex items-center">
            <div className="flex items-center rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-900">
              <button
                type="button"
                onClick={dec}
                disabled={atMin}
                aria-label="Уменьшить"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                  atMin
                    ? 'text-neutral-300 dark:text-neutral-600'
                    : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
                )}
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="min-w-[3rem] text-center text-[16px] font-bold tabular-nums text-neutral-900 dark:text-white">
                {qty}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={inc}
                  aria-label="Увеличить"
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full transition-colors',
                    atMax
                      ? 'cursor-not-allowed text-neutral-300 dark:text-neutral-600'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800',
                  )}
                >
                  <Plus className="h-4 w-4" />
                </button>
                {/* Max tooltip */}
                <AnimatePresence>
                  {showMaxHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-11 z-20 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg dark:bg-neutral-700"
                    >
                      Максимум: {max}
                      <span className="absolute -top-1 right-3 h-2 w-2 rotate-45 bg-neutral-900 dark:bg-neutral-700" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="ml-3 text-[11px] text-neutral-400 dark:text-neutral-500">
              max {max} шт / заказ
            </div>
          </div>
        </div>

        {/* Live total */}
        <div className="mt-4 rounded-2xl bg-neutral-50 p-3 dark:bg-neutral-900">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-neutral-500 dark:text-neutral-400">
              {qty} × {price}
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {totalStr}
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between border-t border-neutral-200 pt-1.5 text-[13px] dark:border-neutral-800">
            <span className="font-semibold text-neutral-900 dark:text-white">
              Сумма
            </span>
            <span className="text-[16px] font-bold text-emerald-600 dark:text-emerald-400">
              {totalStr}
            </span>
          </div>
        </div>
      </div>

      <PhoneBottomBar>
        <button
          type="button"
          onClick={add}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} />
              В корзине
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              В корзину · {totalStr}
            </>
          )}
        </button>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
