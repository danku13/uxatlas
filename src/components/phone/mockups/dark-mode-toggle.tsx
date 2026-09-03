'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Smartphone, Sun, Moon, Check, ChevronLeft, Type } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type ThemeOption = {
  id: string;
  label: string;
  desc: string;
  icon: string;
};

type Cfg = {
  options?: ThemeOption[];
  current?: string;
};

const ICON_MAP: Record<string, typeof Smartphone> = {
  smartphone: Smartphone,
  sun: Sun,
  moon: Moon,
};

/**
 * DarkModeToggleMockup — 3 large radio cards for theme options (system/light/dark)
 * with lucide icons. Selected option has emerald ring + check. On select, the
 * phone screen background switches instantly (white↔neutral-950). Below is a
 * small preview showing how text looks in the chosen theme.
 */
export function DarkModeToggleMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const options: ThemeOption[] =
    Array.isArray(cfg.options) && cfg.options.length > 0
      ? (cfg.options as ThemeOption[])
      : [
          { id: 'system', label: 'Системная', desc: 'Как в устройстве', icon: 'smartphone' },
          { id: 'light', label: 'Светлая', desc: 'Всегда светлая', icon: 'sun' },
          { id: 'dark', label: 'Тёмная', desc: 'Всегда тёмная', icon: 'moon' },
        ];
  const initial =
    typeof cfg.current === 'string' && options.some((o) => o.id === cfg.current)
      ? cfg.current
      : 'system';

  const [selected, setSelected] = useState<string>(initial);
  // effective theme = system → simulate by showing light (since this is a demo).
  const effectiveDark = selected === 'dark';

  return (
    <MockupScreen
      className={cn(
        'relative flex flex-col transition-colors duration-300',
        effectiveDark ? 'bg-neutral-950' : 'bg-neutral-50',
      )}
    >
      <PhoneNavBar
        title="Оформление"
        left={<ChevronLeft className="h-4 w-4" />}
        className={cn(
          effectiveDark
            ? 'border-neutral-800 bg-neutral-950'
            : 'border-neutral-100 bg-neutral-50',
        )}
      />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto px-4 pb-6 pt-4">
        <div className="mb-4">
          <h2
            className={cn(
              'text-[20px] font-bold tracking-tight transition-colors',
              effectiveDark ? 'text-white' : 'text-neutral-900',
            )}
          >
            Внешний вид
          </h2>
          <p
            className={cn(
              'mt-1 text-[12px] leading-snug transition-colors',
              effectiveDark ? 'text-neutral-400' : 'text-neutral-500',
            )}
          >
            Тема применяется мгновенно. Режим «Системная» следует настройкам устройства.
          </p>
        </div>

        <div className="space-y-2.5">
          {options.map((opt) => {
            const Icon = ICON_MAP[opt.icon] ?? Smartphone;
            const isSelected = selected === opt.id;
            const active = isSelected && (opt.id === 'dark') === effectiveDark;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelected(opt.id)}
                aria-pressed={isSelected}
                className={cn(
                  'relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all',
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500 dark:border-emerald-600 dark:bg-emerald-950/40 dark:ring-emerald-700'
                    : effectiveDark
                      ? 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                      : 'border-neutral-200 bg-white hover:border-neutral-300',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                    isSelected
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300'
                      : effectiveDark
                        ? 'bg-neutral-800 text-neutral-300'
                        : 'bg-neutral-100 text-neutral-500',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      'text-[13px] font-semibold transition-colors',
                      effectiveDark ? 'text-white' : 'text-neutral-900',
                    )}
                  >
                    {opt.label}
                  </div>
                  <div
                    className={cn(
                      'truncate text-[11px] transition-colors',
                      effectiveDark ? 'text-neutral-400' : 'text-neutral-500',
                    )}
                  >
                    {opt.desc}
                  </div>
                </div>
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500'
                      : effectiveDark
                        ? 'border-neutral-700'
                        : 'border-neutral-300',
                  )}
                >
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 320 }}
                      >
                        <Check className="h-3 w-3 text-white" strokeWidth={3.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {active && (
                  <span className="absolute right-3 top-2 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white">
                    Активно
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Preview block */}
        <div
          className={cn(
            'mt-5 overflow-hidden rounded-2xl border transition-colors',
            effectiveDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-1.5 border-b px-3 py-2 text-[10px] font-semibold uppercase tracking-wider transition-colors',
              effectiveDark
                ? 'border-neutral-800 text-neutral-400'
                : 'border-neutral-100 text-neutral-400',
            )}
          >
            <Type className="h-3 w-3" />
            Предпросмотр
          </div>
          <div className="space-y-2 p-3">
            <div
              className={cn(
                'text-[15px] font-bold transition-colors',
                effectiveDark ? 'text-white' : 'text-neutral-900',
              )}
            >
              Заголовок статьи
            </div>
            <div
              className={cn(
                'text-[12px] leading-relaxed transition-colors',
                effectiveDark ? 'text-neutral-300' : 'text-neutral-600',
              )}
            >
              Текст контента выглядит так. Цвета автоматически подстраиваются под
              выбранную тему интерфейса для комфортного чтения.
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  effectiveDark
                    ? 'bg-emerald-950/60 text-emerald-400'
                    : 'bg-emerald-50 text-emerald-700',
                )}
              >
                Метка
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  effectiveDark
                    ? 'bg-amber-950/60 text-amber-400'
                    : 'bg-amber-50 text-amber-700',
                )}
              >
                Внимание
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-medium',
                  effectiveDark
                    ? 'bg-red-950/60 text-red-400'
                    : 'bg-red-50 text-red-700',
                )}
              >
                Ошибка
              </span>
            </div>
            <button
              type="button"
              className="mt-1 h-8 w-full rounded-full bg-emerald-600 text-[12px] font-semibold text-white"
            >
              Кнопка действия
            </button>
          </div>
        </div>

        <div
          className={cn(
            'mt-4 text-center text-[10px] transition-colors',
            effectiveDark ? 'text-neutral-500' : 'text-neutral-400',
          )}
        >
          Тема: {selected === 'system' ? 'системная → светлая (демо)' : selected}
        </div>
      </div>
    </MockupScreen>
  );
}
