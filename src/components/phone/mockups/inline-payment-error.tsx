'use client';

import { useState } from 'react';
import { ChevronLeft, Check, AlertTriangle, HelpCircle, CreditCard, Lock } from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneInput,
  PhoneFieldLabel,
  PhoneBottomBar,
} from './_shared';
import { cn } from '@/lib/utils';

type InlinePaymentErrorConfig = {
  card?: string;
  errorField?: string;
  errorMessage?: string;
};

const VALID_CVC = '424';

/**
 * InlinePaymentErrorMockup — форма оплаты с инлайн-ошибкой CVC.
 * CVC = 424 → успех. Любое другое значение (когда длина = 3) → ошибка.
 */
export function InlinePaymentErrorMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as InlinePaymentErrorConfig;
  const card = cfg.card ?? '4242 4242 4242 4242';
  const errorMessage =
    cfg.errorMessage ?? 'Неверный CVC-код. Проверьте 3 цифры на обратной стороне карты.';

  const [cvc, setCvc] = useState('');
  const [touched, setTouched] = useState(false);

  const trimmed = cvc.replace(/\D/g, '');
  const isComplete = trimmed.length === 3;
  const isValid = trimmed === VALID_CVC;

  // состояние: 'idle' | 'error' | 'valid'
  const fieldState: 'idle' | 'error' | 'valid' = !isComplete
    ? 'idle'
    : isValid
      ? 'valid'
      : 'error';

  function handleChange(v: string) {
    const digits = v.replace(/\D/g, '').slice(0, 3);
    setCvc(digits);
    if (!touched) setTouched(true);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Оплата"
        left={<ChevronLeft className="h-4 w-4" />}
      />

      <div className="px-4 pb-32 pt-4">
        {/* Card preview */}
        <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-950 p-4 text-white shadow-md dark:from-neutral-700 dark:to-neutral-900">
          <div className="flex items-center justify-between">
            <CreditCard className="h-5 w-5 text-white/70" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              Visa
            </span>
          </div>
          <div className="mt-4 font-mono text-[15px] tracking-wider">
            {card}
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-wide text-white/40">
                Держатель
              </div>
              <div className="text-[12px] font-medium">IVAN PETROV</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wide text-white/40">
                До
              </div>
              <div className="text-[12px] font-medium">08/27</div>
            </div>
          </div>
        </div>

        {/* CVC field */}
        <PhoneFieldLabel>CVC / CVV</PhoneFieldLabel>
        <PhoneInput
          value={cvc}
          onChange={handleChange}
          type="tel"
          placeholder="•••"
          error={fieldState === 'error'}
          suffix={
            fieldState === 'valid' ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
              </span>
            ) : fieldState === 'error' ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
              </span>
            ) : null
          }
        />

        <div className="mt-2 min-h-[28px]">
          {fieldState === 'error' && (
            <div className="flex items-start gap-1.5 text-[11px] text-red-600 dark:text-red-400">
              <AlertTriangle className="mt-[1px] h-3 w-3 shrink-0" />
              <span className="flex-1">{errorMessage}</span>
              <button
                type="button"
                className="shrink-0 underline decoration-dotted underline-offset-2 hover:text-red-700 dark:hover:text-red-300"
              >
                Помощь
              </button>
            </div>
          )}
          {fieldState === 'valid' && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3" strokeWidth={3} />
              Код подтверждён
            </div>
          )}
          {fieldState === 'idle' && (
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 dark:text-neutral-500">
              <Lock className="h-3 w-3" />
              3 цифры на обратной стороне карты
            </div>
          )}
        </div>

        {/* Help row */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-neutral-100 p-3 text-[11px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            Где найти CVC?
          </div>
          <button type="button" className="font-medium text-emerald-600 dark:text-emerald-400">
            Показать
          </button>
        </div>
      </div>

      <PhoneBottomBar>
        <button
          type="button"
          disabled={!isValid}
          className={cn(
            'h-12 w-full rounded-full text-[15px] font-semibold text-white transition-all',
            isValid
              ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
              : 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700',
          )}
        >
          Оплатить 9 680 ₽
        </button>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
