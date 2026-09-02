'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Check,
  Loader2,
  RotateCw,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type RetryWithStatusConfig = {
  errorMessage?: string;
  steps?: string[];
};

type Status = 'error' | 'retrying' | 'done' | 'feed';

const DEFAULT_STEPS = [
  'Подключение к серверу...',
  'Загрузка данных...',
  'Почти готово...',
];

const FEED_ITEMS = [
  { name: 'Заказ #1042', subtitle: 'Доставляется · сегодня', color: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { name: 'Заказ #1038', subtitle: 'Курьер в пути · 15 мин', color: 'bg-amber-100 dark:bg-amber-900/40' },
  { name: 'Заказ #1031', subtitle: 'Завершён · вчера', color: 'bg-rose-100 dark:bg-rose-900/40' },
];

/**
 * RetryWithStatusMockup — ошибка → ретрай с пошаговым статусом → лента.
 */
export function RetryWithStatusMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as RetryWithStatusConfig;
  const errorMessage =
    (typeof cfg.errorMessage === 'string' && cfg.errorMessage) ||
    'Не удалось загрузить данные. Проверьте подключение к интернету.';
  const steps = Array.isArray(cfg.steps) && cfg.steps.length > 0 ? cfg.steps : DEFAULT_STEPS;

  const [status, setStatus] = useState<Status>('error');
  const [currentStep, setCurrentStep] = useState(-1); // -1 = none, 0..n = active step
  const [progress, setProgress] = useState(0);
  const [forceError, setForceError] = useState(false);
  const [specificError, setSpecificError] = useState(false);

  const timersRef = useRef<number[]>([]);
  function clearTimers() {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }
  useEffect(() => () => clearTimers(), []);

  function startRetry() {
    if (status === 'retrying') return;
    clearTimers();
    setSpecificError(false);
    setStatus('retrying');
    setCurrentStep(-1);
    setProgress(0);

    const willFail = forceError && !specificError ? false : forceError;
    // если toggle включён — упадём на шаге 2 (индекс 1)
    if (forceError) setForceError(false);

    // step 0 — сразу, шаги 1..n каждые ~700ms
    const totalSteps = steps.length;
    const stepDuration = 700;

    for (let i = 0; i < totalSteps; i++) {
      const t = window.setTimeout(() => {
        setCurrentStep(i);
        setProgress(Math.round(((i + 1) / totalSteps) * 100));
        // на шаге 2 (индекс 1) — если включён forceError, имитируем сбой
        if (willFail && i === 1) {
          const failTimer = window.setTimeout(() => {
            setStatus('error');
            setSpecificError(true);
            setCurrentStep(-1);
            setProgress(0);
            timersRef.current = timersRef.current.filter((x) => x !== failTimer);
          }, 500);
          timersRef.current.push(failTimer);
          // отменяем оставшиеся шаги
          timersRef.current.forEach((x) => {
            if (x !== t && x !== failTimer) window.clearTimeout(x);
          });
        }
        // последний шаг — успех
        if (!willFail && i === totalSteps - 1) {
          const doneTimer = window.setTimeout(() => {
            setStatus('done');
            timersRef.current = timersRef.current.filter((x) => x !== doneTimer);
          }, 500);
          timersRef.current.push(doneTimer);
        }
      }, i * stepDuration);
      timersRef.current.push(t);
    }
  }

  function reset() {
    clearTimers();
    setStatus('error');
    setCurrentStep(-1);
    setProgress(0);
    setSpecificError(false);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Заказы" />

      <div className="flex h-[calc(100%-2.75rem)] flex-col px-5 pt-6">
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <div className="relative mb-5">
              <div className="absolute inset-0 -z-10 rounded-full bg-red-400/20 blur-2xl" />
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                <AlertTriangle className="h-9 w-9 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="text-[16px] font-bold tracking-tight text-neutral-900 dark:text-white">
              {specificError ? 'Сервер недоступен' : 'Не получилось загрузить'}
            </h1>
            <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {specificError
                ? 'Сервер недоступен. Проверьте соединение.'
                : errorMessage}
            </p>
            <button
              type="button"
              onClick={startRetry}
              className="mt-6 h-11 w-full max-w-[220px] rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
            >
              Повторить
            </button>
          </motion.div>
        )}

        {status === 'retrying' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <div className="relative mb-5">
              <div className="absolute inset-0 -z-10 rounded-full bg-emerald-400/20 blur-2xl" />
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                <Loader2 className="h-9 w-9 animate-spin text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <motion.div
                className="h-full bg-emerald-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>

            {/* Status messages */}
            <div className="flex min-h-[64px] w-full max-w-[220px] flex-col justify-start gap-1.5">
              {steps.map((step, i) => {
                const isActive = currentStep === i;
                const isDone = currentStep > i;
                const isPending = currentStep < i;
                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      opacity: isPending ? 0.35 : 1,
                      x: isActive ? 0 : 0,
                    }}
                    className="flex items-center gap-2 text-left"
                  >
                    {isDone ? (
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={3} />
                    ) : isActive ? (
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-neutral-300 dark:border-neutral-700" />
                    )}
                    <span
                      className={cn(
                        'text-[12px]',
                        isActive
                          ? 'font-semibold text-neutral-900 dark:text-white'
                          : isDone
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-neutral-400 dark:text-neutral-500',
                      )}
                    >
                      {step}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <button
              type="button"
              disabled
              className="mt-6 flex h-11 w-full max-w-[220px] items-center justify-center gap-2 rounded-full bg-emerald-600/60 text-[14px] font-semibold text-white"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Повторить
            </button>
          </motion.div>
        )}

        {status === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 280 }}
              className="relative mb-5"
            >
              <div className="absolute inset-0 -z-10 rounded-full bg-emerald-400/30 blur-2xl" />
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
              </div>
            </motion.div>
            <h1 className="text-[16px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Готово!
            </h1>
            <p className="mt-2 text-[12px] text-neutral-500 dark:text-neutral-400">
              Данные успешно загружены
            </p>
          </motion.div>
        )}

        {status === 'feed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto pb-16"
          >
            <h2 className="mb-2 text-[14px] font-bold text-neutral-900 dark:text-white">
              Последние заказы
            </h2>
            <div className="space-y-2">
              {FEED_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900"
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-neutral-700 dark:text-neutral-200',
                      item.color,
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                      {item.subtitle}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Transition: done → feed after 1s */}
      {status === 'done' && (
        <DoneToFeedTimer onTrigger={() => setStatus('feed')} />
      )}

      {/* Bottom toggle — simulate error */}
      {status !== 'feed' && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-neutral-100 bg-white px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-950">
          <button
            type="button"
            onClick={() => setForceError((v) => !v)}
            aria-pressed={forceError}
            className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300"
          >
            {forceError ? (
              <ToggleRight className="h-4 w-4 text-red-500" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-neutral-400" />
            )}
            Симулировать ошибку
          </button>
          <span className="text-[10px] text-neutral-400">
            {forceError ? 'Сбой на шаге 2' : 'Успех гарантирован'}
          </span>
        </div>
      )}

      {/* Reset button when in feed */}
      {status === 'feed' && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-neutral-100 bg-white px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-950">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Сыграть ещё раз
          </button>
        </div>
      )}
    </MockupScreen>
  );
}

function DoneToFeedTimer({ onTrigger }: { onTrigger: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onTrigger, 1100);
    return () => window.clearTimeout(t);
  }, [onTrigger]);
  return null;
}
