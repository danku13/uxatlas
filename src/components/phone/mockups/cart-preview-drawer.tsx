'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, X, Minus, Plus, Trash2 } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type CartItem = {
  name: string;
  variant: string;
  qty: number;
  price: string;
  color?: string;
};

type CartPreviewConfig = {
  items?: CartItem[];
  subtotal?: string;
  delivery?: string;
  total?: string;
};

const DEFAULT_ITEMS: CartItem[] = [
  {
    name: 'Кроссовки Air Runner',
    variant: 'Размер 42 · Чёрные',
    qty: 1,
    price: '8 990 ₽',
    color: '#1f2937',
  },
  {
    name: 'Носки Sport x3',
    variant: 'Белые',
    qty: 2,
    price: '690 ₽',
    color: '#f3f4f6',
  },
  {
    name: 'Бутылка Steel 750',
    variant: 'Графит',
    qty: 1,
    price: '1 290 ₽',
    color: '#6b7280',
  },
];

/**
 * CartPreviewDrawerMockup — экран товара с иконкой корзины в навбаре.
 * Тап по корзине → drawer выезжает справа, показывает состав заказа,
 * степперы количества, кнопки удаления и сводку с CTA «Оформить».
 */
export function CartPreviewDrawerMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as CartPreviewConfig;
  const initialItems = cfg.items ?? DEFAULT_ITEMS;
  const delivery = cfg.delivery ?? 'Бесплатно';

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const count = items.reduce((s, it) => s + it.qty, 0);

  function setQty(i: number, delta: number) {
    setItems((prev) => {
      const next = [...prev];
      const newQty = Math.max(1, next[i].qty + delta);
      next[i] = { ...next[i], qty: newQty };
      return next;
    });
  }
  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  // recompute totals — parse numeric
  const subtotalNum = items.reduce((s, it) => {
    const n = parseInt(it.price.replace(/\D/g, ''), 10) || 0;
    return s + n * it.qty;
  }, 0);
  const subtotal = `${subtotalNum.toLocaleString('ru-RU')} ₽`;
  const total = `${subtotalNum.toLocaleString('ru-RU')} ₽`;

  return (
    <MockupScreen className="relative bg-white dark:bg-neutral-950">
      <PhoneNavBar
        title="Товар"
        left={<ChevronLeft className="h-4 w-4" />}
        right={
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Открыть корзину"
            className="relative flex items-center"
          >
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        }
      />

      {/* faux product detail below nav */}
      <div className="px-4 pt-3">
        <div className="mx-auto mb-3 h-44 rounded-2xl bg-gradient-to-br from-emerald-100 via-emerald-50 to-amber-50 dark:from-emerald-900/40 dark:via-emerald-950 dark:to-amber-950/40" />
        <div className="text-[16px] font-bold text-neutral-900 dark:text-white">
          Кроссовки Air Runner
        </div>
        <div className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
          Лёгкие беговые кроссовки с амортизирующей подошвой.
        </div>
        <div className="mt-2 text-[18px] font-bold text-emerald-600 dark:text-emerald-400">
          8 990 ₽
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-neutral-200 p-3 text-center text-[11px] text-neutral-400 dark:border-neutral-700 dark:text-neutral-500">
          Тапните иконку 🛍 справа сверху, чтобы посмотреть корзину
        </div>
      </div>

      {/* Drawer overlay + panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 bg-black/40"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 flex h-full w-[88%] flex-col bg-white dark:bg-neutral-900"
            >
              {/* Drawer header */}
              <div className="flex h-11 items-center justify-between border-b border-neutral-100 px-3 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                    Корзина · {count}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Закрыть"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
                >
                  <X className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-200" />
                </button>
              </div>

              {/* Items list */}
              <div className="flex-1 overflow-y-auto px-3 py-3">
                {items.length === 0 ? (
                  <div className="mt-12 text-center text-[12px] text-neutral-400">
                    Корзина пуста
                  </div>
                ) : (
                  <ul className="space-y-2">
                    <AnimatePresence initial={false}>
                      {items.map((it, i) => (
                        <motion.li
                          key={`${it.name}-${i}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 30, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-2.5 rounded-xl border border-neutral-100 p-2.5 dark:border-neutral-800"
                        >
                          {/* thumbnail */}
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white/80"
                            style={{ backgroundColor: it.color ?? '#9ca3af' }}
                          >
                            {it.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[12px] font-semibold text-neutral-900 dark:text-white">
                              {it.name}
                            </div>
                            <div className="mt-0.5 truncate text-[10px] text-neutral-500 dark:text-neutral-400">
                              {it.variant}
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              {/* mini stepper */}
                              <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                                <button
                                  type="button"
                                  onClick={() => setQty(i, -1)}
                                  aria-label="Меньше"
                                  className="flex h-6 w-6 items-center justify-center text-neutral-600 dark:text-neutral-300"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="min-w-[1.25rem] text-center text-[11px] font-bold tabular-nums text-neutral-900 dark:text-white">
                                  {it.qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQty(i, 1)}
                                  aria-label="Больше"
                                  className="flex h-6 w-6 items-center justify-center text-neutral-600 dark:text-neutral-300"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="text-[12px] font-bold text-neutral-900 dark:text-white">
                                {it.price}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(i)}
                            aria-label="Удалить"
                            className="flex h-7 w-7 shrink-0 items-center justify-center self-start rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {/* Summary footer */}
              <div className="border-t border-neutral-100 bg-white px-3 pb-4 pt-2 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="space-y-1 pb-2 text-[11px]">
                  <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                    <span>Сумма ({count} тов.)</span>
                    <span>{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                    <span>Доставка</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {delivery}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-1.5 dark:border-neutral-800">
                    <span className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                      Итого
                    </span>
                    <span className="text-[16px] font-bold text-neutral-900 dark:text-white">
                      {total}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={items.length === 0}
                  className={cn(
                    'flex h-11 w-full items-center justify-center rounded-full text-[14px] font-semibold text-white shadow-sm transition-colors',
                    items.length === 0
                      ? 'bg-neutral-300 dark:bg-neutral-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800',
                  )}
                >
                  Оформить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
