'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Check, ShoppingBag, Tag, Sparkles } from 'lucide-react';
import { MockupScreen, PhoneNavBar, PhoneBottomBar } from './_shared';
import { cn } from '@/lib/utils';

type BundleItem = {
  name: string;
  price: string;
  bundledPrice: string;
  selected: boolean;
  color?: string;
};

type BundleConfig = {
  mainProduct?: { name: string; price: string };
  bundleItems?: BundleItem[];
  discount?: string;
};

const DEFAULT_MAIN = { name: 'Кофеварка BARISTA Pro', price: '14 990 ₽' };
const DEFAULT_BUNDLE: BundleItem[] = [
  {
    name: 'Кофе в зернах Brazil 1 кг',
    price: '1 490 ₽',
    bundledPrice: '1 190 ₽',
    selected: true,
    color: '#92400e',
  },
  {
    name: 'Молочник 350 мл',
    price: '890 ₽',
    bundledPrice: '690 ₽',
    selected: true,
    color: '#e5e7eb',
  },
  {
    name: 'Фильтры бумажные x50',
    price: '390 ₽',
    bundledPrice: '290 ₽',
    selected: false,
    color: '#fde68a',
  },
];

function num(s: string) {
  return parseInt(s.replace(/\D/g, ''), 10) || 0;
}

/**
 * BundleCrossSellMockup — комплектная покупка (cross-sell).
 * Сверху основной товар. Ниже «С этим товаром покупают» — дополнительные
 * товары с чекбоксами, старой ценой и комплектной ценой.
 * Итог обновляется при переключении, показывается «Вы экономите N ₽».
 */
export function BundleCrossSellMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as BundleConfig;
  const main = cfg.mainProduct ?? DEFAULT_MAIN;
  const initialBundle = cfg.bundleItems ?? DEFAULT_BUNDLE;
  const discountLabel = cfg.discount ?? 'Вы экономите 2 490 ₽';

  const [bundle, setBundle] = useState<BundleItem[]>(initialBundle);
  const [added, setAdded] = useState(false);

  function toggle(i: number) {
    setBundle((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], selected: !next[i].selected };
      return next;
    });
  }

  const { totalStr, savingsStr, selectedCount } = useMemo(() => {
    const mainNum = num(main.price);
    let sum = mainNum;
    let regular = mainNum;
    let count = 1;
    for (const b of bundle) {
      if (b.selected) {
        sum += num(b.bundledPrice);
        regular += num(b.price);
        count++;
      }
    }
    return {
      totalStr: `${sum.toLocaleString('ru-RU')} ₽`,
      savingsStr: `${(regular - sum).toLocaleString('ru-RU')} ₽`,
      selectedCount: count,
    };
  }, [bundle, main.price]);

  function addToCart() {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Товар" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="h-[calc(100%-7rem)] overflow-y-auto pb-3">
        {/* Main product */}
        <div className="mt-2 px-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-950">
              <span className="text-[20px]">☕</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                {main.name}
              </div>
              <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                В наличии
              </div>
            </div>
            <div className="text-[14px] font-bold text-neutral-900 dark:text-white">
              {main.price}
            </div>
          </div>
        </div>

        {/* Cross-sell heading */}
        <div className="mt-4 px-3">
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-neutral-700 dark:text-neutral-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            С этим товаром покупают
          </div>
        </div>

        {/* Bundle items */}
        <div className="space-y-2 px-3">
          {bundle.map((b, i) => (
            <motion.button
              type="button"
              key={b.name}
              onClick={() => toggle(i)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'flex w-full items-center gap-3 rounded-2xl border-2 bg-white p-3 text-left shadow-sm transition-colors dark:bg-neutral-900',
                b.selected
                  ? 'border-emerald-500 dark:border-emerald-500'
                  : 'border-transparent ring-1 ring-neutral-200 dark:ring-neutral-800',
              )}
            >
              {/* checkbox */}
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                  b.selected
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-neutral-300 dark:border-neutral-600',
                )}
              >
                {b.selected && (
                  <Check className="h-3 w-3 text-white" strokeWidth={4} />
                )}
              </div>
              {/* image placeholder */}
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white/70"
                style={{ backgroundColor: b.color ?? '#9ca3af' }}
              >
                {b.name.charAt(0)}
              </div>
              {/* name + price */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-medium text-neutral-900 dark:text-white">
                  {b.name}
                </div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
                  <span className="text-neutral-400 line-through">{b.price}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {b.bundledPrice}
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Bundle savings box */}
        <div className="mt-3 px-3">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              <Tag className="h-3.5 w-3.5" />
              Скидка за комплект
            </div>
            <div className="mt-1.5 flex items-end justify-between">
              <div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  Вы экономите
                </div>
                <div className="text-[16px] font-bold text-emerald-700 dark:text-emerald-300">
                  {savingsStr}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  Всего товаров: {selectedCount}
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={totalStr}
                    initial={{ opacity: 0.4, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className="text-[18px] font-bold text-neutral-900 dark:text-white"
                  >
                    {totalStr}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PhoneBottomBar>
        <button
          type="button"
          onClick={addToCart}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} />
              Добавлено
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Купить комплект · {totalStr}
            </>
          )}
        </button>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
