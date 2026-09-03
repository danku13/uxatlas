'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, Flag, Target } from 'lucide-react';
import { MockupScreen, PhonePrimaryButton } from './_shared';
import { cn } from '@/lib/utils';

type StepDef = {
  title: string;
  done: boolean;
};

type Cfg = {
  goal?: string;
  steps?: StepDef[];
};

const DEFAULT_STEPS: StepDef[] = [
  { title: 'Создать профиль компании', done: true },
  { title: 'Добавить первый товар', done: true },
  { title: 'Подключить оплату', done: false },
];

/**
 * TimeToValueProgressMockup — vertical progress with steps leading to a goal
 * card. Done steps filled with emerald, current step pulses, last item is the
 * goal card with emerald gradient. Counter at top "X из Y шагов до цели".
 */
export function TimeToValueProgressMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const goal = cfg.goal ?? 'Первый заказ клиента';
  const initialSteps =
    Array.isArray(cfg.steps) && cfg.steps.length > 0 ? cfg.steps : DEFAULT_STEPS;

  // Maintain local state so the user can mark steps as completed.
  const [steps, setSteps] = useState<StepDef[]>(initialSteps.map((s) => ({ ...s })));

  const completedCount = steps.filter((s) => s.done).length;
  const totalCount = steps.length;
  const allDone = completedCount === totalCount;
  // Current step = first not-done step.
  const currentIdx = steps.findIndex((s) => !s.done);

  const toggleStep = (i: number) => {
    setSteps((prev) => {
      const next = [...prev];
      // Disallow un-checking earlier steps once later ones are done (keeps
      // the linear progress narrative coherent).
      if (i === currentIdx) {
        next[i] = { ...next[i], done: true };
      }
      return next;
    });
  };

  const reset = () => {
    setSteps(initialSteps.map((s) => ({ ...s })));
  };

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      {/* Top bar */}
      <div className="flex h-11 items-center justify-between px-3">
        <button
          type="button"
          aria-label="Назад"
          className="flex items-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
          Прогресс
        </span>
        <span className="w-4" />
      </div>

      {/* Counter card */}
      <div className="px-4">
        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                До цели
              </div>
              <div className="mt-0.5 text-[16px] font-bold text-neutral-900 dark:text-white">
                {completedCount} из {totalCount} шагов
              </div>
            </div>
            <div className="relative flex h-12 w-12 items-center justify-center">
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-neutral-200 dark:text-neutral-700"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-emerald-500"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={
                    2 * Math.PI * 20 - (2 * Math.PI * 20 * completedCount) / totalCount
                  }
                  style={{ transition: 'stroke-dashoffset 400ms ease' }}
                />
              </svg>
              <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-200">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Steps + goal */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
        <div className="relative">
          {steps.map((step, i) => {
            const isDone = step.done;
            const isCurrent = i === currentIdx && !allDone;
            const isLast = i === steps.length - 1;
            return (
              <div key={i} className="relative flex gap-3 pb-3">
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-800">
                    <motion.div
                      className="absolute inset-x-0 top-0 bg-emerald-500"
                      initial={{ height: isDone ? '100%' : '0%' }}
                      animate={{ height: isDone ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                )}

                {/* Step circle */}
                <button
                  type="button"
                  onClick={() => toggleStep(i)}
                  disabled={isDone || !isCurrent}
                  aria-label={`Шаг: ${step.title}`}
                  className="relative z-10 mt-0.5 shrink-0"
                >
                  <motion.div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                      isDone
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : isCurrent
                          ? 'border-emerald-500 bg-white text-emerald-600 dark:bg-neutral-950 dark:text-emerald-400'
                          : 'border-neutral-200 bg-white text-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-600',
                    )}
                    animate={
                      isCurrent
                        ? { boxShadow: ['0 0 0 0 rgba(16,185,129,0.45)', '0 0 0 6px rgba(16,185,129,0)'] }
                        : { boxShadow: '0 0 0 0 rgba(0,0,0,0)' }
                    }
                    transition={{ duration: 1.3, repeat: isCurrent ? Infinity : 0, ease: 'easeOut' }}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" strokeWidth={3} />
                    ) : (
                      <span className="text-[11px] font-bold">{i + 1}</span>
                    )}
                  </motion.div>
                </button>

                {/* Step content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'text-[10px] font-semibold uppercase tracking-wider',
                        isDone
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-neutral-400 dark:text-neutral-500',
                      )}
                    >
                      {isDone ? 'Готово' : isCurrent ? 'Сейчас' : 'Дальше'}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'mt-0.5 text-[13px] font-semibold leading-snug',
                      isDone
                        ? 'text-neutral-500 line-through dark:text-neutral-500'
                        : 'text-neutral-900 dark:text-white',
                    )}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Goal card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: allDone ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
            className="mt-2 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 text-white shadow-lg shadow-emerald-600/20"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
                {allDone ? (
                  <Check className="h-5 w-5" strokeWidth={3} />
                ) : (
                  <Target className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                  Цель
                </div>
                <div className="mt-0.5 text-[15px] font-bold leading-tight">{goal}</div>
                {allDone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium"
                  >
                    <Flag className="h-3 w-3" />
                    Достигнута
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        {allDone ? (
          <PhonePrimaryButton onClick={reset}>Повторить сценарий</PhonePrimaryButton>
        ) : currentIdx >= 0 ? (
          <PhonePrimaryButton onClick={() => toggleStep(currentIdx)}>
            Отметить шаг выполненным
          </PhonePrimaryButton>
        ) : null}
      </div>
    </MockupScreen>
  );
}
