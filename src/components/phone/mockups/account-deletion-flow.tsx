'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  AlertTriangle,
  ChevronDown,
  CalendarClock,
  ShieldCheck,
  Check,
  RotateCcw,
} from 'lucide-react';
import { MockupScreen, PhoneNavBar, PhonePrimaryButton } from './_shared';
import { cn } from '@/lib/utils';

type Stage = { title: string; desc: string };

type Cfg = {
  stages?: Stage[];
  gracePeriodDays?: number;
};

const DEFAULT_STAGES: Stage[] = [
  {
    title: 'Подтвердите удаление',
    desc: 'Это действие запустит процесс удаления аккаунта.',
  },
  {
    title: 'Грейс-период',
    desc: 'Аккаунт будет окончательно удалён по истечении срока.',
  },
  {
    title: 'Аккаунт деактивирован',
    desc: 'Вы можете восстановить аккаунт в течение указанного срока.',
  },
];

const REASONS = [
  'Не пользуюсь сервисом',
  'Нашёл альтернативу',
  'Беспокойство о конфиденциальности',
  'Слишком много уведомлений',
  'Другая причина',
];

/**
 * AccountDeletionFlowMockup — 3-stage destructive flow.
 * Stage 1: warning + reasons dropdown (optional) + "Продолжить".
 * Stage 2: grace-period timeline + "Подтвердить удаление" (red, disabled 3s).
 * Stage 3: success "Аккаунт деактивирован" + "Восстановить в течение N дней".
 */
