'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, Heart, ShoppingCart, Check, X } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Highlight = {
  target: string;
  label: string;
  body: string;
};

type Cfg = {
  highlights?: Highlight[];
};

const DEFAULTS: Highlight[] = [
  {
    target: 'search',
    label: 'Поиск товаров',
    body: 'Найдите нужный товар по названию или артикулу за пару секунд.',
  },
  {
    target: 'filter',
    label: 'Фильтры',
    body: 'Сузьте список по цене, бренду и наличию в магазине.',
  },
  {
    target: 'favorite',
    label: 'Избранное',
    body: 'Сохраняйте понравившиеся товары, чтобы вернуться к ним позже.',
  },
  {
    target: 'cart',
    label: 'Корзина',
    body: 'Оформите заказ в один клик — доставка уже завтра.',
  },
];

type Product = {
  id: number;
  title: string;
  price: string;
  color: string;
  fav?: boolean;
};

const PRODUCTS: Product[] = [
  { id: 1, title: 'Кроссовки Air', price: '8 990 ₽', color: 'bg-emerald-100 dark:bg-emerald-900/40', fav: true },
  { id: 2, title: 'Куртка', price: '12 500 ₽', color: 'bg-amber-100 dark:bg-amber-900/40' },
  { id: 3, title: 'Рюкзак', price: '3 200 ₽', color: 'bg-rose-100 dark:bg-rose-900/40' },
  { id: 4, title: 'Часы', price: '15 900 ₽', color: 'bg-teal-100 dark:bg-teal-900/40' },
];

/**
 * ProgressiveOnboardingMockup — faux catalog app with pulsing coach marks.
 * The pulsing emerald ring + dimmed backdrop "points" to one UI element at a time.
 * A tooltip card sits at the bottom of the screen with label, body, and a "Понятно" button.
 */
export function ProgressiveOnboardingMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const highlights =
    Array.isArray(cfg.highlights) && cfg.highlights.length > 0
      ? (cfg.highlights as Highlight[])
      : DEFAULTS;

  const [index, setIndex] = useState(0); // -1 means "done"
  const [celebrate, setCelebrate] = useState(false);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const activeTarget = index >= 0 && index < highlights.length ? highlights[index].target : null;

  function next() {
    setIndex((cur) => {
      if (cur < 0) return cur;
      const nxt = cur + 1;
      if (nxt >= highlights.length) {
        // show celebration toast
        setCelebrate(true);
        toastTimer.current = window.setTimeout(() => setCelebrate(false), 2800);
        return -1;
      }
      return nxt;
    });
  }

  function restart() {
    setIndex(0);
    setCelebrate(false);
  }

  // Wrap a child element with a highlight ring when it's the active target.
  function targetWrap(key: string, children: React.ReactNode) {
    const active = activeTarget === key;
    return (
      <div className={cn('relative', active && 'z-40')}>
        {active && (
          <span
            className="pointer-events-none absolute -inset-1.5 rounded-xl ring-2 ring-emerald-500"
            style={{ animation: 'poPulse 1.4s ease-in-out infinite' }}
          />
        )}
        {children}
      </div>
    );
  }

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Каталог товаров" />

      {/* Search row */}
      <div className="px-3 pt-3">
        {targetWrap(
          'search',
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              readOnly
              placeholder="Найти товар"
              className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-8 pr-3 text-[12px] text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
            />
          </div>,
        )}
      </div>

      {/* Quick filters row */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto px-3 pb-1 no-scrollbar">
        {targetWrap(
          'filter',
          <button
            type="button"
            className="flex h-8 shrink-0 items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 text-[11px] font-medium text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200"
          >
            <SlidersHorizontal className="h-3 w-3" />
            Все фильтры
          </button>,
        )}
        {['Со скидкой', 'В наличии', 'Новинки'].map((chip) => (
          <span
            key={chip}
            className="flex h-8 shrink-0 items-center rounded-full border border-neutral-200 bg-white px-3 text-[11px] font-medium text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400"
          >
            {chip}
          </span>
        ))}
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="grid grid-cols-2 gap-2.5">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className={cn('relative h-16', p.color)}>
                {p.fav &&
                  targetWrap(
                    'favorite',
                    <button
                      type="button"
                      aria-label="В избранное"
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm dark:bg-neutral-900/90"
                    >
                      <Heart className="h-3.5 w-3.5 fill-rose-500" />
                    </button>,
                  )}
              </div>
              <div className="p-2">
                <div className="truncate text-[11px] font-medium text-neutral-900 dark:text-white">
                  {p.title}
                </div>
                <div className="mt-0.5 text-[12px] font-semibold text-neutral-900 dark:text-white">
                  {p.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav with cart */}
      <div className="relative flex h-14 items-center justify-around border-t border-neutral-100 bg-white px-3 dark:border-neutral-800 dark:bg-neutral-900">
        {targetWrap(
          'cart',
          <button
            type="button"
            aria-label="Корзина"
            className="relative flex flex-col items-center gap-0.5 text-neutral-700 dark:text-neutral-200"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="text-[10px] font-medium">Корзина</span>
            <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
              2
            </span>
          </button>,
        )}
        <button
          type="button"
          className="flex flex-col items-center gap-0.5 text-neutral-400 dark:text-neutral-500"
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] font-medium">Каталог</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center gap-0.5 text-neutral-400 dark:text-neutral-500"
        >
          <Heart className="h-5 w-5" />
          <span className="text-[10px] font-medium">Избранное</span>
        </button>
      </div>

      {/* Dim backdrop when coach mark is active */}
      <AnimatePresence>
        {activeTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-30 bg-black/55"
          />
        )}
      </AnimatePresence>

      {/* Tooltip card */}
      <AnimatePresence>
        {activeTarget && (
          <motion.div
            key={activeTarget}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="absolute inset-x-3 z-40"
            style={{
              bottom:
                activeTarget === 'cart' ? 70 : activeTarget === 'favorite' ? 200 : 130,
            }}
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-emerald-500/30 dark:bg-neutral-900 dark:ring-emerald-500/40">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 dark:bg-emerald-950/50">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {highlights[index].label}
                </span>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Пропустить подсказку"
                  className="ml-auto text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {highlights[index].body}
                </p>
                <button
                  type="button"
                  onClick={next}
                  className="mt-2.5 h-8 w-full rounded-full bg-emerald-600 text-[12px] font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800"
                >
                  Понятно
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration toast */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute inset-x-3 top-10 z-50"
          >
            <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-white shadow-xl">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="text-[12px] font-semibold">Готово! Вы освоили каталог.</span>
              <button
                type="button"
                onClick={restart}
                className="ml-auto text-[11px] font-medium text-white/80 hover:text-white"
              >
                Повторить
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes poPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.15);
          }
        }
      `}</style>
    </MockupScreen>
  );
}
