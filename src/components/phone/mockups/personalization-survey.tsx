'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, Sparkles } from 'lucide-react';
import { MockupScreen, PhonePrimaryButton } from './_shared';
import { cn } from '@/lib/utils';

type Question = {
  title: string;
  options: string[];
};

type Cfg = {
  questions?: Question[];
};

const DEFAULT_QUESTIONS: Question[] = [
  {
    title: 'Чем вы интересуетесь?',
    options: ['Дизайн', 'Разработка', 'Маркетинг', 'Продукт'],
  },
  {
    title: 'Как часто заходите?',
    options: ['Каждый день', 'Раз в неделю', 'Несколько раз в месяц'],
  },
];

/**
 * PersonalizationSurveyMockup — card-based survey: one question per screen,
 * single-select chips, "Далее" advances, ends with success screen.
 */
export function PersonalizationSurveyMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const questions =
    Array.isArray(cfg.questions) && cfg.questions.length > 0
      ? cfg.questions
      : DEFAULT_QUESTIONS;
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(total).fill(null),
  );
  const [done, setDone] = useState(false);

  const isLast = index === total - 1;
  const current = questions[index];
  const selected = answers[index];

  const choose = (opt: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = opt;
      return next;
    });
  };

  const advance = () => {
    if (!selected) return;
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex((i) => Math.min(total - 1, i + 1));
  };

  const back = () => {
    if (index === 0) return;
    setIndex((i) => Math.max(0, i - 1));
  };

  if (done) {
    return (
      <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
        <div className="flex h-11 items-center justify-center">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Персонализация
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 13, stiffness: 260 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900"
          >
            <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white"
          >
            Готово!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400"
          >
            Персонализация настроена — мы подобрали контент под ваши интересы.
          </motion.p>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setIndex(0);
              setAnswers(Array(total).fill(null));
            }}
            className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Повторить сценарий
          </button>
        </div>
      </MockupScreen>
    );
  }

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      {/* Top bar: back + progress label */}
      <div className="flex h-11 items-center justify-between px-3">
        <button
          type="button"
          onClick={back}
          disabled={index === 0}
          aria-label="Назад"
          className="flex items-center text-[13px] font-medium text-emerald-600 disabled:opacity-30 dark:text-emerald-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
          Вопрос {index + 1} из {total}
        </span>
        <span className="w-4" />
      </div>

      {/* Progress segments */}
      <div className="flex gap-1 px-4">
        {questions.map((_, i) => (
          <div
            key={i}
            className="relative h-1 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
              initial={false}
              animate={{ width: i < index ? '100%' : i === index ? '0%' : '0%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            {i === index && (
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Question content */}
      <div className="flex flex-1 flex-col px-6 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex flex-1 flex-col"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900">
              <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="mt-4 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
              {current.title}
            </h2>
            <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
              Выберите один вариант
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {current.options.map((opt) => {
                const isSel = selected === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => choose(opt)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-[12px] font-medium transition-all',
                      isSel
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700',
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'flex h-3.5 w-3.5 items-center justify-center rounded-full border transition-colors',
                          isSel
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-neutral-300 text-transparent dark:border-neutral-600',
                        )}
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={4} />
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <PhonePrimaryButton disabled={!selected} onClick={advance}>
          {isLast ? 'Завершить' : 'Далее'}
        </PhonePrimaryButton>
      </div>
    </MockupScreen>
  );
}
