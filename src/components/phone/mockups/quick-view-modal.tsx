'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, X, ShoppingBag, Check, ChevronLeft } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Product = {
  name: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviewsCount: number;
  variants: string[];
};

type Cfg = {
  product?: Product;
};

const DEFAULT_PRODUCT: Product = {
  name: 'Кроссовки Air Max',
  price: '8 990 ₽',
  oldPrice: '12 500 ₽',
  rating: 4.8,
  reviewsCount: 1247,
  variants: ['38', '39', '40', '41', '42', '43'],
};

type Card = {
  id: number;
  name: string;
  price: string;
  oldPrice?: string;
  color: string;
  product: Product;
};

const CARDS: Card[] = [
  {
    id: 1,
    name: 'Air Max',
    price: '8 990 ₽',
    oldPrice: '12 500 ₽',
    color: 'bg-emerald-100 dark:bg-emerald-900/40',
    product: {
      name: 'Кроссовки Air Max',
      price: '8 990 ₽',
      oldPrice: '12 500 ₽',
      rating: 4.8,
      reviewsCount: 1247,
      variants: ['38', '39', '40', '41', '42'],
    },
  },
  {
    id: 2,
    name: 'Ботинки Trail',
    price: '11 200 ₽',
    color: 'bg-amber-100 dark:bg-amber-900/40',
    product: {
      name: 'Ботинки Trail Pro',
      price: '11 200 ₽',
      rating: 4.6,
      reviewsCount: 542,
      variants: ['40', '41', '42', '43', '44'],
    },
  },
  {
    id: 3,
    name: 'Кеды Urban',
    price: '5 490 ₽',
    oldPrice: '7 990 ₽',
    color: 'bg-rose-100 dark:bg-rose-900/40',
    product: {
      name: 'Кеды Urban Lite',
      price: '5 490 ₽',
      oldPrice: '7 990 ₽',
      rating: 4.9,
      reviewsCount: 2891,
      variants: ['37', '38', '39', '40', '41'],
    },
  },
  {
    id: 4,
    name: 'Слипоны Wave',
    price: '3 990 ₽',
    color: 'bg-teal-100 dark:bg-teal-900/40',
    product: {
      name: 'Слипоны Wave',
      price: '3 990 ₽',
      rating: 4.4,
      reviewsCount: 218,
      variants: ['36', '37', '38', '39', '40'],
    },
  },
];

/**
 * QuickViewModalMockup — 2x2 catalog grid. Tap "Быстрый просмотр" on a card
 * → modal slides up with: image placeholder, name, price (with old price
 * strikethrough), rating stars + reviews count, variant chips (sizes), and
 * an emerald "В корзину" button. Has a "Закрыть" X button.
 */
export function QuickViewModalMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const product = cfg.product ?? DEFAULT_PRODUCT;

  const [openCard, setOpenCard] = useState<Card | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  function openQuickView(card: Card) {
    setOpenCard(card);
    setSelectedVariant(card.product.variants[Math.floor(card.product.variants.length / 2)] ?? null);
    setAdded(false);
  }

  function close() {
    setOpenCard(null);
  }

  function addToCart() {
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
    }, 1600);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Каталог"
        left={<ChevronLeft className="h-4 w-4" />}
        right={<span className="text-[11px] text-neutral-400">{CARDS.length}</span>}
      />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2.5">
          {CARDS.map((card) => (
            <div
              key={card.id}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className={cn('relative aspect-square w-full', card.color)}>
                <span className="absolute left-1.5 top-1.5 rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-200">
                  {card.name}
                </span>
                {card.oldPrice && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    −{Math.round((1 - parseFloat(card.price.replace(/[^\d.]/g, '')) / parseFloat(card.oldPrice.replace(/[^\d.]/g, ''))) * 100)}%
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => openQuickView(card)}
                  className="absolute inset-x-1.5 bottom-1.5 flex h-7 items-center justify-center gap-1 rounded-full bg-neutral-900/85 text-[10px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-neutral-900 dark:bg-white/85 dark:text-neutral-900 dark:hover:bg-white"
                >
                  <ShoppingBag className="h-3 w-3" />
                  Быстрый просмотр
                </button>
              </div>
              <div className="px-2 py-1.5">
                <div className="truncate text-[11px] font-medium text-neutral-900 dark:text-white">
                  {card.product.name}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-[12px] font-bold text-neutral-900 dark:text-white">
                    {card.price}
                  </span>
                  {card.oldPrice && (
                    <span className="text-[10px] text-neutral-400 line-through">
                      {card.oldPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick view modal */}
      <AnimatePresence>
        {openCard && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.button
              type="button"
              aria-label="Закрыть"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="relative max-h-[88%] overflow-y-auto rounded-t-2xl bg-white px-4 pb-4 pt-3 dark:bg-neutral-900"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <button
                type="button"
                onClick={close}
                aria-label="Закрыть"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image placeholder */}
              <div className={cn('relative mb-3 flex h-32 items-center justify-center overflow-hidden rounded-xl', 'bg-neutral-100 dark:bg-neutral-800')}>
                <div className={cn('absolute inset-0', CARDS.find((c) => c.id === openCard.id)?.color ?? 'bg-emerald-100')} />
                <ShoppingBag className="relative h-10 w-10 text-neutral-500/40" strokeWidth={1.5} />
                {openCard.product.oldPrice && (
                  <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    Скидка
                  </span>
                )}
              </div>

              <h3 className="pr-8 text-[16px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {openCard.product.name}
              </h3>

              {/* Price + rating row */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[18px] font-bold text-neutral-900 dark:text-white">
                  {openCard.product.price}
                </span>
                {openCard.product.oldPrice && (
                  <span className="text-[12px] text-neutral-400 line-through">
                    {openCard.product.oldPrice}
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => {
                    const fill = Math.max(0, Math.min(1, openCard.product.rating - i));
                    return (
                      <span key={i} className="relative h-3.5 w-3.5">
                        <Star className="absolute inset-0 h-3.5 w-3.5 text-neutral-300 dark:text-neutral-700" />
                        <span
                          className="absolute inset-0 overflow-hidden"
                          style={{ width: `${fill * 100}%` }}
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        </span>
                      </span>
                    );
                  })}
                </div>
                <span className="text-[12px] font-semibold text-neutral-900 dark:text-white">
                  {openCard.product.rating.toFixed(1)}
                </span>
                <span className="text-[11px] text-neutral-400">
                  · {openCard.product.reviewsCount.toLocaleString('ru-RU')} отзывов
                </span>
              </div>

              {/* Variants */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
                    Размер
                  </span>
                  <button className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    Таблица размеров
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {openCard.product.variants.map((v) => {
                    const isSel = selectedVariant === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          'flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[12px] font-semibold transition-all',
                          isSel
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200',
                        )}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={addToCart}
                disabled={!selectedVariant || added}
                className={cn(
                  'mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold text-white shadow-sm transition-colors',
                  added
                    ? 'bg-emerald-700'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50',
                )}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                      Добавлено в корзину
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      В корзину · {openCard.product.price}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <p className="mt-2 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
                Доставка завтра · Бесплатный возврат 14 дней
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
