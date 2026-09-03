'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Check, X, Tag, AlertCircle } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type CouponCodeConfig = {
  placeholder?: string;
  validCodes?: string[];
  applied?: string | null;
  subtotal?: string;
  discount?: string;
  total?: string;
};

const DEFAULT_VALID = ['WELCOME10', 'SUMMER20', 'FREESHIP'];

/**
 * CouponCodeInputMockup — поле ввода промокода с валидацией.
 * Если код валиден (напр. «WELCOME10»): зелёная галочка + сообщение
 * «-10% применено» + строка скидки «-899 ₽» в сводке.
 * Если невалиден: красный X + ошибка «Промокод не найден».
 */
export function CouponCodeInputMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as CouponCodeConfig;
  const placeholder = cfg.placeholder ?? 'Введите промокод';
  const validCodes = cfg.validCodes ?? DEFAULT_VALID;
  const initialApplied = cfg.applied ?? null;

  const subtotalStr = cfg.subtotal ?? '8 990 ₽';
  const subtotalNum = parseInt(subtotalStr.replace(/\D/g, ''), 10) || 8990;

  const [code, setCode] = useState(initialApplied ?? '');
  const [applied, setApplied] = useState<string | null>(initialApplied);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>(
    initialApplied ? 'success' : 'idle',
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function apply() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    if (validCodes.map((c) => c.toUpperCase()).includes(trimmed)) {
      setApplied(trimmed);
      setStatus('success');
      setErrorMsg(null);
    } else {
      setStatus('error');
      setErrorMsg('Промокод не найден');
      setApplied(null);
    }
  }
  function remove() {
    setApplied(null);
    setStatus('idle');
    setCode('');
    setErrorMsg(null);
  }

  // compute discount
  const isPercent = applied?.endsWith('10') || applied?.endsWith('20');
  const discountPct = applied === 'WELCOME10' ? 10 : applied === 'SUMMER20' ? 20 : 0;
  const discountNum = applied ? Math.round((subtotalNum * discountPct) / 100) : 0;
  const totalNum = applied ? Math.max(0, subtotalNum - discountNum) : subtotalNum;
  const discountStr = `−${discountNum.toLocaleString('ru-RU')} ₽`;
  const totalStr = `${totalNum.toLocaleString('ru-RU')} ₽`;

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Оформление заказа" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto px-3 pb-4">
        {/* Order preview */}
        <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
          <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Ваш заказ
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-950">
              <Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-neutral-900 dark:text-white">
                Кроссовки Air Runner
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Размер 42 · Чёрные
              </div>
            </div>
            <div className="text-[13px] font-bold text-neutral-900 dark:text-white">
              {subtotalStr}
            </div>
          </div>
        </div>

        {/* Coupon section */}
        <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
            <Tag className="h-3.5 w-3.5" />
            Промокод
          </div>

          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (status !== 'idle') {
                  setStatus('idle');
                  setErrorMsg(null);
                }
              }}
              placeholder={placeholder}
              disabled={!!applied}
              className={cn(
                'h-11 w-full rounded-xl border bg-neutral-50 px-3 pr-20 text-[13px] uppercase tracking-wide text-neutral-900 placeholder:normal-case placeholder:tracking-normal placeholder:text-neutral-400',
                'focus:outline-none focus:ring-2',
                applied
                  ? 'border-emerald-300 bg-emerald-50/40 focus:ring-emerald-500/30 dark:border-emerald-700 dark:bg-emerald-950/30'
                  : status === 'error'
                    ? 'border-red-300 focus:ring-red-500/30'
                    : 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
              )}
            />
            {/* status icon or apply button */}
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              {applied ? (
                <div className="flex items-center gap-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                  </div>
                </div>
              ) : status === 'error' ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                  <X className="h-4 w-4 text-red-500" strokeWidth={3} />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={apply}
                  disabled={!code.trim()}
                  className={cn(
                    'flex h-8 items-center rounded-full px-3 text-[12px] font-semibold transition-colors',
                    code.trim()
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-700 dark:text-neutral-500',
                  )}
                >
                  Применить
                </button>
              )}
            </div>
          </div>

          {/* feedback */}
          <AnimatePresence mode="wait">
            {status === 'success' && applied && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 px-2.5 py-2 dark:bg-emerald-950/40"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  {isPercent
                    ? `-${discountPct}% применено`
                    : `Промокод «${applied}» применён`}
                </div>
                <button
                  type="button"
                  onClick={remove}
                  className="text-[11px] font-medium text-neutral-500 hover:text-red-500 dark:text-neutral-400"
                >
                  Убрать
                </button>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-2 text-[11px] font-medium text-red-600 dark:bg-red-950/40 dark:text-red-300"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* hint */}
          <div className="mt-2 text-[10px] text-neutral-400 dark:text-neutral-500">
            Подсказка: попробуйте <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">WELCOME10</span>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Сводка заказа
          </div>
          <div className="space-y-1.5 text-[12px]">
            <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
              <span>Подытог</span>
              <span>{subtotalStr}</span>
            </div>
            <AnimatePresence>
              {applied && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between font-medium text-emerald-600 dark:text-emerald-400"
                >
                  <span>Скидка ({applied})</span>
                  <span>{discountStr}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
              <span>Доставка</span>
              <span className="text-emerald-600 dark:text-emerald-400">Бесплатно</span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-neutral-100 pt-2 dark:border-neutral-800">
              <span className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                Итого
              </span>
              <motion.span
                key={totalStr}
                initial={{ scale: 0.92, opacity: 0.4 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 280 }}
                className="text-[18px] font-bold text-emerald-600 dark:text-emerald-400"
              >
                {totalStr}
              </motion.span>
            </div>
          </div>
        </div>
      </div>
    </MockupScreen>
  );
}
