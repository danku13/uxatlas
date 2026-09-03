'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, Cloud, Loader2 } from 'lucide-react';
import { MockupScreen, PhoneFieldLabel } from './_shared';
import { cn } from '@/lib/utils';

type FieldDef = {
  label: string;
  value: string;
};

type Cfg = {
  fields?: FieldDef[];
  lastSaved?: string;
};

const DEFAULT_FIELDS: FieldDef[] = [
  { label: 'Имя', value: 'Анна Соколова' },
  { label: 'Email', value: 'anna@example.com' },
  { label: 'Телефон', value: '+7 905 123-45-67' },
];

type SaveStatus = 'saved' | 'saving';

/**
 * AutosaveDraftMockup — form with pre-filled fields. Shows "Сохранено
 * {lastSaved}" indicator at top with a green check. When user edits a field,
 * indicator flips to "Сохранение..." with spinner, then after ~1s back to
 * "Сохранено X сек назад".
 */
export function AutosaveDraftMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const fields =
    Array.isArray(cfg.fields) && cfg.fields.length > 0 ? cfg.fields : DEFAULT_FIELDS;
  const initialLastSaved = cfg.lastSaved ?? 'только что';

  const [values, setValues] = useState<string[]>(() => fields.map((f) => f.value));
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [savedLabel, setSavedLabel] = useState<string>(initialLastSaved);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const saveTimer = useRef<number | null>(null);
  const tickTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      if (tickTimer.current) window.clearInterval(tickTimer.current);
    };
  }, []);

  // Tick the "X сек назад" counter once per second while saved.
  useEffect(() => {
    if (status !== 'saved') return;
    tickTimer.current = window.setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);
    return () => {
      if (tickTimer.current) window.clearInterval(tickTimer.current);
    };
  }, [status]);

  const onEdit = (i: number, v: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    setStatus('saving');
    setSecondsAgo(0);
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      setStatus('saved');
      setSavedLabel('2 сек назад');
      setSecondsAgo(0);
    }, 1000);
  };

  const displayedLabel =
    status === 'saving' ? 'Сохранение...' : secondsAgo === 0 ? savedLabel : `${secondsAgo} сек назад`;

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
          Профиль
        </span>
        <span className="w-4" />
      </div>

      {/* Autosave indicator */}
      <div className="px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className={cn(
              'flex items-center gap-2 rounded-xl border px-3 py-2',
              status === 'saved'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40'
                : 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30',
            )}
          >
            {status === 'saved' ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3" strokeWidth={4} />
              </span>
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            )}
            <div className="flex-1">
              <div
                className={cn(
                  'text-[12px] font-semibold',
                  status === 'saved'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400',
                )}
              >
                {displayedLabel}
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {status === 'saved' ? 'Черновик синхронизирован' : 'Сохраняем изменения...'}
              </div>
            </div>
            <Cloud
              className={cn(
                'h-4 w-4',
                status === 'saved'
                  ? 'text-emerald-400 dark:text-emerald-500'
                  : 'text-amber-400 dark:text-amber-500',
              )}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
        <h2 className="text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Личные данные
        </h2>
        <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
          Изменения сохраняются автоматически.
        </p>

        <div className="mt-5 space-y-4">
          {fields.map((f, i) => (
            <div key={f.label}>
              <PhoneFieldLabel>{f.label}</PhoneFieldLabel>
              <input
                value={values[i] ?? ''}
                onChange={(e) => onEdit(i, e.target.value)}
                placeholder={`Введите ${f.label.toLowerCase()}`}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500"
              />
            </div>
          ))}
        </div>

        {/* History hint */}
        <div className="mt-6 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <Cloud className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              Все правки сохраняются в облаке
            </span>
          </div>
          <p className="mt-1 text-[10px] text-neutral-400 dark:text-neutral-500">
            Отредактируйте любое поле — индикатор выше покажет статус автосохранения.
          </p>
        </div>
      </div>
    </MockupScreen>
  );
}
