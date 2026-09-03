'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Bell, Check, Mail, ChevronRight } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type AltItem = { name: string; price: string; available: boolean };

type OutOfStockConfig = {
  productName?: string;
  variant?: string;
  alternatives?: AltItem[];
};

const DEFAULT_ALTS: AltItem[] = [
  { name: 'Кроссовки Trail Runner', price: '8 490 ₽', available: true },
  { name: 'Кроссовки Street Walk', price: '7 990 ₽', available: true },
  { name: 'Кроссовки Speed Lite', price: '9 490 ₽', available: false },
];

const ALT_COLORS = [
  'from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-950',
  'from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-950',
  'from-rose-100 to-rose-50 dark:from-rose-900/40 dark:to-rose-950',
];

/**
 * OutOfStockRecoveryMockup — карточка товара нет в наличии + recovery:
 *  (a) «Сообщить о появлении» с email-инпутом и подпиской.
 *  (b) «Похожие товары» — 3 альтернативы.
 * Тап по альтернативе → toast «Открыть товар?».
 */
export function OutOfStockRecoveryMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as OutOfStockConfig;
  const productName = cfg.productName ?? 'Кроссовки Air Runner X';
  const variant = cfg.variant ?? 'Размер 42 · Чёрные';
  const alts = cfg.alternatives ?? DEFAULT_ALTS;

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }

  function subscribe() {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setEmailErr('Введите корректный e-mail');
      return;
    }
    setEmailErr(null);
    setSubscribed(true);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Товар" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto pb-4">
        {/* Out of stock banner */}
        <div className="mt-3 px-3">
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 dark:bg-red-950/40">
            <div className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </div>
            <span className="text-[12px] font-bold text-red-700 dark:text-red-300">
              Нет в наличии
            </span>
            <span className="ml-auto text-[10px] text-red-500 dark:text-red-400">
              Сообщим, когда появится
            </span>
          </div>
        </div>

        {/* Greyed product card */}
        <div className="mt-3 px-3">
          <div className="relative flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-neutral-900">
            {/* greyed image */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 opacity-60 dark:from-neutral-800 dark:to-neutral-900">
              <span className="text-[24px] opacity-50 grayscale">👟</span>
            </div>
            <div className="min-w-0 flex-1 opacity-60">
              <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                {productName}
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                {variant}
              </div>
              <div className="mt-1 text-[14px] font-bold text-neutral-900 dark:text-white">
                8 990 ₽
              </div>
            </div>
          </div>
        </div>

        {/* Notify section */}
        <div className="mt-3 px-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
              <Bell className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Сообщить о появлении
            </div>
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="subscribed"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3 py-2.5 dark:bg-emerald-950/40"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-300">
                      Подписка оформлена
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Сообщим на {email} как только товар появится
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailErr) setEmailErr(null);
                      }}
                      placeholder="Ваш e-mail"
                      className={cn(
                        'h-10 w-full rounded-xl border bg-neutral-50 pl-9 pr-3 text-[12px] text-neutral-900 placeholder:text-neutral-400',
                        'focus:outline-none focus:ring-2',
                        emailErr
                          ? 'border-red-300 focus:ring-red-500/30'
                          : 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white',
                      )}
                    />
                    <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                  </div>
                  <AnimatePresence>
                    {emailErr && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 text-[10px] text-red-500"
                      >
                        {emailErr}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={subscribe}
                    disabled={!email.trim()}
                    className={cn(
                      'mt-2 flex h-10 w-full items-center justify-center gap-1.5 rounded-full text-[13px] font-semibold text-white transition-colors',
                      email.trim()
                        ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                        : 'bg-neutral-300 dark:bg-neutral-700',
                    )}
                  >
                    <Bell className="h-3.5 w-3.5" />
                    Подписаться
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Alternatives */}
        <div className="mt-3 px-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
              Похожие товары
            </div>
            <button
              type="button"
              onClick={() => showToast('Открыть все похожие?')}
              className="flex items-center text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              Все <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-2">
            {alts.map((alt, i) => (
              <motion.button
                type="button"
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (alt.available) {
                    showToast(`Открыть товар «${alt.name}»?`);
                  } else {
                    showToast('Этот товар тоже нет в наличии');
                  }
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border bg-white p-2.5 text-left shadow-sm transition-colors dark:bg-neutral-900',
                  alt.available
                    ? 'border-neutral-100 hover:border-emerald-200 dark:border-neutral-800'
                    : 'border-neutral-100 opacity-70 dark:border-neutral-800',
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br',
                    ALT_COLORS[i % ALT_COLORS.length],
                  )}
                >
                  <span className="text-[18px]">👟</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12px] font-semibold text-neutral-900 dark:text-white">
                    {alt.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    {alt.available ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        В наличии
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                        Нет в наличии
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-[13px] font-bold text-neutral-900 dark:text-white">
                    {alt.price}
                  </div>
                  <ChevronRight className="h-3 w-3 text-neutral-400" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-x-3 bottom-3 z-30"
          >
            <div className="flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-2.5 text-white shadow-lg dark:bg-neutral-700">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </div>
              <span className="flex-1 text-[11px] font-medium">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
