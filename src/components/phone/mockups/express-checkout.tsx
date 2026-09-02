'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Check, ScanFace, CreditCard, Lock } from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
} from './_shared';
import { cn } from '@/lib/utils';

type Item = { name: string; price: string };

type ExpressCheckoutConfig = {
  items?: Item[];
  total?: string;
};

const DEFAULT_ITEMS: Item[] = [
  { name: 'Кроссовки Nike Air Max', price: '8 990 ₽' },
  { name: 'Носки спортивные x3', price: '690 ₽' },
];

/**
 * ExpressCheckoutMockup — корзина с быстрым оформлением через Apple Pay.
 * Главная кнопка (Apple Pay) — чёрная, на всю ширину. Под ней — обычное оформление.
 */
export function ExpressCheckoutMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as ExpressCheckoutConfig;
  const items = cfg.items ?? DEFAULT_ITEMS;
  const total = cfg.total ?? '9 680 ₽';

  const [payState, setPayState] = useState<'idle' | 'auth' | 'success'>('idle');

  function startApplePay() {
    if (payState !== 'idle') return;
    setPayState('auth');
    // имитируем Face ID → успех
    window.setTimeout(() => setPayState('success'), 1300);
    window.setTimeout(() => setPayState('idle'), 3200);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Корзина"
        left={<ChevronLeft className="h-4 w-4" />}
      />

      {/* Список товаров */}
      <div className="px-4 pb-40 pt-3">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
          Товары · {items.length}
        </div>
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-neutral-900">
          {items.map((it, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center justify-between px-3 py-3',
                i > 0 && 'border-t border-neutral-100 dark:border-neutral-800',
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-[10px] font-medium text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
                  {i + 1}
                </div>
                <div className="text-[13px] font-medium text-neutral-900 dark:text-white">
                  {it.name}
                </div>
              </div>
              <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                {it.price}
              </div>
            </div>
          ))}
        </div>

        {/* Сводка */}
        <div className="mt-3 space-y-1.5 px-1 text-[12px]">
          <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
            <span>Доставка</span>
            <span className="text-emerald-600 dark:text-emerald-400">Бесплатно</span>
          </div>
          <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
            <span>Сервисный сбор</span>
            <span>0 ₽</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2 dark:border-neutral-800">
            <span className="text-[14px] font-semibold text-neutral-900 dark:text-white">
              Итого
            </span>
            <span className="text-[18px] font-bold text-neutral-900 dark:text-white">
              {total}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <PhoneBottomBar>
        <div className="space-y-2">
          {/* Apple Pay — primary, dark, full width */}
          <button
            type="button"
            onClick={startApplePay}
            disabled={payState !== 'idle'}
            aria-label="Оплатить через Apple Pay"
            className={cn(
              'flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-white shadow-md transition-all',
              'hover:brightness-110 active:scale-[0.98] disabled:opacity-60',
              'dark:bg-white dark:text-black',
            )}
          >
            {/* Apple logo (svg, monochrome) */}
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
              <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.806-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.99-.99-3.805-.99-1.81 0-2.386 1.02-3.82 1.02-1.43 0-2.45-1.31-3.51-2.94-1.27-1.92-2.23-4.89-2.23-7.7 0-4.46 2.91-6.84 5.79-6.84 1.52 0 2.79 1 3.74 1 .93 0 2.32-1.04 4.02-1.04.7 0 2.81.06 4.32 2.06-.11.07-2.6 1.52-2.6 4.55 0 3.61 3.16 4.83 3.27 4.88z" />
            </svg>
            <span className="text-[15px] font-semibold">Pay</span>
          </button>

          {/* Secondary link: enter card */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Ввести карту
          </button>
        </div>
      </PhoneBottomBar>

      {/* Apple Pay sheet */}
      <AnimatePresence>
        {payState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end bg-black/50 backdrop-blur-[2px]"
            onClick={() => payState === 'success' && setPayState('idle')}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="w-full rounded-t-[1.5rem] bg-neutral-900 p-5 text-white dark:bg-neutral-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
              <div className="mb-4 flex items-center justify-between">
                <div className="text-[12px] font-medium text-white/60">Оплата</div>
                <div className="text-[14px] font-semibold">{total}</div>
              </div>

              {payState === 'auth' ? (
                <div className="flex flex-col items-center pb-6 pt-3">
                  {/* Face ID icon */}
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1, repeat: 2 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10"
                  >
                    <ScanFace className="h-9 w-9 text-emerald-400" />
                  </motion.div>
                  <div className="mt-3 text-[13px] text-white/70">
                    Посмотрите в экран, чтобы подтвердить
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 280 }}
                  className="flex flex-col items-center pb-6 pt-3"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                    <Check className="h-9 w-9 text-emerald-400" strokeWidth={3} />
                  </div>
                  <div className="mt-3 text-[15px] font-semibold text-emerald-400">
                    Оплачено
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-white/50">
                    <Lock className="h-3 w-3" />
                    Чек отправлен на почту
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
