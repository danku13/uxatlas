'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, MapPin, Truck, Store, Package } from 'lucide-react';
import {
  MockupScreen,
  PhoneFieldLabel,
  PhoneInput,
  PhonePrimaryButton,
} from './_shared';
import { cn } from '@/lib/utils';

type SectionDef = {
  title: string;
  options: string[];
};

type Cfg = {
  sections?: SectionDef[];
};

type DeliveryMethod = 'pickup' | 'courier' | 'post';

const STORES = ['Магазин на Тверской', 'ТЦ Атриум', 'ТЦ Охотный ряд'];

/**
 * ConditionalFieldsMockup — checkout form with radio buttons for delivery
 * method. Selecting each reveals a different conditional section with a
 * smooth slide-down animation via AnimatePresence.
 */
export function ConditionalFieldsMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const sections =
    Array.isArray(cfg.sections) && cfg.sections.length > 0
      ? cfg.sections
      : [{ title: 'Способ получения', options: ['Самовывоз', 'Курьером', 'Почтой'] }];

  const [method, setMethod] = useState<DeliveryMethod | null>(null);
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [postOffice, setPostOffice] = useState('');
  const [store, setStore] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const options = sections[0]?.options ?? ['Самовывоз', 'Курьером', 'Почтой'];
  const methodIcons: Record<DeliveryMethod, typeof Truck> = {
    pickup: Store,
    courier: Truck,
    post: Package,
  };
  const methodLabels: Record<DeliveryMethod, string> = {
    pickup: options[0] ?? 'Самовывоз',
    courier: options[1] ?? 'Курьером',
    post: options[2] ?? 'Почтой',
  };

  const canSubmit = (() => {
    if (!method) return false;
    if (method === 'pickup') return !!store;
    if (method === 'courier') return address.trim().length > 3;
    if (method === 'post') return zip.length >= 5 && postOffice.trim().length > 0;
    return false;
  })();

  if (done) {
    return (
      <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
        <div className="flex h-11 items-center px-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Оформление
          </span>
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          style={{ animation: 'cfFade 300ms ease both' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
            <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
          </div>
          <h2 className="mt-6 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Заказ оформлен
          </h2>
          <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {method ? `Способ: ${methodLabels[method]}.` : ''} Мы отправим
            подтверждение на почту.
          </p>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setMethod(null);
              setAddress('');
              setZip('');
              setPostOffice('');
              setStore(null);
            }}
            className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Повторить сценарий
          </button>
        </div>
        <style jsx>{`
          @keyframes cfFade {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </MockupScreen>
    );
  }

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      {/* Top bar */}
      <div className="flex h-11 items-center justify-between px-3">
        <button
          type="button"
          aria-label="Назад"
          className="flex items-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
          Доставка
        </span>
        <span className="w-4" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <h2 className="text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
          {sections[0]?.title ?? 'Способ получения'}
        </h2>
        <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
          Выберите вариант — мы покажем нужные поля.
        </p>

        {/* Radio buttons */}
        <div className="mt-4 space-y-2">
          {(Object.keys(methodLabels) as DeliveryMethod[]).map((m) => {
            const Icon = methodIcons[m];
            const sel = method === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
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
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                    {methodLabels[m]}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {m === 'pickup' && 'Готово сегодня, бесплатно'}
                    {m === 'courier' && 'Завтра, 250 ₽'}
                    {m === 'post' && '3–5 дней, по тарифам Почты'}
                  </div>
                </div>
                <div
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full border transition-colors',
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

        {/* Conditional fields with AnimatePresence slide-down */}
        <AnimatePresence initial={false}>
          {method === 'courier' && (
            <motion.div
              key="courier"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <PhoneFieldLabel>Адрес доставки</PhoneFieldLabel>
                <PhoneInput
                  value={address}
                  onChange={setAddress}
                  placeholder="ул. Пушкина, 10, кв. 25"
                  suffix={<MapPin className="h-4 w-4 text-neutral-400" />}
                />
                <p className="mt-1.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                  Доставим завтра с 10:00 до 18:00
                </p>
              </div>
            </motion.div>
          )}

          {method === 'pickup' && (
            <motion.div
              key="pickup"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <PhoneFieldLabel>Выберите магазин</PhoneFieldLabel>
                <div className="space-y-2">
                  {STORES.map((s) => {
                    const sel = store === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStore(s)}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all',
                          sel
                            ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40'
                            : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700',
                        )}
                      >
                        <Store className="h-4 w-4 text-neutral-400" />
                        <span className="flex-1 text-[12px] font-medium text-neutral-800 dark:text-neutral-200">
                          {s}
                        </span>
                        {sel && <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {method === 'post' && (
            <motion.div
              key="post"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-4">
                <div>
                  <PhoneFieldLabel>Почтовый индекс</PhoneFieldLabel>
                  <PhoneInput
                    value={zip}
                    onChange={(v) => setZip(v.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    type="tel"
                  />
                </div>
                <div>
                  <PhoneFieldLabel>Отделение Почты</PhoneFieldLabel>
                  <PhoneInput
                    value={postOffice}
                    onChange={setPostOffice}
                    placeholder="Москва, ул. Лесная, 7"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <PhonePrimaryButton disabled={!canSubmit} onClick={() => setDone(true)}>
          Оформить заказ
        </PhonePrimaryButton>
      </div>
    </MockupScreen>
  );
}
