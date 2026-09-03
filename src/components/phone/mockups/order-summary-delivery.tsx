'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Check,
  X,
  Package,
  Truck,
} from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
  PhonePrimaryButton,
} from './_shared';

type Cfg = {
  address?: string;
  deliveryDate?: string;
  itemsCount?: number;
  itemsTotal?: string;
  delivery?: string;
  total?: string;
};

/**
 * OrderSummaryDeliveryMockup — checkout summary screen.
 * Address card with inline edit, delivery estimate, items count + total,
 * delivery row (green "Бесплатно"), separator, bold total, sticky pay bar.
 */
export function OrderSummaryDeliveryMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const initialAddress = cfg.address ?? 'Москва, ул. Тверская, 12, кв 47';
  const deliveryDate = cfg.deliveryDate ?? 'Завтра, до 21:00';
  const itemsCount = typeof cfg.itemsCount === 'number' ? cfg.itemsCount : 3;
  const itemsTotal = cfg.itemsTotal ?? '12 980 ₽';
  const delivery = cfg.delivery ?? 'Бесплатно';
  const total = cfg.total ?? '12 980 ₽';

  const [address, setAddress] = useState(initialAddress);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialAddress);
  const [paid, setPaid] = useState(false);

  function startEdit() {
    setDraft(address);
    setEditing(true);
  }

  function saveEdit() {
    if (draft.trim().length > 0) {
      setAddress(draft.trim());
    }
    setEditing(false);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(address);
  }

  if (paid) {
    return (
      <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
        <PhoneNavBar title="Оформление заказа" left={<ChevronLeft className="h-4 w-4" />} />
        <div
          className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          style={{ animation: 'osdFade 300ms ease both' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
            <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
          </div>
          <h2 className="mt-6 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Заказ оформлен
          </h2>
          <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Доставка {deliveryDate.toLowerCase()}. Чек отправлен на почту.
          </p>
          <button
            type="button"
            onClick={() => setPaid(false)}
            className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Повторить сценарий
          </button>
        </div>
        <style jsx>{`
          @keyframes osdFade {
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
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Оформление заказа" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="h-[calc(100%-3rem)] overflow-y-auto pb-24">
        {/* Address card */}
        <div className="mt-3 px-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <MapPin className="h-3 w-3" />
              Адрес доставки
            </div>

            <AnimatePresence mode="wait">
              {!editing ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-neutral-900 dark:text-white">
                      {address}
                    </div>
                    <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                      Квартира · код домофона 4271
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={startEdit}
                    className="shrink-0 text-[12px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    Изменить
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <input
                    autoFocus
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit();
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-[13px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="flex h-9 flex-1 items-center justify-center gap-1 rounded-full bg-emerald-600 text-[12px] font-semibold text-white hover:bg-emerald-700"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="flex h-9 flex-1 items-center justify-center gap-1 rounded-full border border-neutral-200 text-[12px] font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      <X className="h-3.5 w-3.5" />
                      Отмена
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Delivery estimate card */}
        <div className="mt-2 px-3">
          <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Срок доставки
              </div>
              <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                {deliveryDate}
              </div>
            </div>
            <button
              type="button"
              className="text-[12px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Изменить
            </button>
          </div>
        </div>

        {/* Items summary */}
        <div className="mt-2 px-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              <Package className="h-3 w-3" />
              Состав заказа
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-[13px] text-neutral-600 dark:text-neutral-300">
                Товары ({itemsCount})
              </span>
              <span className="text-[13px] font-medium text-neutral-900 dark:text-white">
                {itemsTotal}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="flex items-center gap-1 text-[13px] text-neutral-600 dark:text-neutral-300">
                <Truck className="h-3.5 w-3.5" />
                Доставка
              </span>
              <span className="text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">
                {delivery}
              </span>
            </div>
            <div className="my-2 h-px bg-neutral-100 dark:bg-neutral-800" />
            <div className="flex items-center justify-between py-1">
              <span className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                Итого
              </span>
              <span className="text-[18px] font-bold text-neutral-900 dark:text-white">
                {total}
              </span>
            </div>
          </div>
        </div>

        {/* Payment method preview */}
        <div className="mt-2 px-3">
          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-12 items-center justify-center rounded-md bg-neutral-100 text-[10px] font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                VISA
              </div>
              <div>
                <div className="text-[12px] font-medium text-neutral-900 dark:text-white">
                  •• 4242
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Способ оплаты
                </div>
              </div>
            </div>
            <button
              type="button"
              className="text-[12px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              Изменить
            </button>
          </div>
        </div>
      </div>

      {/* Sticky pay bar */}
      <PhoneBottomBar>
        <PhonePrimaryButton onClick={() => setPaid(true)}>
          Оплатить {total}
        </PhonePrimaryButton>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
