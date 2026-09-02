'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, Star } from 'lucide-react';
import { MockupScreen } from './_shared';
import { cn } from '@/lib/utils';

type SkeletonConfig = {
  items?: number;
  type?: 'list' | 'cards';
};

type ListItem = {
  name: string;
  subtitle: string;
  price?: string;
  rating?: number;
};

const LIST_DATA: ListItem[] = [
  { name: 'Анна К.', subtitle: 'Отзыв о заказе · 2 мин назад', rating: 4.9 },
  { name: 'Сергей П.', subtitle: 'Новый подписчик', rating: 4.6 },
  { name: 'Мария В.', subtitle: 'Лайкнула ваш товар', rating: 4.7 },
  { name: 'Дмитрий Л.', subtitle: 'Комментарий: «Отлично»', rating: 4.5 },
  { name: 'Ольга Н.', subtitle: 'Поделилась в соцсетях', rating: 4.8 },
];

const CARD_DATA: ListItem[] = [
  { name: 'Кроссовки Air Max', subtitle: 'Кроссовки', price: '8 990 ₽', rating: 4.8 },
  { name: 'Худи оверсайз', subtitle: 'Одежда', price: '3 490 ₽', rating: 4.6 },
  { name: 'Кепка логотип', subtitle: 'Аксессуары', price: '1 290 ₽', rating: 4.7 },
  { name: 'Носки x3', subtitle: 'Одежда', price: '690 ₽', rating: 4.5 },
];

const AVATAR_COLORS = [
  'bg-rose-100 dark:bg-rose-900/40',
  'bg-emerald-100 dark:bg-emerald-900/40',
  'bg-amber-100 dark:bg-amber-900/40',
  'bg-teal-100 dark:bg-teal-900/40',
  'bg-pink-100 dark:bg-pink-900/40',
];

/**
 * SkeletonScreenMockup — скелетоны с пульсацией, плавный crossfade в реальный контент.
 */
export function SkeletonScreenMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as SkeletonConfig;
  const type: 'list' | 'cards' = cfg.type === 'cards' ? 'cards' : 'list';
  const count = Math.max(1, Math.min(8, typeof cfg.items === 'number' ? cfg.items : 5));

  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 2000);
    return () => window.clearTimeout(t);
  }, []);

  function handleRefresh() {
    if (spinning || loading) return;
    setSpinning(true);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSpinning(false);
    }, 1500);
  }

  const data = type === 'list' ? LIST_DATA : CARD_DATA;
  const visible = data.slice(0, count);

  return (
    <MockupScreen className="bg-neutral-50 dark:bg-neutral-950">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex h-11 items-center justify-between border-b border-neutral-100 bg-white/95 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        <span className="text-[15px] font-bold text-neutral-900 dark:text-white">Лента</span>
        <button
          type="button"
          onClick={handleRefresh}
          aria-label="Обновить ленту"
          className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <motion.span animate={{ rotate: spinning ? 360 : 0 }} transition={{ duration: 0.8, ease: 'easeInOut', repeat: spinning ? Infinity : 0 }}>
            <RefreshCw className="h-4 w-4" />
          </motion.span>
        </button>
      </div>

      <div className="relative h-[calc(100%-2.75rem)] overflow-y-auto p-3">
        {/* Skeleton layer */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 space-y-2 p-1"
            >
              {Array.from({ length: count }).map((_, i) => (
                <SkeletonRow key={i} type={type} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real content */}
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              {visible.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900"
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-neutral-700 dark:text-neutral-200',
                      AVATAR_COLORS[i % AVATAR_COLORS.length],
                    )}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                      {item.subtitle}
                    </div>
                  </div>
                  {type === 'cards' && item.price && (
                    <div className="text-[13px] font-bold text-neutral-900 dark:text-white">
                      {item.price}
                    </div>
                  )}
                  {item.rating && (
                    <div className="flex items-center gap-0.5 text-[11px] font-medium text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      {item.rating}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MockupScreen>
  );
}

function SkeletonRow({ type }: { type: 'list' | 'cards' }) {
  if (type === 'cards') {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-neutral-900">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-2.5 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-3 w-10 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-neutral-900">
      <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-2.5 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
