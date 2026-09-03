'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, Mail, MessageSquare, ShieldCheck } from 'lucide-react';
import {
  MockupScreen,
  PhoneFieldLabel,
  PhoneInput,
  PhonePrimaryButton,
} from './_shared';
import { cn } from '@/lib/utils';

type RecoveryMethod = {
  id: string;
  label: string;
  value: string;
};

type Cfg = {
  methods?: RecoveryMethod[];
};

const DEFAULT_METHODS: RecoveryMethod[] = [
  { id: 'email', label: 'На email', value: 'i***n@example.com' },
  { id: 'sms', label: 'По SMS', value: '+7 (9XX) ••• 47 12' },
];

const OTP_LEN = 6;
const DEMO_CODE = '428190';

type Stage = 'email' | 'method' | 'otp' | 'success';

/**
 * AccountRecoveryMockup — 3-step flow:
 * 1. Enter email →
 * 2. Pick recovery method (email/SMS radio with masked value) →
 * 3. Enter 6-digit OTP (auto-advance between boxes) → success.
 */
export function AccountRecoveryMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const methods =
    Array.isArray(cfg.methods) && cfg.methods.length > 0 ? cfg.methods : DEFAULT_METHODS;

  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [methodId, setMethodId] = useState<string | null>(null);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(''));
  const [error, setError] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const emailValid = email.includes('@') && email.includes('.');

  // Auto-focus the first OTP box when entering OTP stage.
  useEffect(() => {
    if (stage === 'otp') {
      requestAnimationFrame(() => otpRefs.current[0]?.focus());
    }
  }, [stage]);

  const setDigitAt = (i: number, v: string) => {
    const char = v.replace(/\D/g, '').slice(-1);
    setError(false);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = char;
      return next;
    });
    if (char && i < OTP_LEN - 1) {
      requestAnimationFrame(() => otpRefs.current[i + 1]?.focus());
    }
  };

  const onOtpKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      requestAnimationFrame(() => otpRefs.current[i - 1]?.focus());
    }
  };

  const onOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LEN);
    if (!text) return;
    const next = Array(OTP_LEN).fill('');
    for (let k = 0; k < text.length; k++) next[k] = text[k];
    setDigits(next);
    const focusIdx = Math.min(text.length, OTP_LEN - 1);
    requestAnimationFrame(() => otpRefs.current[focusIdx]?.focus());
  };

  // Auto-advance to success when 6 digits entered and they match DEMO_CODE.
  useEffect(() => {
    if (stage === 'otp' && digits.every((d) => d.length === 1)) {
      const code = digits.join('');
      const t = window.setTimeout(() => {
        if (code === DEMO_CODE) {
          setStage('success');
        } else {
          setError(true);
          setDigits(Array(OTP_LEN).fill(''));
          requestAnimationFrame(() => otpRefs.current[0]?.focus());
        }
      }, 300);
      return () => window.clearTimeout(t);
    }
  }, [digits, stage]);

  const goNext = () => {
    if (stage === 'email' && emailValid) setStage('method');
    else if (stage === 'method' && methodId) setStage('otp');
  };

  const reset = () => {
    setStage('email');
    setEmail('');
    setMethodId(null);
    setDigits(Array(OTP_LEN).fill(''));
    setError(false);
  };

  const stepLabel = (() => {
    if (stage === 'email') return 'Шаг 1 из 3';
    if (stage === 'method') return 'Шаг 2 из 3';
    if (stage === 'otp') return 'Шаг 3 из 3';
    return '';
  })();

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      {/* Top bar */}
      <div className="flex h-11 items-center justify-between px-3">
        {stage !== 'email' && stage !== 'success' ? (
          <button
            type="button"
            onClick={() => setStage(stage === 'otp' ? 'method' : 'email')}
            aria-label="Назад"
            className="flex items-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Закрыть"
            className="flex items-center text-[13px] font-medium text-neutral-400 dark:text-neutral-500"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
          {stepLabel}
        </span>
        <span className="w-4" />
      </div>

      {/* Progress bar */}
      {stage !== 'success' && (
        <div className="px-4">
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
              initial={false}
              animate={{
                width:
                  stage === 'email' ? '33%' : stage === 'method' ? '66%' : '100%',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Stages */}
      <div className="flex flex-1 flex-col px-6">
        <AnimatePresence mode="wait">
          {stage === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-1 flex-col"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900">
                <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="mt-5 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
                Забыли пароль?
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Укажите email аккаунта — мы поможем восстановить доступ.
              </p>
              <div className="mt-6">
                <PhoneFieldLabel>Email</PhoneFieldLabel>
                <PhoneInput
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  type="email"
                  autoFocus
                />
              </div>
              <div className="mt-auto pb-6 pt-6">
                <PhonePrimaryButton disabled={!emailValid} onClick={goNext}>
                  Далее
                </PhonePrimaryButton>
              </div>
            </motion.div>
          )}

          {stage === 'method' && (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-1 flex-col"
            >
              <h2 className="mt-5 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
                Куда отправить код?
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Выберите способ получения кода подтверждения.
              </p>
              <div className="mt-5 space-y-2">
                {methods.map((m) => {
                  const Icon = m.id === 'sms' ? MessageSquare : Mail;
                  const sel = methodId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethodId(m.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all',
                        sel
                          ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg',
                          sel
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                          {m.label}
                        </div>
                        <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                          {m.value}
                        </div>
                      </div>
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-full border',
                          sel
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-neutral-300 dark:border-neutral-600',
                        )}
                      >
                        {sel && <Check className="h-2.5 w-2.5" strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-auto pb-6 pt-6">
                <PhonePrimaryButton disabled={!methodId} onClick={goNext}>
                  Отправить код
                </PhonePrimaryButton>
              </div>
            </motion.div>
          )}

          {stage === 'otp' && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-1 flex-col"
            >
              <h2 className="mt-5 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
                Введите код
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Мы отправили 6-значный код на{' '}
                <span className="font-medium text-neutral-900 dark:text-white">
                  {methods.find((m) => m.id === methodId)?.value ?? 'email'}
                </span>
              </p>
              <div
                className="mt-6 flex justify-between gap-1.5"
                onPaste={onOtpPaste}
              >
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => setDigitAt(i, e.target.value)}
                    onKeyDown={(e) => onOtpKeyDown(i, e)}
                    className={cn(
                      'h-12 w-9 rounded-xl border bg-neutral-50 text-center text-[18px] font-semibold text-neutral-900',
                      'focus:outline-none focus:ring-2',
                      'dark:bg-neutral-900 dark:text-white',
                      error
                        ? 'border-red-400 focus:ring-red-500/30'
                        : d
                          ? 'border-emerald-500 dark:border-emerald-500'
                          : 'border-neutral-200 dark:border-neutral-800',
                    )}
                  />
                ))}
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-[11px] font-medium text-red-500"
                >
                  Неверный код. Попробуйте снова.
                </motion.p>
              )}
              <p className="mt-2 text-[10px] text-neutral-400 dark:text-neutral-500">
                Подсказка: {DEMO_CODE}
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
              >
                Отправить код повторно
                <ChevronRight className="h-3 w-3" />
              </button>
              <div className="mt-auto pb-6 pt-6">
                <PhonePrimaryButton
                  disabled={!digits.every((d) => d.length === 1)}
                  onClick={() => {
                    if (digits.join('') === DEMO_CODE) setStage('success');
                    else setError(true);
                  }}
                >
                  Подтвердить
                </PhonePrimaryButton>
              </div>
            </motion.div>
          )}

          {stage === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 flex-col items-center justify-center text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 13, stiffness: 260 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900"
              >
                <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
              </motion.div>
              <h2 className="mt-6 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
                Пароль изменён
              </h2>
              <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Вход выполнен. Теперь вы можете пользоваться аккаунтом как обычно.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
              >
                Повторить сценарий
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MockupScreen>
  );
}
