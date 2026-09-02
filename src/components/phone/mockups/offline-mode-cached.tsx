'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff, RefreshCw, Check, AlertTriangle, CloudOff } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  lastUpdated?: string;
  items?: string[];
};

type Status = 'offline' | 'retrying' | 'online' | 'failed';

const SAMPLE_TIMES = ['2 минуты назад', '15 минут назад', '1 час назад', '3 часа назад'];

/**
 * OfflineModeCachedMockup — amber offline banner + cached feed.
 * "Повторить" runs a 1.5s spinner; ~70% success → green banner + remove badges,
 * ~30% failure → amber banner stays + sub-message.
 */
export function OfflineModeCachedMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const lastUpdated = cfg.lastUpdated ?? 'Обновлено 5 минут назад';
  const items =
    Array.isArray(cfg.items) && cfg.items.length > 0
      ? (cfg.items as string[])
      : [
          'Заказ #F4421 отправлен',
          'Скидка 10% на следующую покупку',
          'Сегодня 3 новых уведомления',
        ];

  const [status, setStatus] = useState<Status>('offline');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function retry() {
    if (status === 'retrying') return;
    setStatus('retrying');
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      // 70% success
      const success = Math.random() < 0.7;
      setStatus(success ? 'online' : 'failed');
      // Auto-revert to offline after a short delay if success, so the demo can be replayed
      if (success) {
        timerRef.current = window.setTimeout(() => setStatus('offline'), 3500);
      } else {
        timerRef.current = window.setTimeout(() => setStatus('offline'), 4500);
      }
    }, 1500);
  }

  const bannerConfig = {
    offline: {
      bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
      icon: <WifiOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      title: 'Нет соединения',
      sub: lastUpdated,
    },
    retrying: {
      bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
      icon: <RefreshCw className="h-4 w-4 animate-spin text-amber-600 dark:text-amber-400" />,
      title: 'Пытаемся подключиться…',
      sub: 'Проверяем соединение с сервером',
    },
    online: {
      bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900',
      icon: <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />,
      title: 'Соединение восстановлено',
      sub: 'Данные актуальны',
    },
    failed: {
      bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      title: 'Нет соединения',
      sub: 'Не удалось. Попробуйте позже',
    },
  }[status];

  const showOfflineBadge = status === 'offline' || status === 'retrying' || status === 'failed';

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Лента" />

      {/* Offline banner */}
      <div className="px-3 pt-3">
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-xl border px-3 py-2.5',
            bannerConfig.bg,
          )}
          style={{ animation: 'omFade 200ms ease both' }}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/60 dark:bg-black/20">
            {bannerConfig.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={cn(
                'text-[12px] font-semibold',
                status === 'online'
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : 'text-amber-700 dark:text-amber-400',
              )}
            >
              {bannerConfig.title}
            </div>
            <div className="text-[10px] text-amber-700/70 dark:text-amber-400/70">
              {bannerConfig.sub}
            </div>
          </div>
          {status !== 'retrying' && status !== 'online' && (
            <button
              type="button"
              onClick={retry}
              className="flex h-7 shrink-0 items-center gap-1 rounded-full bg-amber-600 px-2.5 text-[11px] font-semibold text-white hover:bg-amber-700"
            >
              <RefreshCw className="h-3 w-3" />
              Повторить
            </button>
          )}
        </div>
      </div>

      {/* Feed of cached items */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Кэш ленты
          </span>
          {showOfflineBadge ? (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
              <CloudOff className="h-2.5 w-2.5" />
              Офлайн
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Check className="h-2.5 w-2.5" />
              Синхронизировано
            </span>
          )}
        </div>

        <div className="space-y-2">
          {items.map((item, i) => (
            <motion.div
              key={`${item}-${i}`}
              layout
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                  <CloudOff className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-neutral-900 dark:text-white">
                    {item}
                  </div>
                  <div className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                    {SAMPLE_TIMES[i % SAMPLE_TIMES.length]}
                  </div>
                </div>
                <AnimatePresence>
                  {showOfflineBadge && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[8px] font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                    >
                      Кэш
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* End hint */}
        <div className="mt-4 text-center text-[10px] text-neutral-400 dark:text-neutral-600">
          {showOfflineBadge
            ? 'Показаны последние сохранённые данные'
            : 'Все данные актуальны'}
        </div>
      </div>

      <style jsx>{`
        @keyframes omFade {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </MockupScreen>
  );
}
