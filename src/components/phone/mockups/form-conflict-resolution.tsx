'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  GitBranch,
  Check,
  AlertTriangle,
  Clock,
  ChevronDown,
} from 'lucide-react';
import {
  MockupScreen,
} from './_shared';
import { cn } from '@/lib/utils';

type Conflict = {
  field: string;
  yours: string;
  theirs: string;
};

type FormConflictResolutionConfig = {
  conflicts?: Conflict[];
};

const DEFAULT_CONFLICTS: Conflict[] = [
  {
    field: 'Email клиента',
    yours: 'ivan.petrov@mail.ru',
    theirs: 'i.petrov@yandex.ru',
  },
  {
    field: 'Сумма заказа',
    yours: '9 680 ₽',
    theirs: '10 480 ₽',
  },
  {
    field: 'Способ доставки',
    yours: 'Курьер до двери',
    theirs: 'Самовывоз',
  },
];

/**
 * FormConflictResolutionMockup — модалка с разрешением конфликтов версий.
 * Для каждого конфликта: название поля + две колонки (Ваша / Версия B) + radio.
 * Снизу: «Сохранить выбранное». Diff-подсветка: emerald (selected) vs red (rejected).
 */
export function FormConflictResolutionMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as FormConflictResolutionConfig;
  const conflicts = Array.isArray(cfg.conflicts) && cfg.conflicts.length > 0 ? cfg.conflicts : DEFAULT_CONFLICTS;

  // selection: 0 = none, 'yours' | 'theirs' per conflict index
  const [selections, setSelections] = useState<Record<number, 'yours' | 'theirs' | null>>(
    () => Object.fromEntries(conflicts.map((_, i) => [i, null])),
  );
  const [saved, setSaved] = useState(false);

  const allResolved = conflicts.every((_, i) => selections[i] !== null);

  function pick(idx: number, side: 'yours' | 'theirs') {
    setSelections((prev) => ({ ...prev, [idx]: side }));
  }

  function save() {
    if (!allResolved) return;
    setSaved(true);
  }

  function reset() {
    setSelections(Object.fromEntries(conflicts.map((_, i) => [i, null])));
    setSaved(false);
  }

  if (saved) {
    return (
      <MockupScreen className="flex flex-col items-center justify-center bg-neutral-50 px-6 text-center dark:bg-neutral-950">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 280 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-emerald-100/60 dark:bg-emerald-950 dark:ring-emerald-900/50"
        >
          <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
        </motion.div>
        <h2 className="mt-6 text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Конфликты разрешены
        </h2>
        <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          {conflicts.length} {conflicts.length === 1 ? 'поле' : 'полей'} обновлено. Версия сохранена.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
        >
          Показать ещё раз
        </button>
      </MockupScreen>
    );
  }

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-100/60 backdrop-blur-sm dark:bg-neutral-900/60">
      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="mx-auto flex h-full w-full flex-col bg-white shadow-2xl dark:bg-neutral-950"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-neutral-900 dark:text-white">
                Конфликт версий
              </h2>
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                <Clock className="h-2.5 w-2.5" />
                Версия B · 10 мин назад
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Закрыть"
            className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Conflicts list */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="space-y-4">
            {conflicts.map((c, i) => {
              const sel = selections[i];
              return (
                <div key={i}>
                  {/* Field name */}
                  <div className="mb-2 flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold text-neutral-900 dark:text-white">
                      {c.field}
                    </span>
                    {sel && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white"
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </motion.span>
                    )}
                  </div>

                  {/* Two columns: yours / theirs */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Yours */}
                    <ConflictColumn
                      label="Ваша версия"
                      sub="только что"
                      value={c.yours}
                      side="yours"
                      selected={sel === 'yours'}
                      rejected={sel === 'theirs'}
                      onClick={() => pick(i, 'yours')}
                    />
                    {/* Theirs */}
                    <ConflictColumn
                      label="Версия B"
                      sub="10 мин назад"
                      value={c.theirs}
                      side="theirs"
                      selected={sel === 'theirs'}
                      rejected={sel === 'yours'}
                      onClick={() => pick(i, 'theirs')}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer / progress + save */}
        <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
          <div className="mb-2 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">
              Разрешено {Object.values(selections).filter(Boolean).length} из {conflicts.length}
            </span>
            <span
              className={cn(
                'font-semibold',
                allResolved ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
              )}
            >
              {allResolved ? 'Готово к сохранению' : 'Осталось разрешить'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <motion.div
              animate={{ width: `${(Object.values(selections).filter(Boolean).length / conflicts.length) * 100}%` }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={save}
            disabled={!allResolved}
            className={cn(
              'h-11 w-full rounded-full text-[14px] font-semibold text-white transition-all',
              allResolved
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                : 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700',
            )}
          >
            Сохранить выбранное
          </button>
        </div>
      </motion.div>
    </MockupScreen>
  );
}

function ConflictColumn({
  label,
  sub,
  value,
  selected,
  rejected,
  onClick,
}: {
  label: string;
  sub: string;
  value: string;
  side: 'yours' | 'theirs';
  selected: boolean;
  rejected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'relative overflow-hidden rounded-xl border p-2.5 text-left transition-all',
        selected
          ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40'
          : rejected
            ? 'border-red-200 bg-red-50/40 dark:border-red-900/60 dark:bg-red-950/20'
            : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
      )}
    >
      {/* Diff strip on top */}
      <div className="mb-1.5 flex items-center justify-between">
        <span
          className={cn(
            'text-[10px] font-semibold uppercase tracking-wide',
            selected
              ? 'text-emerald-700 dark:text-emerald-300'
              : rejected
                ? 'text-red-500 dark:text-red-400'
                : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {label}
        </span>
        {/* Radio */}
        <span
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
            selected
              ? 'border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500'
              : rejected
                ? 'border-red-300 bg-red-300/30 dark:border-red-900 dark:bg-red-950/40'
                : 'border-neutral-300 dark:border-neutral-600',
          )}
        >
          {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
          {rejected && <AlertTriangle className="h-2.5 w-2.5 text-red-500 dark:text-red-400" />}
        </span>
      </div>

      {/* Value with diff highlight */}
      <div
        className={cn(
          'rounded-md px-1.5 py-1 text-[12px] font-medium',
          selected
            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200'
            : rejected
              ? 'bg-red-100/70 text-red-700 line-through dark:bg-red-950/30 dark:text-red-300'
              : 'bg-neutral-50 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
        )}
      >
        {value}
      </div>

      <div className="mt-1 text-[9px] text-neutral-400 dark:text-neutral-500">
        {sub}
      </div>
    </button>
  );
}
