'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type HapticAction = {
  id: string;
  label: string;
  haptic: string;
};

type Cfg = {
  actions?: HapticAction[];
};

const DEFAULT_ACTIONS: HapticAction[] = [
  { id: 'like', label: 'Лайк', haptic: 'soft' },
  { id: 'success', label: 'Успех', haptic: 'medium' },
  { id: 'warning', label: 'Внимание', haptic: 'rigid' },
  { id: 'error', label: 'Ошибка', haptic: 'heavy' },
];

const PATTERNS: Record<string, number[]> = {
  soft: [10],
  medium: [12, 40, 18],
  rigid: [30, 30, 30],
  heavy: [60, 40, 60, 40, 60],
};

const ACTION_STYLE: Record<
  string,
  { icon: typeof Heart; ring: string; bg: string; fg: string; ripple: string }
> = {
  like: {
    icon: Heart,
    ring: 'ring-rose-200 dark:ring-rose-900/50',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    fg: 'text-rose-500',
    ripple: 'bg-rose-400',
  },
  success: {
    icon: CheckCircle2,
    ring: 'ring-emerald-200 dark:ring-emerald-900/50',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    fg: 'text-emerald-600 dark:text-emerald-400',
    ripple: 'bg-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    ring: 'ring-amber-200 dark:ring-amber-900/50',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    fg: 'text-amber-500',
    ripple: 'bg-amber-400',
  },
  error: {
    icon: XCircle,
    ring: 'ring-red-200 dark:ring-red-900/50',
    bg: 'bg-red-50 dark:bg-red-950/40',
    fg: 'text-red-500',
    ripple: 'bg-red-400',
  },
};

/**
 * HapticFeedbackMockup — demo screen with 4 haptic buttons. On tap:
 * visual ripple + label pulse + toast "Haptic: {type}". Uses navigator.vibrate
 * if available, with different patterns. Includes "Тест повторно" reset.
 */
export function HapticFeedbackMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const actions = Array.isArray(cfg.actions) && cfg.actions.length > 0 ? cfg.actions : DEFAULT_ACTIONS;

  const [lastFired, setLastFired] = useState<string | null>(null);
  const [ripple, setRipple] = useState<{ id: string; key: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [supported, setSupported] = useState<boolean | null>(null);
  const toastTimer = useRef<number | null>(null);
  const firedCount = useRef(0);

  function fire(action: HapticAction) {
    const pattern = PATTERNS[action.haptic] ?? [10];
    let available = false;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        // navigator.vibrate returns boolean (true on most Chromium-based browsers)
        const result = (navigator as Navigator).vibrate(pattern);
        available = !!result || result === undefined;
      }
    } catch {
      available = false;
    }
    setSupported(typeof navigator !== 'undefined' && 'vibrate' in navigator);

    setLastFired(action.haptic);
    setRipple({ id: action.id, key: Date.now() });
    firedCount.current += 1;
    setToast(`Haptic: ${action.haptic}`);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }

  function reset() {
    setLastFired(null);
    setRipple(null);
    setToast(null);
    setSupported(null);
    firedCount.current = 0;
    try {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        (navigator as Navigator).vibrate(0);
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Тактильный отклик" />

      <div className="flex h-[calc(100%-2.75rem)] flex-col overflow-y-auto px-4 pb-4 pt-3">
        <div className="mb-3">
          <h2 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Haptic feedback
          </h2>
          <p className="mt-1 text-[12px] leading-snug text-neutral-500 dark:text-neutral-400">
            Нажмите, чтобы почувствовать отклик. Каждое действие вызывает
            уникальный паттерн вибрации.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {actions.map((action) => {
            const style = ACTION_STYLE[action.id] ?? ACTION_STYLE.success;
            const Icon = style.icon;
            const isLast = lastFired === action.haptic;
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => fire(action)}
                aria-label={`${action.label}: ${action.haptic} haptic`}
                className={cn(
                  'relative flex h-28 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl ring-1 transition-transform active:scale-95',
                  style.bg,
                  style.ring,
                )}
              >
                {/* Ripple */}
                <AnimatePresence>
                  {ripple && ripple.id === action.id && (
                    <motion.span
                      key={ripple.key}
                      initial={{ scale: 0, opacity: 0.55 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.65, ease: 'easeOut' }}
                      className={cn(
                        'pointer-events-none absolute h-24 w-24 rounded-full',
                        style.ripple,
                      )}
                    />
                  )}
                </AnimatePresence>

                <div
                  className={cn(
                    'relative flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-sm dark:bg-neutral-900/70',
                    style.fg,
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div className="relative text-center">
                  <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                    {action.label}
                  </div>
                  <motion.div
                    key={isLast ? `l-${action.id}-${ripple?.key ?? 0}` : 'idle'}
                    animate={
                      isLast
                        ? { scale: [1, 1.12, 1], opacity: [0.6, 1, 0.85] }
                        : { scale: 1, opacity: 0.7 }
                    }
                    transition={{ duration: 0.45 }}
                    className={cn('text-[10px] font-medium uppercase tracking-wider', style.fg)}
                  >
                    {action.haptic}
                  </motion.div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Last fired */}
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Последний отклик
            </span>
            <span className="text-[11px] text-neutral-400">
              {firedCount.current > 0 ? `Срабатываний: ${firedCount.current}` : '—'}
            </span>
          </div>
          <div className="mt-1.5 text-[14px] font-semibold text-neutral-900 dark:text-white">
            {lastFired ? `Haptic: ${lastFired}` : 'Ничего не вызвано'}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            {supported === null
              ? 'Нажмите кнопку, чтобы проверить поддержку.'
              : supported
                ? 'Поддержка Vibration API активна.'
                : 'Вибрация недоступна — имитация визуального отклика.'}
          </div>
        </div>

        {/* Patterns legend */}
        <div className="mt-3 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Паттерны (мс)
          </div>
          <div className="space-y-1">
            {Object.entries(PATTERNS).map(([key, pat]) => (
              <div key={key} className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">{key}</span>
                <span className="tabular-nums text-neutral-500 dark:text-neutral-400">
                  [{pat.join(', ')}]
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={reset}
            className="flex w-full items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white py-2.5 text-[12px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Тест повторно
          </button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="absolute inset-x-3 bottom-3 z-40 flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2.5 text-white shadow-xl dark:bg-neutral-800"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/25">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </span>
            <span className="flex-1 text-[12px] font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
