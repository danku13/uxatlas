'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Plus, Search, Check } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type CoachMark = {
  target: string; // 'fab' | 'search'
  label: string;
  body: string;
};

type FirstTimeEmptyTutorialConfig = {
  title?: string;
  coachMarks?: CoachMark[];
};

type Target = 'fab' | 'search';

/**
 * FirstTimeEmptyTutorialMockup — пустой экран + coach marks.
 * Pulsing emerald ring вокруг цели + тултип с подсказкой.
 */
export function FirstTimeEmptyTutorialMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as FirstTimeEmptyTutorialConfig;
  const title = (typeof cfg.title === 'string' && cfg.title) || 'Здесь появятся заказы';
  const coachMarks: CoachMark[] =
    Array.isArray(cfg.coachMarks) && cfg.coachMarks.length > 0
      ? cfg.coachMarks
      : [
          {
            target: 'fab',
            label: 'Создайте заказ',
            body: 'Нажмите «+», чтобы оформить новый заказ — он сразу появится здесь.',
          },
          {
            target: 'search',
            label: 'Поиск',
            body: 'Используйте поиск, чтобы быстро найти любой заказ по номеру или названию.',
          },
        ];

  const [activeStep, setActiveStep] = useState<number>(-1); // -1 = not started
  const [toast, setToast] = useState(false);

  // Auto-start first coach mark after brief delay
  useEffect(() => {
    const t = window.setTimeout(() => setActiveStep(0), 800);
    return () => window.clearTimeout(t);
  }, []);

  function nextStep() {
    if (activeStep < 0) return;
    if (activeStep < coachMarks.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // finished
      setActiveStep(-1);
      setToast(true);
      window.setTimeout(() => setToast(false), 2000);
    }
  }

  const currentMark: CoachMark | null = activeStep >= 0 ? coachMarks[activeStep] : null;
  const currentTarget: Target | null = currentMark ? (currentMark.target as Target) : null;

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Мои заказы"
        left={<ChevronLeft className="h-4 w-4" />}
        right={
          <div className="relative">
            <button
              type="button"
              aria-label="Поиск заказов"
              className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <Search className="h-4 w-4" />
            </button>
            {currentTarget === 'search' && (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 280 }}
                className="pointer-events-none absolute -inset-2 rounded-full ring-2 ring-emerald-500"
                style={{ animation: 'pulse-ring 1.4s ease-in-out infinite' }}
              />
            )}
          </div>
        }
      />

      {/* Body — empty state */}
      <div className="relative flex h-[calc(100%-2.75rem)] flex-col items-center justify-center px-6 pb-24 text-center">
        {/* Dashed circle empty illustration */}
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <span className="text-[11px] font-medium text-neutral-400">пусто</span>
        </div>

        <h1 className="text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 max-w-[210px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Оформите первый заказ — он появится в этом списке.
        </p>

        {/* Coach mark tooltip — search variant (top area) */}
        <AnimatePresence>
          {currentTarget === 'search' && currentMark && (
            <motion.div
              key="tooltip-search"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3 top-2 z-40 w-[210px] rounded-2xl bg-neutral-900 p-3 text-left shadow-xl dark:bg-neutral-800"
            >
              {/* arrow pointing up-right toward the search icon */}
              <div className="absolute -top-1.5 right-4 h-3 w-3 rotate-45 bg-neutral-900 dark:bg-neutral-800" />
              <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                {currentMark.label}
              </div>
              <p className="mt-1 text-[11px] leading-snug text-white">
                {currentMark.body}
              </p>
              <button
                type="button"
                onClick={nextStep}
                className="mt-2.5 inline-flex h-7 w-full items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Понятно
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coach mark tooltip — fab variant (bottom area) */}
        <AnimatePresence>
          {currentTarget === 'fab' && currentMark && (
            <motion.div
              key="tooltip-fab"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-20 right-3 z-40 w-[210px] rounded-2xl bg-neutral-900 p-3 text-left shadow-xl dark:bg-neutral-800"
            >
              {/* arrow pointing down-right toward the FAB */}
              <div className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 bg-neutral-900 dark:bg-neutral-800" />
              <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                {currentMark.label}
              </div>
              <p className="mt-1 text-[11px] leading-snug text-white">
                {currentMark.body}
              </p>
              <button
                type="button"
                onClick={nextStep}
                className="mt-2.5 inline-flex h-7 w-full items-center justify-center rounded-full bg-emerald-600 text-[11px] font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Понятно
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FAB — bottom right */}
      <div className="absolute bottom-5 right-4 z-30">
        <div className="relative">
          <button
            type="button"
            aria-label="Создать заказ"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
          {currentTarget === 'fab' && (
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 280 }}
              className="pointer-events-none absolute -inset-2 rounded-full ring-2 ring-emerald-500"
              style={{ animation: 'pulse-ring 1.4s ease-in-out infinite' }}
            />
          )}
        </div>
      </div>

      {/* "Done" toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-3 top-12 z-50 flex items-center justify-center"
          >
            <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-white shadow-lg">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              <span className="text-[11px] font-semibold">Готово! Можно работать</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restart hint when finished */}
      {activeStep < 0 && !toast && (
        <button
          type="button"
          onClick={() => setActiveStep(0)}
          className={cn(
            'absolute bottom-5 left-4 z-30 rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-neutral-500 shadow-md',
            'ring-1 ring-neutral-200 transition-colors hover:text-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-800 dark:hover:text-neutral-200',
          )}
        >
          Показать подсказки ещё раз
        </button>
      )}

      <style jsx>{`
        @keyframes pulse-ring {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.12);
          }
        }
      `}</style>
    </MockupScreen>
  );
}
