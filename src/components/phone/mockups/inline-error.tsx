'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, AlertTriangle, Check, Mail, Lock, User } from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneInput,
  PhoneFieldLabel,
  PhoneBottomBar,
} from './_shared';
import { cn } from '@/lib/utils';

type FieldDef = { label: string; value: string; error: string };
type InlineErrorConfig = {
  fields?: FieldDef[];
};

type FieldKind = 'email' | 'password' | 'text';

/** Detect a "kind" of validator based on label. */
function detectKind(label: string): FieldKind {
  const l = label.toLowerCase();
  if (l.includes('почт') || l.includes('email') || l.includes('e-mail')) return 'email';
  if (l.includes('пароль') || l.includes('password')) return 'password';
  return 'text';
}

function validate(kind: FieldKind, value: string): string | null {
  const v = value.trim();
  if (!v) return 'Поле обязательно';
  if (kind === 'email') {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    return ok ? null : 'Введите корректный e-mail';
  }
  if (kind === 'password') {
    return v.length >= 8 ? null : 'Минимум 8 символов';
  }
  return v.length >= 2 ? null : 'Слишком короткое значение';
}

const DEFAULT_FIELDS: FieldDef[] = [
  { label: 'Имя', value: '', error: 'Поле обязательно' },
  { label: 'E-mail', value: '', error: 'Введите корректный e-mail' },
  { label: 'Пароль', value: '', error: 'Минимум 8 символов' },
];

/**
 * InlineErrorMockup — форма с инлайн-ошибками и живым счётчиком.
 * При первом рендере ошибки видны сразу. Когда пользователь печатает — ошибка уходит.
 */
export function InlineErrorMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as InlineErrorConfig;
  const fields = cfg.fields ?? DEFAULT_FIELDS;

  // Состояние: для каждого поля храним значение + флаг "тронуто".
  // Изначально showErrors=true, чтобы ошибки были видны сразу.
  const [values, setValues] = useState<string[]>(fields.map((f) => f.value));
  const [touched, setTouched] = useState<boolean[]>(fields.map(() => false));
  const [showErrors, setShowErrors] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const kinds = useMemo(() => fields.map((f) => detectKind(f.label)), [fields]);

  const errors = values.map((v, i) => {
    // если поле тронуто — валидируем по-настоящему
    if (touched[i]) return validate(kinds[i], v);
    // иначе — берём исходную ошибку из конфига
    if (v.trim() === '') return fields[i].error || 'Поле обязательно';
    return validate(kinds[i], v);
  });

  const errorCount = errors.filter(Boolean).length;
  const valid = errorCount === 0;

  function handleChange(i: number, v: string) {
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (!touched[i]) {
      setTouched((prev) => {
        const next = [...prev];
        next[i] = true;
        return next;
      });
    }
    if (!showErrors) setShowErrors(true);
    if (submitted) setSubmitted(false);
  }

  function handleSubmit() {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    setSubmitted(true);
  }

  const counterColor =
    errorCount === 0
      ? 'text-emerald-600 dark:text-emerald-400'
      : errorCount === 1
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400';
  const counterBg =
    errorCount === 0
      ? 'bg-emerald-50 dark:bg-emerald-950'
      : errorCount === 1
        ? 'bg-amber-50 dark:bg-amber-950'
        : 'bg-red-50 dark:bg-red-950';
  const counterText =
    errorCount === 0
      ? '0 ошибок'
      : errorCount === 1
        ? '1 ошибка'
        : `${errorCount} ошибки`;

  function iconForLabel(label: string) {
    const l = label.toLowerCase();
    if (l.includes('почт') || l.includes('email')) return <Mail className="h-3.5 w-3.5" />;
    if (l.includes('пароль') || l.includes('password')) return <Lock className="h-3.5 w-3.5" />;
    return <User className="h-3.5 w-3.5" />;
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Регистрация"
        left={<ChevronLeft className="h-4 w-4" />}
      />

      <div className="px-4 pb-32 pt-3">
        {/* Live counter */}
        <div
          className={cn(
            'mb-3 flex items-center justify-between rounded-xl px-3 py-2 text-[11px] font-medium transition-colors',
            counterBg,
            counterColor,
          )}
        >
          <span className="flex items-center gap-1.5">
            {errorCount === 0 ? (
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            {errorCount === 0 ? 'Все поля заполнены' : 'Проверьте поля ниже'}
          </span>
          <span className="font-semibold tabular-nums">{counterText}</span>
        </div>

        <div className="space-y-3">
          {fields.map((f, i) => {
            const err = showErrors ? errors[i] : null;
            const isValidField = !err && values[i].trim().length > 0;
            return (
              <div key={i}>
                <PhoneFieldLabel>{f.label}</PhoneFieldLabel>
                <PhoneInput
                  value={values[i]}
                  onChange={(v) => handleChange(i, v)}
                  type={kinds[i] === 'password' ? 'password' : 'text'}
                  placeholder={f.label}
                  error={!!err}
                  suffix={
                    isValidField ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                        <Check
                          className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                          strokeWidth={3}
                        />
                      </span>
                    ) : err ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                      </span>
                    ) : (
                      <span className="text-neutral-300 dark:text-neutral-600">
                        {iconForLabel(f.label)}
                      </span>
                    )
                  }
                />
                {err && (
                  <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-red-600 dark:text-red-400">
                    <AlertTriangle className="mt-[1px] h-3 w-3 shrink-0" />
                    <span>{err}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <PhoneBottomBar>
        <div className="space-y-1.5">
          {submitted && (
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Check className="h-3 w-3" strokeWidth={3} />
              Форма отправлена!
            </div>
          )}
          <button
            type="button"
            disabled={!valid}
            onClick={handleSubmit}
            className={cn(
              'h-12 w-full rounded-full text-[15px] font-semibold text-white transition-all',
              valid
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                : 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700',
            )}
          >
            Создать аккаунт
          </button>
        </div>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
