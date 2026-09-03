'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CloudOff,
  AlertTriangle,
  Loader2,
  Check,
  ShoppingBag,
  ChevronLeft,
} from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type ErrorEmptyStateConfig = {
  icon?: string;
  title?: string;
  body?: string;
  retryLabel?: string;
};

type Status = 'error' | 'loading' | 'success';

const LOADED_ITEMS = [
  { name: 'Кроссовки Air Max', subtitle: 'Кроссовки · 42 размер', price: '8 990 ₽', color: 'bg-amber-100 dark:bg-amber-900/40' },
  { name: 'Худи оверсайз', subtitle: 'Одежда · M', price: '3 490 ₽', color: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { name: 'Кепка логотип', subtitle: 'Аксессуары · OS', price: '1 290 ₽', color: 'bg-rose-100 dark:bg-rose-900/40' },
];

/** Render the requested lucide icon (or fallback CloudOff). Returns JSX, not a component type. */
function renderIcon(name: string | undefined, className: string) {
  switch (name) {
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'CloudOff':
    default:
      return <CloudOff className={className} />;
  }
}

/**
 * ErrorEmptyStateMockup — full-screen error state (red-tinted icon),
 * retry CTA → success (60%) / failure (40%) with more specific message.
 */
export function ErrorEmptyStateMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as ErrorEmptyStateConfig;
  const title = (typeof cfg.title === 'string' && cfg.title) || 'Не удалось загрузить';
  const body =
    (typeof cfg.body === 'string' && cfg.body) ||
    'Что-то пошло не так. Проверьте интернет и попробуйте снова.';
  const retryLabel = (typeof cfg.retryLabel === 'string' && cfg.retryLabel) || 'Повторить';
  const iconName = typeof cfg.icon === 'string' ? cfg.icon : 'CloudOff';

  const [status, setStatus] = useState<Status>('error');
  const [specificError, setSpecificError] = useState(false);
  const loadTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (loadTimer.current) window.clearTimeout(loadTimer.current);
    },
    [],
  );

  function handleRetry() {
    if (status === 'loading') return;
    setStatus('loading');
    setSpecificError(false);

    loadTimer.current = window.setTimeout(() => {
      // 60% success, 40% failure
      if (Math.random() < 0.6) {
        setStatus('success');
      } else {
        setStatus('error');
        setSpecificError(true);
      }
    }, 1500);
  }

  function reset() {
    setStatus('error');
    setSpecificError(false);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Каталог"
        left={
          status === 'success' ? (
            <button
              type="button"
              onClick={reset}
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

      {status !== 'success' && (
        <div className="flex h-[calc(100%-2.75rem)] flex-col items-center justify-center px-6 text-center">
          {/* Red-tinted icon circle (distinct from emerald "no-data" empty state) */}
          <div className="relative mb-5">
            <div className="absolute inset-0 -z-10 rounded-full bg-red-400/20 blur-2xl" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              {status === 'loading' ? (
                <Loader2 className="h-9 w-9 animate-spin text-red-600 dark:text-red-400" />
              ) : (
                renderIcon(iconName, 'h-9 w-9 text-red-600 dark:text-red-400')
              )}
            </div>
          </div>

          <h1 className="text-[16px] font-bold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 max-w-[230px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {specificError
              ? 'Сервер недоступен. Попробуйте через минуту.'
              : body}
          </p>

          {/* Retry CTA */}
          <button
            type="button"
            onClick={handleRetry}
            disabled={status === 'loading'}
            className="mt-6 flex h-11 w-full max-w-[220px] items-center justify-center gap-2 rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-70"
          >
            {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === 'loading' ? retryLabel : retryLabel}
          </button>

          {/* Report problem link */}
          <button
            type="button"
            className="mt-3 text-[12px] font-medium text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
          >
            Сообщить о проблеме
          </button>
        </div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-[calc(100%-2.75rem)] overflow-y-auto p-3"
        >
          <div className="mb-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            <span className="text-[11px] font-semibold">Загружено</span>
          </div>
          <h2 className="mb-3 text-[14px] font-bold text-neutral-900 dark:text-white">
            Товары в наличии
          </h2>
          <div className="space-y-2">
            {LOADED_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900"
              >
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                    item.color,
                  )}
                >
                  <ShoppingBag className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                    {item.name}
                  </div>
                  <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                    {item.subtitle}
                  </div>
                </div>
                <div className="text-[13px] font-bold text-neutral-900 dark:text-white">
                  {item.price}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-3 z-30 px-3"
          >
            <div className="rounded-xl bg-neutral-900/95 px-3 py-2 text-center text-[11px] font-medium text-white shadow-lg dark:bg-neutral-800/95">
              Повторная попытка…
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
