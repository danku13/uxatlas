'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Info,
  Heart,
  Star,
} from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type ActionableEmptyConfig = {
  icon?: string;
  title?: string;
  body?: string;
  cta?: string;
};

/** Render the requested lucide icon (or fallback ShoppingBag). Returns JSX, not a component type. */
function renderIcon(name: string | undefined, className: string) {
  switch (name) {
    case 'Heart':
      return <Heart className={className} />;
    case 'Star':
      return <Star className={className} />;
    case 'Info':
      return <Info className={className} />;
    case 'ShoppingBag':
    default:
      return <ShoppingBag className={className} />;
  }
}

type View = 'empty' | 'catalog' | 'info';

const CATALOG_ITEMS = [
  { name: 'Кофейная чашка', price: '990 ₽', rating: 4.8, color: 'bg-amber-100 dark:bg-amber-900/40' },
  { name: 'Блокнот A5', price: '450 ₽', rating: 4.6, color: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { name: 'Ручка шариковая', price: '180 ₽', rating: 4.7, color: 'bg-rose-100 dark:bg-rose-900/40' },
];

/**
 * ActionableEmptyMockup — пустое состояние с CTA.
 * CTA → фейковый каталог. Вторичная ссылка → info-sheet снизу.
 */
export function ActionableEmptyMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as ActionableEmptyConfig;
  const title = cfg.title ?? 'Ваша корзина пуста';
  const body = cfg.body ?? 'Добавьте товары из каталога — они появятся здесь.';
  const cta = cfg.cta ?? 'Перейти в каталог';

  const [view, setView] = useState<View>('empty');

  return (
    <MockupScreen className="relative overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Корзина"
        left={
          view !== 'empty' ? (
            <button
              type="button"
              onClick={() => setView('empty')}
              aria-label="Назад"
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </button>
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )
        }
      />

      {/* Decorative dots pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          color: '#a3a3a3',
        }}
      />

      <div className="relative flex h-full flex-col items-center px-6 pt-10">
        {view === 'empty' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon in emerald circle */}
            <div className="relative mb-6">
              <div className="absolute inset-0 -z-10 rounded-full bg-emerald-400/30 blur-2xl" />
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                {renderIcon(cfg.icon, 'h-10 w-10 text-emerald-600 dark:text-emerald-400')}
              </div>
              {/* Decorative dots */}
              <div className="absolute -right-2 top-2 h-2 w-2 rounded-full bg-amber-300 dark:bg-amber-400" />
              <div className="absolute -left-3 top-8 h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500" />
              <div className="absolute -bottom-1 right-4 h-1 w-1 rounded-full bg-neutral-400" />
            </div>

            <h1 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {body}
            </p>

            <button
              type="button"
              onClick={() => setView('catalog')}
              className="mt-6 h-11 w-full max-w-[220px] rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
            >
              {cta}
            </button>

            <button
              type="button"
              onClick={() => setView('info')}
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <Info className="h-3.5 w-3.5" />
              Узнать, как это работает
            </button>
          </motion.div>
        )}

        {view === 'catalog' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <h1 className="mb-3 text-[16px] font-bold text-neutral-900 dark:text-white">
              Каталог
            </h1>
            <div className="space-y-2">
              {CATALOG_ITEMS.map((it, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900"
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl',
                      it.color,
                    )}
                  >
                    <ShoppingBag className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {it.name}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      {it.rating}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-neutral-900 dark:text-white">
                      {it.price}
                    </div>
                    <ChevronRight className="ml-auto h-4 w-4 text-neutral-400" />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 text-center text-[11px] text-neutral-400 dark:text-neutral-600">
              Нажмите «Назад» чтобы вернуться к пустому состоянию
            </div>
          </motion.div>
        )}
      </div>

      {/* Info bottom sheet */}
      <AnimatePresence>
        {view === 'info' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end bg-black/40"
            onClick={() => setView('empty')}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[1.5rem] bg-white p-5 dark:bg-neutral-900"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                  Как работает корзина
                </h2>
              </div>
              <p className="text-[12px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                Добавляйте товары из каталога — они будут ждать вас здесь до оформления заказа.
                Товары сохраняются даже если вы закроете приложение.
              </p>
              <button
                type="button"
                onClick={() => setView('empty')}
                className="mt-4 h-10 w-full rounded-full bg-neutral-100 text-[13px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                Понятно
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
