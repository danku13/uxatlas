'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Pause, Play, Check, X } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type InlineProgressPercentageConfig = {
  operation?: string;
  total?: number;
  current?: number;
};

type ConfirmState = 'open' | 'closed';

/**
 * InlineProgressPercentageMockup — circular progress + linear + pause/resume + cancel.
 * Auto-advance каждые 800ms на 1 шаг.
 */
export function InlineProgressPercentageMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as InlineProgressPercentageConfig;
  const operation =
    (typeof cfg.operation === 'string' && cfg.operation) || 'Загрузка фото';
  const total = Math.max(1, typeof cfg.total === 'number' ? cfg.total : 24);
  const initial = Math.min(
    total,
    Math.max(0, typeof cfg.current === 'number' ? cfg.current : 7),
  );

  const [current, setCurrent] = useState(initial);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(initial >= total);
  const [confirm, setConfirm] = useState<ConfirmState>('closed');
  const [cancelled, setCancelled] = useState(false);

  const intervalRef = useRef<number | null>(null);

  // Auto-advance: every 800ms increment current by 1, until reaching total
  useEffect(() => {
    if (paused || done || cancelled) return;
    intervalRef.current = window.setInterval(() => {
      setCurrent((prev) => {
        const next = prev + 1;
        if (next >= total) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          setDone(true);
          return total;
        }
        return next;
      });
    }, 800);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [paused, done, cancelled, total]);

  const pct = Math.round((current / total) * 100);
  const remaining = total - current;
  const etaSec = Math.max(0, Math.round(remaining * 0.75));

  // SVG ring params
  const ringSize = 132;
  const stroke = 10;
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  function handleCancel() {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setCancelled(true);
    setConfirm('closed');
  }

  function restart() {
    setCancelled(false);
    setDone(false);
    setPaused(false);
    setCurrent(0);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title={operation}
        left={<ChevronLeft className="h-4 w-4" />}
      />

      <div className="flex h-[calc(100%-2.75rem)] flex-col items-center px-5 pt-6 pb-4">
        {/* Circular progress ring */}
        <div className="relative" style={{ width: ringSize, height: ringSize }}>
          <svg
            width={ringSize}
            height={ringSize}
            viewBox={`0 0 ${ringSize} ${ringSize}`}
            className="-rotate-90"
          >
            {/* Track */}
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              className="stroke-neutral-200 dark:stroke-neutral-800"
            />
            {/* Progress */}
            <motion.circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={radius}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              className={cn(
                done
                  ? 'stroke-emerald-500'
                  : cancelled
                    ? 'stroke-red-400'
                    : 'stroke-emerald-500',
              )}
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {done ? (
              <>
                <Check className="h-9 w-9 text-emerald-500" strokeWidth={3} />
                <span className="mt-1 text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
                  Готово!
                </span>
              </>
            ) : cancelled ? (
              <>
                <X className="h-7 w-7 text-red-500" strokeWidth={3} />
                <span className="mt-1 text-[11px] font-semibold text-red-500">
                  Отменено
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
                  {pct}%
                </span>
                <span className="text-[10px] font-medium text-neutral-400">
                  {current} / {total}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Photo counter */}
        <div className="mt-5 text-center">
          <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
            {done
              ? `Загружено ${total} из ${total} фото`
              : `${current} из ${total} фото`}
          </div>
          {!done && !cancelled && (
            <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              ~{etaSec} сек осталось
            </div>
          )}
        </div>

        {/* Linear progress bar */}
        <div className="mt-5 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <motion.div
            className={cn(
              'h-full',
              done ? 'bg-emerald-500' : cancelled ? 'bg-red-400' : 'bg-emerald-500',
            )}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Controls */}
        <div className="mt-auto w-full max-w-[260px]">
          {!done && !cancelled ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 text-[13px] font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
              >
                {paused ? (
                  <>
                    <Play className="h-4 w-4" />
                    Продолжить
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4" />
                    Пауза
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setConfirm('open')}
                className="flex h-11 items-center justify-center rounded-full px-4 text-[13px] font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                Отмена
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={restart}
              className="h-11 w-full rounded-full bg-emerald-600 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              {done ? 'Загрузить ещё' : 'Начать заново'}
            </button>
          )}

          {/* Paused hint */}
          {paused && !done && !cancelled && (
            <div className="mt-2 text-center text-[10px] text-amber-600 dark:text-amber-400">
              Загрузка приостановлена
            </div>
          )}
        </div>
      </div>

      {/* Cancel confirm dialog */}
      <AnimatePresence>
        {confirm === 'open' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
            onClick={() => setConfirm('closed')}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[230px] rounded-2xl bg-white p-4 shadow-2xl dark:bg-neutral-900"
            >
              <h3 className="text-center text-[14px] font-bold text-neutral-900 dark:text-white">
                Отменить загрузку?
              </h3>
              <p className="mt-2 text-center text-[11px] text-neutral-500 dark:text-neutral-400">
                Загруженные фото будут сохранены, остальные отменятся.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="h-10 w-full rounded-full bg-red-500 text-[13px] font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Да, отменить
                </button>
                <button
                  type="button"
                  onClick={() => setConfirm('closed')}
                  className="h-10 w-full rounded-full bg-neutral-100 text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  Нет, продолжить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
