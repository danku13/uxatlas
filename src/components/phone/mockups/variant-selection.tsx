'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Heart, Check, ShoppingBag } from 'lucide-react';
import { MockupScreen, PhoneNavBar, PhoneBottomBar } from './_shared';
import { cn } from '@/lib/utils';

type ColorOpt = { name: string; hex: string; available: boolean };
type SizeOpt = { label: string; available: boolean };

type VariantSelectionConfig = {
  productName?: string;
  price?: string;
  colors?: ColorOpt[];
  sizes?: SizeOpt[];
};

const DEFAULT_COLORS: ColorOpt[] = [
  { name: 'Чёрный', hex: '#1f2937', available: true },
  { name: 'Песочный', hex: '#d4b896', available: true },
  { name: 'Хаки', hex: '#6b7253', available: true },
  { name: 'Бордо', hex: '#7f1d1d', available: false },
];

const DEFAULT_SIZES: SizeOpt[] = [
  { label: 'XS', available: true },
  { label: 'S', available: true },
  { label: 'M', available: true },
  { label: 'L', available: false },
  { label: 'XL', available: true },
];

/**
 * VariantSelectionMockup — выбор цвета и размера товара.
 * Цвет — круги с hex-заливкой, выбранный с emerald ring.
 * Недоступные варианты — серые и перечёркнутые.
 * Кнопка «В корзину» активна только после выбора обоих.
 */
export function VariantSelectionMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as VariantSelectionConfig;
  const productName = cfg.productName ?? 'Куртка bomber RIVERA';
  const price = cfg.price ?? '8 990 ₽';
  const colors = cfg.colors ?? DEFAULT_COLORS;
  const sizes = cfg.sizes ?? DEFAULT_SIZES;

  const [colorIdx, setColorIdx] = useState<number | null>(
    colors.findIndex((c) => c.available) >= 0
      ? colors.findIndex((c) => c.available)
      : null,
  );
  const [sizeIdx, setSizeIdx] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const selectedColor = colorIdx !== null ? colors[colorIdx] : null;
  const selectedSize = sizeIdx !== null ? sizes[sizeIdx] : null;
  const canAdd =
    !!selectedColor &&
    !!selectedSize &&
    selectedColor.available &&
    selectedSize.available;

  function handleAdd() {
    if (!canAdd) return;
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <MockupScreen className="relative bg-white dark:bg-neutral-950">
      <PhoneNavBar
        title="Товар"
        left={<ChevronLeft className="h-4 w-4" />}
        right={
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
            className="flex items-center"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-all',
                liked
                  ? 'fill-rose-500 text-rose-500 scale-110'
                  : 'text-neutral-400',
              )}
            />
          </button>
        }
      />

      <div className="h-[calc(100%-7rem)] overflow-y-auto pb-3">
        {/* Image area */}
        <div
          className="relative mx-3 mt-2 h-44 overflow-hidden rounded-2xl"
          style={{
            background: selectedColor
              ? `linear-gradient(135deg, ${selectedColor.hex} 0%, ${selectedColor.hex}cc 100%)`
              : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)',
          }}
        >
          {/* faux product silhouette */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center">
            <div className="mb-3 h-28 w-32 rounded-t-full bg-black/10" />
          </div>
          <div className="absolute left-3 top-3 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-neutral-700 backdrop-blur">
            {productName}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
            −25%
          </div>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between px-4">
          <div>
            <div className="text-[18px] font-bold text-neutral-900 dark:text-white">
              {price}
            </div>
            <div className="text-[11px] text-neutral-400 line-through">
              11 990 ₽
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            ★ 4.8 · 124 отзывов
          </div>
        </div>

        {/* Color section */}
        <div className="mt-4 px-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
              Цвет
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {selectedColor ? selectedColor.name : 'Выберите цвет'}
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((c, i) => {
              const selected = colorIdx === i;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!c.available}
                  onClick={() => setColorIdx(i)}
                  aria-label={`Цвет: ${c.name}`}
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-full transition-all',
                    selected
                      ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-950'
                      : 'ring-1 ring-neutral-200 dark:ring-neutral-700',
                    !c.available && 'opacity-40',
                  )}
                >
                  <span
                    className="h-7 w-7 rounded-full"
                    style={{ backgroundColor: c.hex }}
                  />
                  {!c.available && (
                    <span
                      className="absolute inset-0 m-auto h-9 w-px rotate-45 bg-neutral-400"
                      aria-hidden
                    />
                  )}
                  {selected && (
                    <Check
                      className="absolute h-3.5 w-3.5 text-white drop-shadow"
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size section */}
        <div className="mt-4 px-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
              Размер
            </div>
            <button
              type="button"
              className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              Таблица размеров
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => {
              const selected = sizeIdx === i;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!s.available}
                  onClick={() => setSizeIdx(i)}
                  className={cn(
                    'relative flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border px-2 text-[12px] font-semibold transition-all',
                    selected
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-neutral-200 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
                    !s.available &&
                      'border-neutral-100 bg-neutral-50 text-neutral-300 line-through dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-600',
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status / availability hint */}
        <div className="mt-4 px-4">
          <AnimatePresence mode="wait">
            {!canAdd ? (
              <motion.div
                key="hint"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-[11px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                {selectedColor && !selectedSize
                  ? 'Выберите размер, чтобы продолжить'
                  : !selectedColor && selectedSize
                    ? 'Выберите цвет, чтобы продолжить'
                    : 'Выберите цвет и размер'}
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                <Check className="h-3.5 w-3.5" />
                {selectedColor?.name} · {selectedSize?.label} — в наличии
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <PhoneBottomBar>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canAdd}
          className={cn(
            'flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold text-white shadow-sm transition-all',
            canAdd
              ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
              : 'bg-neutral-300 dark:bg-neutral-700',
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} />
              Добавлено
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              В корзину
            </>
          )}
        </button>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
