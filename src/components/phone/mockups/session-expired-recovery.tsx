'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ScanFace,
  Check,
  ChevronLeft,
  Clock,
  Lock,
} from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
} from './_shared';
import { cn } from '@/lib/utils';

type SessionExpiredRecoveryConfig = {
  message?: string;
  subMessage?: string;
  quickAuth?: string;
};

type Stage = 'expired' | 'scanning' | 'restored';

/**
 * SessionExpiredRecoveryMockup — сессия истекла во время заполнения формы.
 * Сверху amber-баннер с кнопкой «Войти через {quickAuth}».
 * Под баннером — форма (серая, заблокированная, данные сохранены).
 * При тапе на быстрый вход — биометрия 1.2 сек → зелёная галка →
 * форма снова редактируема с лёгкой подсветкой.
 */
export function SessionExpiredRecoveryMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as SessionExpiredRecoveryConfig;
  const message = cfg.message ?? 'Сессия истекла';
  const subMessage = cfg.subMessage ?? 'Ваши данные сохранены. Войдите, чтобы продолжить.';
  const quickAuth = cfg.quickAuth ?? 'Face ID';

  const [stage, setStage] = useState<Stage>('expired');
  const [formValues, setFormValues] = useState({
    name: 'Иван Петров',
    phone: '+7 (912) 555-33-22',
    address: 'ул. Лесная, 12, кв. 47',
  });
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function startQuickAuth() {
    if (stage !== 'expired') return;
    setStage('scanning');
    timerRef.current = window.setTimeout(() => {
      setStage('restored');
      timerRef.current = window.setTimeout(() => {
        setStage('expired');
      }, 5000);
    }, 1200);
  }

  const editable = stage === 'restored';

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Оформление"
        left={<ChevronLeft className="h-4 w-4" />}
      />

      {/* Amber banner */}
      <AnimatePresence mode="wait">
        {stage !== 'restored' && (
          <motion.div
            key="banner"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mx-3 mt-3 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30">
              <div className="flex items-start gap-2.5 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold text-amber-900 dark:text-amber-200">
                    {message}
                  </div>
                  <div className="mt-0.5 text-[11px] leading-snug text-amber-700 dark:text-amber-400">
                    {subMessage}
                  </div>
                  <button
                    type="button"
                    onClick={startQuickAuth}
                    disabled={stage === 'scanning'}
                    className="mt-2 flex h-8 items-center gap-1.5 rounded-full bg-amber-600 px-3 text-[11px] font-semibold text-white transition-colors hover:bg-amber-700 active:bg-amber-800 disabled:opacity-60"
                  >
                    {stage === 'scanning' ? (
                      <>
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 0.9, repeat: Infinity }}
                        >
                          <ScanFace className="h-3.5 w-3.5" />
                        </motion.span>
                        Сканирование...
                      </>
                    ) : (
                      <>
                        <ScanFace className="h-3.5 w-3.5" />
                        Войти через {quickAuth}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restored success pill */}
      <AnimatePresence>
        {stage === 'restored' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 280 }}
              className="mx-3 mt-3 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 dark:border-emerald-900 dark:bg-emerald-950/30"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-4 w-4" strokeWidth={3} />
              </div>
              <div className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-300">
                Сессия восстановлена. Можно продолжать.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Biometric full-screen overlay during scanning */}
      <AnimatePresence>
        {stage === 'scanning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md dark:bg-neutral-950/95"
          >
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900"
            >
              <ScanFace className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={1.6} />
            </motion.div>
            <div className="mt-4 text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
              Посмотрите в экран
            </div>
            <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
              Подтверждение через {quickAuth}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preserved form */}
      <div className="flex-1 overflow-y-auto px-3 pt-3">
        <div className="mb-3 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          <Clock className="h-3 w-3" />
          Черновик сохранён · 2 мин назад
        </div>

        <motion.div
          animate={
            stage === 'restored'
              ? { boxShadow: ['0 0 0 0 rgba(16,185,129,0)', '0 0 0 4px rgba(16,185,129,0.25)', '0 0 0 0 rgba(16,185,129,0)'] }
              : {}
          }
          transition={{ duration: 1.2 }}
          className={cn(
            'space-y-3 rounded-2xl bg-white p-3.5 shadow-sm transition-all dark:bg-neutral-900',
            !editable && 'opacity-60',
          )}
        >
          <FormRow
            label="Имя получателя"
            value={formValues.name}
            disabled={!editable}
            onChange={(v) => setFormValues((f) => ({ ...f, name: v }))}
          />
          <FormRow
            label="Телефон"
            value={formValues.phone}
            disabled={!editable}
            onChange={(v) => setFormValues((f) => ({ ...f, phone: v }))}
          />
          <FormRow
            label="Адрес доставки"
            value={formValues.address}
            disabled={!editable}
            onChange={(v) => setFormValues((f) => ({ ...f, address: v }))}
            last
          />
        </motion.div>

        {!editable && (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-neutral-100 p-2.5 text-[10px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <Lock className="h-3 w-3 shrink-0" />
            Форма недоступна — войдите, чтобы продолжить редактирование
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-neutral-100 bg-white/95 p-3 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95">
        <button
          type="button"
          disabled={!editable}
          className={cn(
            'h-11 w-full rounded-full text-[14px] font-semibold text-white transition-all',
            editable
              ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
              : 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700',
          )}
        >
          Продолжить оформление
        </button>
      </div>
    </MockupScreen>
  );
}

function FormRow({
  label,
  value,
  onChange,
  disabled,
  last,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  last?: boolean;
}) {
  return (
    <div className={cn(!last && 'pb-3 border-b border-neutral-100 dark:border-neutral-800')}>
      <div className="mb-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          'h-10 w-full rounded-lg border bg-neutral-50 px-3 text-[13px] text-neutral-900 focus:outline-none focus:ring-2',
          'dark:bg-neutral-950 dark:text-white',
          disabled
            ? 'cursor-not-allowed border-neutral-200 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400'
            : 'border-emerald-300 focus:ring-emerald-500/30',
        )}
      />
    </div>
  );
}
