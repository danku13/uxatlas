'use client';

import { useMemo, useState } from 'react';
import { Check, Phone, CreditCard, Calendar, ClipboardCheck } from 'lucide-react';
import {
  MockupScreen,
  PhoneFieldLabel,
  PhonePrimaryButton,
} from './_shared';
import { cn } from '@/lib/utils';

type FieldType = 'phone' | 'card' | 'date';

type FieldDef = {
  type: FieldType;
  label: string;
  placeholder: string;
};

type Cfg = {
  fields?: FieldDef[];
};

const DEFAULT_FIELDS: FieldDef[] = [
  { type: 'phone', label: 'Телефон', placeholder: '+7 (___) ___-__-__' },
  { type: 'card', label: 'Номер карты', placeholder: '0000 0000 0000 0000' },
  { type: 'date', label: 'Срок действия', placeholder: 'ММ/ГГ' },
];

/* ── Format helpers ─────────────────────────────────────────── */

function formatPhone(raw: string): { formatted: string; digits: string } {
  let digits = raw.replace(/\D/g, '');
  // Russian format: strip leading 7/8 if user typed them
  if (digits.startsWith('7')) digits = digits.slice(1);
  else if (digits.startsWith('8')) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  let out = '+7';
  if (digits.length > 0) {
    out += ' (';
    out += digits.slice(0, 3);
    if (digits.length >= 3) {
      out += ') ';
      out += digits.slice(3, 6);
      if (digits.length >= 6) {
        out += '-';
        out += digits.slice(6, 8);
        if (digits.length >= 8) {
          out += '-';
          out += digits.slice(8, 10);
        }
      }
    }
  }
  return { formatted: out, digits };
}

function formatCard(raw: string): { formatted: string; digits: string } {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? '';
  return { formatted, digits };
}

function formatDate(raw: string): { formatted: string; digits: string } {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  let formatted = digits;
  if (digits.length > 2) {
    formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4);
  }
  return { formatted, digits };
}

function validatePhone(digits: string): boolean {
  return digits.length === 10;
}

function validateCard(digits: string): boolean {
  return digits.length === 16;
}

function validateDate(digits: string): boolean {
  if (digits.length !== 4) return false;
  const mm = parseInt(digits.slice(0, 2), 10);
  return mm >= 1 && mm <= 12;
}

function getFormatter(type: FieldType) {
  if (type === 'phone') return formatPhone;
  if (type === 'card') return formatCard;
  return formatDate;
}

function getValidator(type: FieldType) {
  if (type === 'phone') return validatePhone;
  if (type === 'card') return validateCard;
  return validateDate;
}

/* ── Component ──────────────────────────────────────────────── */

export function SmartInputMasksMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const fields =
    Array.isArray(cfg.fields) && cfg.fields.length > 0 ? (cfg.fields as FieldDef[]) : DEFAULT_FIELDS;

  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.type, ''])),
  );

  function setValue(type: FieldType, raw: string) {
    const fmt = getFormatter(type);
    const { formatted } = fmt(raw);
    setValues((prev) => ({ ...prev, [type]: formatted }));
  }

  // Recompute validity on every render — cheap, no effects needed.
  const validity = useMemo(() => {
    const out: Record<string, boolean> = {};
    for (const f of fields) {
      const fmt = getFormatter(f.type);
      const val = getValidator(f.type);
      const { digits } = fmt(values[f.type] ?? '');
      out[f.type] = val(digits);
    }
    return out;
  }, [values, fields]);

  const allValid = fields.every((f) => validity[f.type]);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
        <div className="flex h-11 items-center px-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Оплата
          </span>
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          style={{ animation: 'simFade 280ms ease both' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
            <ClipboardCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={2.4} />
          </div>
          <h2 className="mt-6 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Данные проверены
          </h2>
          <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Все поля заполнены корректно. Можно переходить к оплате.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setValues(Object.fromEntries(fields.map((f) => [f.type, ''])));
            }}
            className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Повторить сценарий
          </button>
        </div>
        <style jsx>{`
          @keyframes simFade {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </MockupScreen>
    );
  }

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      <div className="flex h-11 items-center px-3">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Платёжные данные
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h2 className="text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Оформление
        </h2>
        <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
          Поля форматируются автоматически по мере ввода.
        </p>

        <div className="mt-5 space-y-4">
          {fields.map((f) => {
            const val = values[f.type] ?? '';
            const isValid = validity[f.type];
            const Icon = f.type === 'phone' ? Phone : f.type === 'card' ? CreditCard : Calendar;
            return (
              <div key={f.type}>
                <PhoneFieldLabel>{f.label}</PhoneFieldLabel>
                <div className="relative">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon className="h-4 w-4 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    inputMode={f.type === 'date' ? 'numeric' : 'tel'}
                    value={val}
                    onChange={(e) => setValue(f.type, e.target.value)}
                    onPaste={(e) => {
                      // Let the paste flow through onChange naturally; the formatter
                      // strips non-digits, so a paste like "+79161234567" turns into
                      // "+7 (916) 123-45-67" on the next keystroke-render.
                      e.stopPropagation();
                    }}
                    placeholder={f.placeholder}
                    className={cn(
                      'h-12 w-full rounded-xl border bg-neutral-50 pl-9 pr-9 text-[14px] tabular-nums text-neutral-900 placeholder:text-neutral-400',
                      'focus:bg-white focus:outline-none focus:ring-2',
                      'dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900',
                      isValid
                        ? 'border-emerald-500 focus:ring-emerald-500/30'
                        : 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-800',
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValid ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      </span>
                    ) : val.length > 0 ? (
                      <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    ) : null}
                  </div>
                </div>
                {isValid && (
                  <p
                    className="mt-1.5 flex items-center gap-1 px-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                    style={{ animation: 'simFade 200ms ease both' }}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                    Валидный формат
                  </p>
                )}
                {val.length > 0 && !isValid && (
                  <p className="mt-1.5 px-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                    {f.type === 'phone' && 'Осталось ввести ' + (10 - formatPhone(val).digits.length) + ' цифр'}
                    {f.type === 'card' && 'Осталось ввести ' + (16 - formatCard(val).digits.length) + ' цифр'}
                    {f.type === 'date' && 'Введите месяц и год (ММ/ГГ)'}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Hint card */}
        <div className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Подсказка
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Попробуйте вставить <span className="font-semibold text-neutral-700 dark:text-neutral-200">+79161234567</span> в поле телефона — оно отформатируется автоматически.
          </p>
        </div>
      </div>

      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <PhonePrimaryButton disabled={!allValid} onClick={() => setSubmitted(true)}>
          {allValid ? 'Продолжить' : 'Заполните все поля'}
        </PhonePrimaryButton>
      </div>

      <style jsx>{`
        @keyframes simFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </MockupScreen>
  );
}
