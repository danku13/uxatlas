'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Mail } from 'lucide-react';
import {
  MockupScreen,
  PhoneFieldLabel,
  PhoneInput,
  PhonePrimaryButton,
} from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  step?: 'email' | 'otp';
  email?: string;
  otp?: string[];
};

type Stage = 'email' | 'otp' | 'success';

const OTP_LEN = 6;
const RESEND_SECONDS = 30;

export function PasswordlessAuthMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;

  const [stage, setStage] = useState<Stage>(
    cfg.step === 'otp' || cfg.step === 'success' ? 'otp' : 'email',
  );
  const [email, setEmail] = useState<string>(cfg.email ?? '');
  const [digits, setDigits] = useState<string[]>(
    Array.isArray(cfg.otp) ? [...cfg.otp].slice(0, OTP_LEN).concat(Array(OTP_LEN).fill('')).slice(0, OTP_LEN) : Array(OTP_LEN).fill(''),
  );
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const emailValid = email.includes('@') && email.includes('.');

  // Decrement countdown once per second while on the OTP stage.
  // The countdown itself is initialized to RESEND_SECONDS via useState
  // and reset on demand by the user-action handlers (advance / resend).
  useEffect(() => {
    if (stage !== 'otp') return;
    const t = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [stage]);

  // Auto-focus the first OTP box when entering OTP stage
  useEffect(() => {
    if (stage === 'otp') {
      const firstEmpty = digits.findIndex((d) => !d);
      const idx = firstEmpty === -1 ? OTP_LEN - 1 : firstEmpty;
      requestAnimationFrame(() => otpRefs.current[idx]?.focus());
    }
  }, [stage]);

  // Auto-advance success when 6 digits entered
  useEffect(() => {
    if (stage === 'otp' && digits.every((d) => d.length === 1)) {
      const t = setTimeout(() => setStage('success'), 350);
      return () => clearTimeout(t);
    }
  }, [digits, stage]);

  const setDigitAt = (i: number, v: string) => {
    const char = v.replace(/\D/g, '').slice(-1);
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

  const resend = () => {
    if (countdown > 0) return;
    setCountdown(RESEND_SECONDS);
  };

  const goToOtp = () => {
    setStage('otp');
    setCountdown(RESEND_SECONDS);
  };

  const mm = String(Math.floor(countdown / 60)).padStart(1, '0');
  const ss = String(countdown % 60).padStart(2, '0');

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      {/* Top bar */}
      <div className="flex h-11 items-center px-3">
        {stage !== 'email' ? (
          <button
            type="button"
            onClick={() => setStage(stage === 'success' ? 'otp' : 'email')}
            aria-label="Назад"
            className="flex items-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Вход
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col px-6">
        {stage === 'email' && (
          <div className="flex flex-1 flex-col" style={{ animation: 'plFade 250ms ease both' }}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900">
              <Mail className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="mt-5 text-[26px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Войти
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Без пароля — ссылка на почту. Мы отправим одноразовый код для подтверждения.
            </p>

            <div className="mt-7">
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
              <PhonePrimaryButton
                disabled={!emailValid}
                onClick={goToOtp}
              >
                Отправить ссылку
              </PhonePrimaryButton>
              <p className="mt-3 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
                Нажимая кнопку, вы соглашаетесь с условиями использования.
              </p>
            </div>
          </div>
        )}

        {stage === 'otp' && (
          <div className="flex flex-1 flex-col" style={{ animation: 'plFade 250ms ease both' }}>
            <h2 className="mt-5 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Введите код
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Код отправлен на{' '}
              <span className="font-medium text-neutral-900 dark:text-white">{email || 'you@example.com'}</span>
            </p>

            <div className="mt-6 flex justify-between gap-1.5" onPaste={onOtpPaste}>
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
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/40',
                    'dark:bg-neutral-900 dark:text-white',
                    d
                      ? 'border-emerald-500 dark:border-emerald-500'
                      : 'border-neutral-200 dark:border-neutral-800',
                  )}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center">
              <button
                type="button"
                onClick={resend}
                disabled={countdown > 0}
                className={cn(
                  'text-[12px] font-medium transition-colors',
                  countdown > 0
                    ? 'text-neutral-400 dark:text-neutral-500'
                    : 'text-emerald-600 dark:text-emerald-400',
                )}
              >
                {countdown > 0 ? `Отправить ещё через ${mm}:${ss}` : 'Отправить код повторно'}
              </button>
            </div>

            <div className="mt-auto pb-6 pt-6">
              <button
                type="button"
                onClick={() => setStage('success')}
                disabled={!digits.every((d) => d.length === 1)}
                className="h-11 w-full rounded-full bg-emerald-600 text-[14px] font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:pointer-events-none"
              >
                Подтвердить
              </button>
            </div>
          </div>
        )}

        {stage === 'success' && (
          <div
            className="flex flex-1 flex-col items-center justify-center text-center"
            style={{ animation: 'plFade 300ms ease both' }}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
              <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
            </div>
            <h2 className="mt-6 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Вход выполнен
            </h2>
            <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Перенаправляем в приложение…
            </p>
            <button
              type="button"
              onClick={() => {
                setStage('email');
                setDigits(Array(OTP_LEN).fill(''));
              }}
              className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              Повторить сценарий
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes plFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </MockupScreen>
  );
}
