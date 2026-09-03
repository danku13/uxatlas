'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Bell, X, Tag, ShoppingBag, Check } from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
} from './_shared';
import { cn } from '@/lib/utils';

type Item = { name: string; price: string };

type AbandonedCartRecoveryConfig = {
  notification?: {
    title: string;
    body: string;
    cta: string;
    discount?: string;
  };
  items?: Item[];
};

const DEFAULT_NOTIF = {
  title: 'Вы забыли корзину 👜',
  body: 'Товары вас ждут. Дарим скидку 10% на оформление сегодня.',
  cta: 'Вернуться к корзине',
  discount: '−10%',
};

const DEFAULT_ITEMS: Item[] = [
  { name: 'Кроссовки Nike Air Max', price: '8 990 ₽' },
  { name: 'Носки спортивные x3', price: '690 ₽' },
];

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

/**
 * AbandonedCartRecoveryMockup — push notification → recovery flow.
 * На входе пуш свайпается сверху с заголовком/телом/CTA + скидкой.
 * Через 1.5 сек авто-закрывается. По тапу на CTA открывается чекаут
 * со списком товаров, таймером «Скидка истекает через 02:34:18» и кнопкой «Оформить».
 */
export function AbandonedCartRecoveryMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as AbandonedCartRecoveryConfig;
  const notif = { ...DEFAULT_NOTIF, ...(cfg.notification ?? {}) };
  const items = Array.isArray(cfg.items) && cfg.items.length > 0 ? cfg.items : DEFAULT_ITEMS;

  type View = 'feed' | 'cart' | 'success';
  const [view, setView] = useState<View>('feed');
  const [notifOpen, setNotifOpen] = useState(true);

  // Countdown: start at 02:34:18 (9258 seconds)
  const TOTAL_SECONDS = 2 * 3600 + 34 * 60 + 18;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const intervalRef = useRef<number | null>(null);

  // Auto-dismiss notification after 1.5 sec
  useEffect(() => {
    if (!notifOpen) return;
    const t = window.setTimeout(() => setNotifOpen(false), 1500);
    return () => window.clearTimeout(t);
  }, [notifOpen]);

  // Tick the countdown
  useEffect(() => {
    if (view !== 'cart') return;
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [view]);

  function openCart() {
    setNotifOpen(false);
    setView('cart');
  }

  const hh = pad2(Math.floor(secondsLeft / 3600));
  const mm = pad2(Math.floor((secondsLeft % 3600) / 60));
  const ss = pad2(secondsLeft % 60);

  const subtotal = items.reduce((acc, it) => acc + parseInt(it.price.replace(/\D/g, ''), 10) || 0, 0);
  const discount = Math.round(subtotal * 0.1);
  const total = subtotal - discount;

  function fmt(n: number) {
    return `${n.toLocaleString('ru-RU')} ₽`;
  }

  if (view === 'success') {
    return (
      <MockupScreen className="flex flex-col items-center justify-center bg-white px-6 text-center dark:bg-neutral-950">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 280 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-emerald-100/60 dark:bg-emerald-950 dark:ring-emerald-900/50"
        >
          <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
        </motion.div>
        <h2 className="mt-6 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Корзина восстановлена!
        </h2>
        <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Скидка −10% применена. Заказ оформлен.
        </p>
        <button
          type="button"
          onClick={() => {
            setView('feed');
            setNotifOpen(true);
            setSecondsLeft(TOTAL_SECONDS);
          }}
          className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
        >
          Показать ещё раз
        </button>
      </MockupScreen>
    );
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title={view === 'cart' ? 'Корзина' : 'Лента'}
        left={
          view === 'cart' ? (
            <button
              type="button"
              onClick={() => setView('feed')}
              className="flex items-center"
              aria-label="Назад"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )
        }
        right={
          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            aria-label="Показать уведомление"
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-950" />
          </button>
        }
      />

      {view === 'feed' && (
        <div className="p-3">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
                <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
            Тапните на колокольчик ↑, чтобы увидеть пуш снова
          </div>
        </div>
      )}

      {view === 'cart' && (
        <div className="px-4 pb-40 pt-3">
          {/* Discount countdown */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex items-center gap-2 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-3 dark:from-amber-950/40 dark:to-amber-900/20"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm">
              <Tag className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                Скидка −10% применена
              </div>
              <div className="text-[10px] text-amber-700 dark:text-amber-400">
                Скидка истекает через
              </div>
            </div>
            <div className="font-mono text-[14px] font-bold tabular-nums text-amber-800 dark:text-amber-300">
              {hh}:{mm}:{ss}
            </div>
          </motion.div>

          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
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
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <ShoppingBag className="h-4 w-4" />
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

          {/* Summary */}
          <div className="mt-3 space-y-1.5 px-1 text-[12px]">
            <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
              <span>Подытог</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Скидка</span>
              <span>−{fmt(discount)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-neutral-200 pt-2 dark:border-neutral-800">
              <span className="text-[14px] font-semibold text-neutral-900 dark:text-white">Итого</span>
              <span className="text-[18px] font-bold text-neutral-900 dark:text-white">{fmt(total)}</span>
            </div>
          </div>
        </div>
      )}

      {view === 'cart' && (
        <PhoneBottomBar>
          <button
            type="button"
            onClick={() => setView('success')}
            className="h-12 w-full rounded-full bg-emerald-600 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            Оформить · {fmt(total)}
          </button>
        </PhoneBottomBar>
      )}

      {/* Push notification banner — slides from top */}
      <AnimatePresence>
        {notifOpen && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="absolute inset-x-0 top-0 z-40 p-2"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
              {/* App-style accent strip */}
              <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500" />

              <div className="flex items-start gap-2.5 pl-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-neutral-900 dark:text-white">
                      Маркетплейс
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500">· сейчас</span>
                  </div>
                  <div className="mt-0.5 text-[12px] font-semibold text-neutral-900 dark:text-white">
                    {notif.title}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                    {notif.body}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openCart}
                      className="h-8 flex-1 rounded-full bg-emerald-600 text-[11px] font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800"
                    >
                      {notif.cta}
                    </button>
                    {notif.discount && (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        {notif.discount}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setNotifOpen(false)}
                  aria-label="Закрыть уведомление"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
