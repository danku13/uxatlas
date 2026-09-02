'use client';

import { useState } from 'react';
import { Check, Eye, EyeOff, Lock, Mail, User, X } from 'lucide-react';
import {
  MockupScreen,
  PhoneFieldLabel,
  PhonePrimaryButton,
} from './_shared';
import { cn } from '@/lib/utils';

type FieldDef = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
};

type Cfg = {
  fields?: FieldDef[];
};

const DEFAULT_FIELDS: FieldDef[] = [
  { id: 'name', label: 'Имя', type: 'text', placeholder: 'Иван Петров' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'ivan@example.com' },
  { id: 'password', label: 'Пароль', type: 'password', placeholder: 'Минимум 8 символов' },
];

type FieldState = {
  value: string;
  touched: boolean;
  blurred: boolean;
};

type Strength = 'weak' | 'medium' | 'strong';

function validateName(v: string): string | null {
  if (!v.trim()) return 'Введите имя';
  if (v.trim().length < 2) return 'Минимум 2 символа';
  return null;
}
function validateEmail(v: string): string | null {
  if (!v.trim()) return 'Введите email';
  if (!v.includes('@') || !v.includes('.')) return 'Email должен содержать @ и домен';
  return null;
}
function validatePassword(v: string): string | null {
  if (!v) return 'Введите пароль';
  if (v.length < 8) return 'Минимум 8 символов';
  return null;
}

function passwordStrength(v: string): {
  score: number;
  level: Strength;
  has8: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
} {
  const has8 = v.length >= 8;
  const hasUpper = /[A-ZА-ЯЁ]/.test(v);
  const hasNumber = /\d/.test(v);
  let score = 0;
  if (v.length > 0) score++;
  if (has8) score++;
  if (hasUpper) score++;
  if (hasNumber) score++;
  let level: Strength = 'weak';
  if (score >= 3 && has8 && (hasUpper || hasNumber)) level = 'medium';
  if (score >= 4) level = 'strong';
  return { score, level, has8, hasUpper, hasNumber };
}

