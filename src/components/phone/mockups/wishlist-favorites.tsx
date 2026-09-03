'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { ChevronLeft, Heart, ShoppingBag, Trash2, TrendingDown } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type WishItem = {
  name: string;
  price: string;
  priceDropped: boolean;
  oldPrice?: string;
};

type WishlistConfig = {
  items?: WishItem[];
};

const DEFAULT_ITEMS: WishItem[] = [
  {
    name: 'Сумка Tote 12L',
    price: '4 990 ₽',
    priceDropped: true,
    oldPrice: '6 490 ₽',
  },
  {
    name: 'Рюкзак Urban 22L',
    price: '7 990 ₽',
    priceDropped: false,
  },
  {
    name: 'Кошелёк Leather',
    price: '2 290 ₽',
    priceDropped: true,
    oldPrice: '2 790 ₽',
  },
  {
    name: 'Чемодан Travel 28"',
    price: '12 490 ₽',
    priceDropped: false,
  },
];

const CARD_COLORS = [
  'bg-amber-100 dark:bg-amber-900/40',
  'bg-rose-100 dark:bg-rose-900/40',
  'bg-emerald-100 dark:bg-emerald-900/40',
  'bg-violet-100 dark:bg-violet-900/40',
];

/**
 * WishlistFavoritesMockup — экран избранного.
 * Список с товарами: иконка-сердечка (можно убрать), кнопка «В корзину».
 * Если цена снизилась — amber-бейдж «Снизилась цена!» + старая цена зачёркнута.
 * Свайп влево открывает кнопку «Удалить».
 */
export function WishlistFavoritesMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as WishlistConfig;
  const initial = cfg.items ?? DEFAULT_ITEMS;

  const [items, setItems] = useState<WishItem[]>(initial);
  const [toast, setToast] = useState<string | null>(null);
  const [removedIdx, setRemovedIdx] = useState<number | null>(null);
  const toastTimer = useRef<number | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2200);
  }

  function onDragEnd(i: number, info: PanInfo) {
    if (info.offset.x < -60) {
      // reveal delete / we delete directly for simplicity
      setRemovedIdx(i);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((_, idx) => idx !== i));
        setRemovedIdx(null);
        showToast('Товар удалён из избранного');
      }, 220);
    }
  }

  function quickRemove(i: number) {
    setRemovedIdx(i);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((_, idx) => idx !== i));
      setRemovedIdx(null);
      showToast('Товар удалён из избранного');
    }, 220);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Избранное"
        left={<ChevronLeft className="h-4 w-4" />}
        right={<span className="text-[11px] text-neutral-400">{items.length}</span>}
      />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto px-3 py-3">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
              <Heart className="h-7 w-7 text-neutral-300 dark:text-neutral-700" />
            </div>
            <div className="mt-3 text-[13px] font-medium text-neutral-700 dark:text-neutral-200">
              В избранном пусто
            </div>
            <div className="mt-1 text-[11px] text-neutral-400">
              Нажмите на сердечко у товара, чтобы сохранить его
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {items.map((it, i) => (
                <motion.li
                  key={`${it.name}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: removedIdx === i ? 0 : 1,
                    y: 0,
                    height: removedIdx === i ? 0 : 'auto',
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="relative overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900"
                >
                  {/* delete action behind */}
                  <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-end bg-red-500 px-3">
                    <div className="flex flex-col items-center gap-0.5 text-white">
                      <Trash2 className="h-4 w-4" />
                      <span className="text-[10px] font-semibold">Удалить</span>
                    </div>
                  </div>

                  <motion.div
                    drag="x"
                    dragConstraints={{ left: -90, right: 0 }}
                    dragElastic={0.08}
                    onDragEnd={(_, info) => onDragEnd(i, info)}
                    whileDrag={{ scale: 0.99 }}
                    className="relative flex items-center gap-3 rounded-2xl bg-white p-2.5 dark:bg-neutral-900"
                  >
                    {/* image */}
                    <div
                      className={cn(
                        'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
                        CARD_COLORS[i % CARD_COLORS.length],
                      )}
                    >
                      <ShoppingBag className="h-6 w-6 text-neutral-500 dark:text-neutral-400" strokeWidth={1.5} />
                    </div>

                    {/* content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-[12px] font-semibold text-neutral-900 dark:text-white">
                            {it.name}
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-neutral-900 dark:text-white">
                              {it.price}
                            </span>
                            {it.priceDropped && it.oldPrice && (
                              <span className="text-[10px] text-neutral-400 line-through">
                                {it.oldPrice}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* heart */}
                        <button
                          type="button"
                          onClick={() => quickRemove(i)}
                          aria-label="Убрать из избранного"
                          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                        </button>
                      </div>

                      {/* badges + actions */}
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {it.priceDropped && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                            <TrendingDown className="h-2.5 w-2.5" />
                            Снизилась цена!
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => showToast(`«${it.name}» в корзине`)}
                          className="ml-auto flex h-7 items-center gap-1 rounded-full bg-emerald-600 px-2.5 text-[10px] font-semibold text-white transition-colors hover:bg-emerald-700"
                        >
                          <ShoppingBag className="h-3 w-3" />
                          В корзину
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}

        {/* Hint at bottom */}
        {items.length > 0 && (
          <div className="mt-3 px-1 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
            Свайп влево, чтобы удалить товар
          </div>
        )}
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
                <Heart className="h-3 w-3 fill-current text-white" />
              </div>
              <span className="flex-1 text-[11px] font-medium">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