export function AccountDeletionFlowMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const stages = Array.isArray(cfg.stages) && cfg.stages.length === 3 ? cfg.stages : DEFAULT_STAGES;
  const gracePeriodDays =
    typeof cfg.gracePeriodDays === 'number' && cfg.gracePeriodDays > 0 ? cfg.gracePeriodDays : 30;

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [reasonsOpen, setReasonsOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [confirmCountdown, setConfirmCountdown] = useState<number>(3);
  const [canConfirm, setCanConfirm] = useState(false);
  const countdownRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, []);

  function startStage2() {
    setStep(1);
    setConfirmCountdown(3);
    setCanConfirm(false);
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    countdownRef.current = window.setInterval(() => {
      setConfirmCountdown((c) => {
        const next = c - 1;
        if (next <= 0) {
          if (countdownRef.current) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setCanConfirm(true);
          return 0;
        }
        return next;
      });
    }, 1000);
  }

  function confirmDeletion() {
    if (!canConfirm) return;
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setStep(2);
  }

  function recover() {
    setStep(0);
    setReason(null);
    setConfirmCountdown(3);
    setCanConfirm(false);
  }

  function restart() {
    recover();
  }

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Удаление аккаунта"
        left={
          step === 0 ? <ChevronLeft className="h-4 w-4" /> : undefined
        }
      />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto px-4 pb-24 pt-4">
        <AnimatePresence mode="wait">
          {/* STAGE 1 */}
          {step === 0 && (
            <motion.div
              key="stage-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 ring-1 ring-amber-100 dark:bg-amber-950/50 dark:ring-amber-900">
                  <AlertTriangle className="h-6 w-6 text-amber-500" strokeWidth={2.2} />
                </div>
              </div>
              <h2 className="mt-3 text-center text-[17px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {stages[0].title}
              </h2>
              <p className="mt-1 text-center text-[12px] leading-snug text-neutral-500 dark:text-neutral-400">
                {stages[0].desc}
              </p>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/30">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Что произойдёт
                </div>
                <ul className="mt-1.5 space-y-1">
                  {[
                    'Аккаунт перейдёт в режим деактивации',
                    'Данные будут скрыты от других пользователей',
                    `У вас будет ${gracePeriodDays} дней на восстановление`,
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-[11px] text-amber-800 dark:text-amber-300">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reasons dropdown */}
              <div className="mt-4">
                <div className="mb-1.5 text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
                  Причина (необязательно)
                </div>
                <button
                  type="button"
                  onClick={() => setReasonsOpen((v) => !v)}
                  aria-expanded={reasonsOpen}
                  className={cn(
                    'flex h-11 w-full items-center justify-between rounded-xl border bg-white px-3 text-left transition-colors dark:bg-neutral-900',
                    reasonsOpen
                      ? 'border-emerald-400 ring-1 ring-emerald-500/30'
                      : 'border-neutral-200 dark:border-neutral-800',
                  )}
                >
                  <span
                    className={cn(
                      'truncate text-[13px]',
                      reason ? 'text-neutral-900 dark:text-white' : 'text-neutral-400',
                    )}
                  >
                    {reason ?? 'Выберите причину'}
                  </span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-neutral-400 transition-transform',
                      reasonsOpen && 'rotate-180',
                    )}
                  />
                </button>
                <AnimatePresence>
                  {reasonsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-1 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                        {REASONS.map((r, i) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setReason(r);
                              setReasonsOpen(false);
                            }}
                            className={cn(
                              'flex w-full items-center justify-between px-3 py-2.5 text-left text-[12px] transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800',
                              i > 0 && 'border-t border-neutral-100 dark:border-neutral-800',
                              reason === r
                                ? 'font-semibold text-emerald-600 dark:text-emerald-400'
                                : 'text-neutral-700 dark:text-neutral-300',
                            )}
                          >
                            {r}
                            {reason === r && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-5">
                <PhonePrimaryButton onClick={startStage2}>Продолжить</PhonePrimaryButton>
              </div>
            </motion.div>
          )}

          {/* STAGE 2 */}
          {step === 1 && (
            <motion.div
              key="stage-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100 dark:bg-red-950/50 dark:ring-red-900">
                  <CalendarClock className="h-6 w-6 text-red-500" strokeWidth={2.2} />
                </div>
              </div>
              <h2 className="mt-3 text-center text-[17px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {stages[1].title}
              </h2>
              <p className="mt-1 text-center text-[12px] leading-snug text-neutral-500 dark:text-neutral-400">
                {stages[1].desc}
              </p>

              {/* Timeline */}
              <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="relative">
                  <div className="absolute left-2.5 top-1 bottom-1 w-0.5 bg-neutral-200 dark:bg-neutral-800" />
                  <div className="space-y-3">
                    <TimelineRow
                      done
                      label="Сегодня"
                      sub="Запрос отправлен"
                    />
                    <TimelineRow
                      active
                      label={`Через ${gracePeriodDays} дн.`}
                      sub="Аккаунт удалится окончательно"
                    />
                    <TimelineRow
                      label="Навсегда"
                      sub="Данные невозможно восстановить"
                      muted
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 dark:bg-red-950/30">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-[11px] leading-snug text-red-700 dark:text-red-300">
                  Действие необратимо после окончания грейс-периода. Все связанные
                  данные будут стёрты с серверов.
                </p>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={confirmDeletion}
                  disabled={!canConfirm}
                  className={cn(
                    'relative h-11 w-full overflow-hidden rounded-full text-[14px] font-semibold text-white transition-all',
                    canConfirm
                      ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                      : 'cursor-not-allowed bg-red-600/40',
                  )}
                >
                  {!canConfirm && (
                    <motion.span
                      key={confirmCountdown}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 1, ease: 'linear' }}
                      className="absolute inset-y-0 left-0 bg-red-600/50"
                    />
                  )}
                  <span className="relative">
                    {canConfirm
                      ? 'Подтвердить удаление'
                      : `Подтвердить удаление · ${confirmCountdown}`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={recover}
                  className="mt-2 h-10 w-full text-[12px] font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  Назад
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 3 */}
          {step === 2 && (
            <motion.div
              key="stage-2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 18, stiffness: 240 }}
              className="flex flex-col items-center pt-6 text-center"
            >
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 280 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900"
              >
                <ShieldCheck className="h-8 w-8 text-emerald-600 dark:text-emerald-400" strokeWidth={2.2} />
              </motion.div>
              <h2 className="mt-5 text-[19px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {stages[2].title}
              </h2>
              <p className="mt-2 max-w-[230px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {stages[2].desc} Восстановите аккаунт в течение{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {gracePeriodDays} дней
                </span>{' '}
                — после этого данные будут удалены навсегда.
              </p>

              <div className="mt-5 w-full rounded-2xl border border-neutral-200 bg-white p-3 text-left dark:border-neutral-800 dark:bg-neutral-900">
                <Row label="Статус" value="Деактивирован" />
                <Row
                  label="Окончательное удаление"
                  value={`Через ${gracePeriodDays} дн.`}
                  last
                />
              </div>

              <div className="mt-5 w-full">
                <PhonePrimaryButton onClick={recover}>
                  Восстановить аккаунт
                </PhonePrimaryButton>
                <button
                  type="button"
                  onClick={restart}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 text-[12px] font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Пройти сценарий заново
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MockupScreen>
  );
}

function TimelineRow({
  label,
  sub,
  done,
  active,
  muted,
}: {
  label: string;
  sub: string;
  done?: boolean;
  active?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="relative flex items-start gap-3 pl-0">
      <div
        className={cn(
          'relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          done
            ? 'border-emerald-500 bg-emerald-500'
            : active
              ? 'border-red-500 bg-white dark:bg-neutral-900'
              : 'border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900',
        )}
      >
        {done && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
        {active && <span className="h-2 w-2 rounded-full bg-red-500" />}
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div
          className={cn(
            'text-[12px] font-semibold transition-colors',
            muted ? 'text-neutral-400' : 'text-neutral-900 dark:text-white',
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            'text-[11px] transition-colors',
            muted ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400',
          )}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-1.5',
        !last && 'border-b border-neutral-100 dark:border-neutral-800',
      )}
    >
      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="truncate text-[11px] font-semibold text-neutral-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