export function InlineValidationFormMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const fields = Array.isArray(cfg.fields) && cfg.fields.length > 0 ? cfg.fields : DEFAULT_FIELDS;

  const [values, setValues] = useState<Record<string, FieldState>>(() =>
    Object.fromEntries(fields.map((f) => [f.id, { value: '', touched: false, blurred: false }])),
  );
  const [showPw, setShowPw] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setValue = (id: string, v: string) => {
    setValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], value: v, touched: true },
    }));
  };
  const setBlurred = (id: string) => {
    setValues((prev) => ({
      ...prev,
      [id]: { ...prev[id], blurred: true },
    }));
  };

  const errors: Record<string, string | null> = {};
  const nameField = fields.find((f) => f.id === 'name');
  const emailField = fields.find((f) => f.id === 'email');
  const pwField = fields.find((f) => f.id === 'password');

  if (nameField) {
    errors[nameField.id] = validateName(values[nameField.id]?.value ?? '');
  }
  if (emailField) {
    errors[emailField.id] = validateEmail(values[emailField.id]?.value ?? '');
  }
  if (pwField) {
    errors[pwField.id] = validatePassword(values[pwField.id]?.value ?? '');
  }

  const allValid = Object.values(errors).every((e) => e === null);

  const onSubmit = () => {
    setSubmitted(true);
  };

  const strength = pwField ? passwordStrength(values[pwField.id]?.value ?? '') : null;

  const renderFieldIcon = (f: FieldDef) => {
    const state = values[f.id];
    if (!state?.blurred && !state?.touched) {
      // neutral icon
      if (f.id === 'name') return <User className="h-4 w-4 text-neutral-400" />;
      if (f.id === 'email') return <Mail className="h-4 w-4 text-neutral-400" />;
      if (f.id === 'password') return <Lock className="h-4 w-4 text-neutral-400" />;
      return null;
    }
    const err = errors[f.id];
    if (err) return <X className="h-4 w-4 text-red-500" />;
    return <Check className="h-4 w-4 text-emerald-600" />;
  };

  if (submitted) {
    return (
      <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
        <div className="flex h-11 items-center px-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Регистрация
          </span>
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          style={{ animation: 'ivFade 300ms ease both' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
            <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
          </div>
          <h2 className="mt-6 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Добро пожаловать!
          </h2>
          <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Аккаунт создан. Теперь можно войти в приложение.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setValues(Object.fromEntries(fields.map((f) => [f.id, { value: '', touched: false, blurred: false }])));
            }}
            className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Повторить сценарий
          </button>
        </div>
        <style jsx>{`
          @keyframes ivFade {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </MockupScreen>
    );
  }

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      <div className="flex h-11 items-center px-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Регистрация
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h2 className="px-1 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Создать аккаунт
        </h2>
        <p className="mt-1 px-1 text-[12px] text-neutral-500 dark:text-neutral-400">
          Заполните поля — мы проверим их по ходу ввода.
        </p>

        <div className="mt-5 space-y-4">
          {fields.map((f) => {
            const state = values[f.id];
            const err = errors[f.id];
            const showErr = err && state?.blurred;
            const isPw = f.id === 'password';
            const fieldValid = state?.blurred && !err && state.value.length > 0;

            return (
              <div key={f.id}>
                <PhoneFieldLabel>{f.label}</PhoneFieldLabel>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    {f.id === 'name' && <User className="h-4 w-4 text-neutral-400" />}
                    {f.id === 'email' && <Mail className="h-4 w-4 text-neutral-400" />}
                    {isPw && <Lock className="h-4 w-4 text-neutral-400" />}
                  </div>
                  <input
                    type={isPw ? (showPw ? 'text' : 'password') : f.type}
                    value={state?.value ?? ''}
                    onChange={(e) => setValue(f.id, e.target.value)}
                    onBlur={() => setBlurred(f.id)}
                    placeholder={f.placeholder}
                    className={cn(
                      'h-11 w-full rounded-xl border bg-neutral-50 pl-9 pr-9 text-[13px] text-neutral-900 placeholder:text-neutral-400',
                      'focus:outline-none focus:ring-2',
                      'dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500',
                      showErr
                        ? 'border-red-400 focus:ring-red-500/30'
                        : fieldValid
                          ? 'border-emerald-500 focus:ring-emerald-500/30'
                          : 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-800',
                    )}
                  />
                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                    {isPw && (
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        aria-label={showPw ? 'Скрыть пароль' : 'Показать пароль'}
                        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                    {renderFieldIcon(f) && (
                      <span className="ml-0.5">{renderFieldIcon(f)}</span>
                    )}
                  </div>
                </div>

                {showErr && (
                  <p className="mt-1.5 px-1 text-[11px] font-medium text-red-500">{err}</p>
                )}

                {isPw && state && state.value.length > 0 && strength && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            strength.level === 'weak'
                              ? 'w-1/3 bg-red-500'
                              : strength.level === 'medium'
                                ? 'w-2/3 bg-amber-500'
                                : 'w-full bg-emerald-500',
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-medium uppercase tracking-wider',
                          strength.level === 'weak'
                            ? 'text-red-500'
                            : strength.level === 'medium'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400',
                        )}
                      >
                        {strength.level === 'weak'
                          ? 'Слабый'
                          : strength.level === 'medium'
                            ? 'Средний'
                            : 'Надёжный'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <ChecklistItem ok={strength.has8} label="8+ символов" />
                      <ChecklistItem ok={strength.hasUpper} label="Заглавная" />
                      <ChecklistItem ok={strength.hasNumber} label="Цифра" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <PhonePrimaryButton disabled={!allValid} onClick={onSubmit}>
          Создать аккаунт
        </PhonePrimaryButton>
      </div>

      <style jsx>{`
        @keyframes ivFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </MockupScreen>
  );
}

function ChecklistItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-medium transition-colors',
        ok
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
          : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-500',
      )}
    >
      {ok ? (
        <Check className="h-3 w-3 shrink-0" />
      ) : (
        <span className="h-3 w-3 shrink-0 rounded-full border border-neutral-300 dark:border-neutral-700" />
      )}
      <span className="truncate">{label}</span>
    </div>
  );
}
