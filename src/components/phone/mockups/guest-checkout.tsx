'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Check, Mail, Lock, UserCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
  PhoneFieldLabel,
  PhoneInput,
} from './_shared';
import { cn } from '@/lib/utils';

type Option = {
  id: string;
  title: string;
  desc: string;
  recommended?: boolean;
};

type GuestCheckoutConfig = {
  options?: Option[];
};

const DEFAULT_OPTIONS: Option[] = [
  {
    id: 'guest',
    title: 'Купить как гость',
    desc: 'Без пароля — только email для чека',
    recommended: true,
  },
  {
    id: 'signup',
    title: 'Создать аккаунт',
    desc: 'История заказов, бонусы и скидки',
  },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * GuestCheckoutMockup — выбор между покупкой как гость и созданием аккаунта.
 * При выборе guest показывается только поле email, при signup — email + пароль.
 * Кнопка «Продолжить» активна только когда email валиден.
 */
export function GuestCheckoutMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as GuestCheckoutConfig;
  const options = Array.isArray(cfg.options) && cfg.options.length > 0 ? cfg.options : DEFAULT_OPTIONS;

  const [selectedId, setSelectedId] = useState<string>('guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stage, setStage] = useState<'form' | 'success'>('form');

  const emailValid = EMAIL_RE.test(email.trim());
  const passwordValid = password.length >= 4;
  const canSubmit = selectedId === 'guest' ? emailValid : emailValid && passwordValid;

  function submit() {
    if (!canSubmit) return;
    setStage('success');
  }

  function reset() {
    setStage('form');
    setEmail('');
    setPassword('');
    setSelectedId('guest');
  }

  if (stage === 'success') {
    return (
      <MockupScreen className="flex flex-col items-center justify-center bg-white px-6 text-center dark:bg-neutral-950">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 280 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 ring-4 ring-emerald-100/60 dark:bg-emerald-950 dark:ring-emerald-900/50"
        >
          <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
        </motion.div>
        <h2 className="mt-6 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Заказ оформлен!
        </h2>
        <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
          Чек и трекинг отправлены на <span className="font-semibold text-neutral-700 dark:text-neutral-200">{email || 'вашу почту'}</span>
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
        >
          Оформить ещё один
        </button>
      </MockupScreen>
    );
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Оформление"
        left={<ChevronLeft className="h-4 w-4" />}
        right={<ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
      />

      <div className="px-4 pb-36 pt-4">
        <div className="mb-4">
          <h1 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Как продолжить?
          </h1>
          <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
            Выбирайте удобный способ — это займёт меньше минуты.
          </p>
        </div>

        {/* Radio cards */}
        <div className="space-y-2.5">
          {options.map((opt) => {
            const selected = selectedId === opt.id;
            const isGuest = opt.id === 'guest';
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedId(opt.id)}
                aria-pressed={selected}
                className={cn(
                  'relative flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left transition-all',
                  selected
                    ? 'border-emerald-500 bg-emerald-50 shadow-sm dark:border-emerald-700 dark:bg-emerald-950/40'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
                )}
              >
                {/* Radio dot */}
                <div
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    selected
                      ? 'border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500'
                      : 'border-neutral-300 dark:border-neutral-600',
                  )}
                >
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 320 }}
                      className="h-2 w-2 rounded-full bg-white"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isGuest ? (
                      <UserCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    )}
                    <span className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                      {opt.title}
                    </span>
                    {opt.recommended && (
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                        Рекомендуем
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Conditional fields */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-3 rounded-2xl bg-white p-3.5 shadow-sm dark:bg-neutral-900">
              <div>
                <PhoneFieldLabel>Email для чека</PhoneFieldLabel>
                <PhoneInput
                  value={email}
                  onChange={setEmail}
                  type="email"
                  placeholder="ivan@mail.ru"
                  suffix={
                    emailValid ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                      </span>
                    ) : null
                  }
                />
                {email.length > 0 && !emailValid && (
                  <p className="mt-1 text-[10px] text-red-500">Введите корректный email</p>
                )}
              </div>

              {selectedId === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <PhoneFieldLabel>Пароль</PhoneFieldLabel>
                  <PhoneInput
                    value={password}
                    onChange={setPassword}
                    type="password"
                    placeholder="Минимум 4 символа"
                    suffix={
                      <Lock className="h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                    }
                  />
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                    <Mail className="h-3 w-3" />
                    Бонус +500 ₽ на первый заказ при регистрации
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <PhoneBottomBar>
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={cn(
            'h-12 w-full rounded-full text-[15px] font-semibold text-white transition-all',
            canSubmit
              ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
              : 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700',
          )}
        >
          Продолжить
        </button>
        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500">
          <Lock className="h-3 w-3" />
          Данные защищены, 256-bit SSL
        </div>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
