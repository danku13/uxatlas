'use client';

import { useEffect, useRef, useState } from 'react';
import { Apple, Check, CreditCard, KeyRound, Lock } from 'lucide-react';
import {
  MockupScreen,
  PhoneFieldLabel,
  PhonePrimaryButton,
} from './_shared';
import { cn } from '@/lib/utils';

type FieldDef = {
  label: string;
  value: string;
  autofill: boolean;
};

type Cfg = {
  fields?: FieldDef[];
};

const DEFAULT_FIELDS: FieldDef[] = [
  { label: 'Имя на карте', value: 'IVAN PETROV', autofill: true },
  { label: 'Номер карты', value: '4242 4242 4242 4242', autofill: true },
  { label: 'Срок действия', value: '12/27', autofill: true },
];

const FILL_DURATION = 600; // ms

export function AutofillFormMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const fieldDefs = Array.isArray(cfg.fields) && cfg.fields.length > 0 ? cfg.fields : DEFAULT_FIELDS;

  // Map of label -> current value displayed in the field
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fieldDefs.map((f) => [f.label, ''])),
  );
  const [autofilled, setAutofilled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(fieldDefs.map((f) => [f.label, false])),
  );
  const [autofilling, setAutofilling] = useState(false);
  const [cvc, setCvc] = useState('');
  const [success, setSuccess] = useState(false);

  const autofillable = fieldDefs.filter((f) => f.autofill);

  // Animate each autofill-enabled field, typing characters one by one.
  const runAutofill = () => {
    if (autofilling) return;
    setAutofilling(true);
    const totalChars = autofillable.reduce((acc, f) => acc + f.value.length, 0);
    const charDelay = Math.max(8, Math.floor(FILL_DURATION / Math.max(1, totalChars)));

    let charIndex = 0;
    let fieldIndex = 0;
    let withinField = 0;

    const tick = () => {
      const field = autofillable[fieldIndex];
      if (!field) {
        setAutofilling(false);
        return;
      }
      // ensure the field is marked as autofilled once we start typing into it
      setAutofilled((prev) => ({ ...prev, [field.label]: true }));

      withinField += 1;
      const next = field.value.slice(0, withinField);
      setValues((prev) => ({ ...prev, [field.label]: next }));

      if (withinField >= field.value.length) {
        fieldIndex += 1;
        withinField = 0;
      }
      charIndex += 1;
      if (charIndex < totalChars) {
        timeoutRef.current = window.setTimeout(tick, charDelay);
      } else {
        setAutofilling(false);
      }
    };
    tick();
  };

  const timeoutRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const reset = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setValues(Object.fromEntries(fieldDefs.map((f) => [f.label, ''])));
    setAutofilled(Object.fromEntries(fieldDefs.map((f) => [f.label, false])));
    setAutofilling(false);
    setCvc('');
    setSuccess(false);
  };

  const cvcValid = cvc.length === 3;
  const allFilled = autofillable.every((f) => values[f.label] === f.value);

  if (success) {
    return (
      <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
        <div className="flex h-11 items-center px-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Оплата
          </span>
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          style={{ animation: 'afFade 300ms ease both' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
            <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
          </div>
          <h2 className="mt-6 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Оплата прошла
          </h2>
          <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            С карты списано 1 290 ₽. Чек отправлен на почту.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Повторить сценарий
          </button>
        </div>
        <style jsx>{`
          @keyframes afFade {
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
          Оплата
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-2">
        {/* Card preview */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 p-4 text-white shadow-lg dark:from-neutral-800 dark:to-neutral-700">
          <div className="flex items-center justify-between">
            <CreditCard className="h-5 w-5 text-white/80" />
            <Apple className="h-4 w-4 text-white/80" />
          </div>
          <div className="mt-5 font-mono text-[15px] tracking-wide text-white/95">
            {values['Номер карты'] || '•••• •••• •••• ••••'}
          </div>
          <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-white/70">
            <span>{values['Имя на карте'] || 'ИМЯ ФАМИЛИЯ'}</span>
            <span>{values['Срок действия'] || 'ММ/ГГ'}</span>
          </div>
          {/* Decorative gradient blob */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/30 blur-xl" />
        </div>

        {/* Autofill CTA */}
        <button
          type="button"
          onClick={runAutofill}
          disabled={autofilling || allFilled}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-900 bg-neutral-900 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-200 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <Apple className="h-4 w-4" />
          {autofilling ? 'Заполняем…' : allFilled ? 'Данные заполнены' : 'Заполнить через Apple Pay'}
        </button>

        {/* Fields */}
        <div className="mt-4 space-y-3">
          {fieldDefs.map((f) => {
            const isFilled = autofilled[f.label];
            const value = values[f.label] ?? '';
            return (
              <div key={f.label}>
                <PhoneFieldLabel>
                  <span className="flex items-center gap-1.5">
                    {f.label}
                    {f.autofill && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                        <KeyRound className="h-2.5 w-2.5" />
                        Autofill
                      </span>
                    )}
                  </span>
                </PhoneFieldLabel>
                <div className="relative">
                  <input
                    value={value}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.label]: e.target.value }))}
                    readOnly={f.autofill}
                    placeholder={f.autofill ? 'Нажмите «Заполнить через Apple Pay»' : ''}
                    className={cn(
                      'h-11 w-full rounded-xl border bg-neutral-50 px-3 text-[13px] text-neutral-900',
                      'focus:outline-none focus:ring-2',
                      'dark:text-white',
                      f.autofill
                        ? 'cursor-not-allowed border-neutral-200 bg-neutral-100 pr-9 font-mono tracking-wide dark:border-neutral-800 dark:bg-neutral-800/60'
                        : 'border-neutral-200 bg-neutral-50 focus:border-emerald-400 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900',
                    )}
                  />
                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center">
                    {f.autofill && isFilled && value === f.value && (
                      <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                    )}
                    {f.autofill && !isFilled && (
                      <Lock className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-600" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* CVC field — NOT autofillable, user must type, 3 digit max, masked */}
          <div>
            <PhoneFieldLabel>
              <span className="flex items-center gap-1.5">
                CVC
                <span className="inline-flex items-center gap-0.5 rounded-full bg-neutral-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                  Вручную
                </span>
              </span>
            </PhoneFieldLabel>
            <div className="relative">
              <input
                value={'•'.repeat(cvc.length)}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                inputMode="numeric"
                maxLength={3}
                placeholder="•••"
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-center text-[15px] font-semibold tracking-[0.4em] text-neutral-900 placeholder:tracking-[0.4em] placeholder:text-neutral-300 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
              />
              <Lock className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            </div>
            <p className="mt-1.5 px-1 text-[10px] text-neutral-400 dark:text-neutral-500">
              3 цифры на обороте карты. Не сохраняются и не передаются.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <PhonePrimaryButton
          disabled={!allFilled || !cvcValid || autofilling}
          onClick={() => setSuccess(true)}
        >
          Оплатить 1 290 ₽
        </PhonePrimaryButton>
      </div>

      <style jsx>{`
        @keyframes afFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </MockupScreen>
  );
}
