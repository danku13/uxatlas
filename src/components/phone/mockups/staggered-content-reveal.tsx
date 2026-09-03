'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  Check,
  RefreshCw,
  CircleUser,
} from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
} from './_shared';
import { cn } from '@/lib/utils';

type StaggeredContentRevealConfig = {
  itemCount?: number;
  delayStep?: number;
};

type CardItem = {
  id: number;
  name: string;
  handle: string;
  initials: string;
  color: string;
};

const SAMPLE: Omit<CardItem, 'id'>[] = [
  { name: 'Анна Ковалёва', handle: '@anna_k', initials: 'АК', color: 'bg-emerald-500' },
  { name: 'Михаил Орлов', handle: '@m.orlov', initials: 'МО', color: 'bg-amber-500' },
  { name: 'Елена Зорина', handle: '@elenaz', initials: 'ЕЗ', color: 'bg-rose-500' },
  { name: 'Дмитрий Соколов', handle: '@d.sokol', initials: 'ДС', color: 'bg-emerald-600' },
  { name: 'Ольга Ветрова', handle: '@olga_v', initials: 'ОВ', color: 'bg-amber-600' },
  { name: 'Игорь Лазарев', handle: '@igor_l', initials: 'ИЛ', color: 'bg-rose-600' },
  { name: 'Мария Кузнецова', handle: '@maria_k', initials: 'МК', color: 'bg-emerald-700' },
  { name: 'Павель Громов', handle: '@p.gromov', initials: 'ПГ', color: 'bg-amber-700' },
];

/**
 * StaggeredContentRevealMockup — staggered list reveal.
 * Пустой список. Кнопка «Загрузить» показывает N элементов один за другим
 * с шагом delayStep (по умолчанию 80 мс). Каждый элемент — faux карточка
 * с аватаром + заголовком + подписью. После появления всех — toast «Готово».
 */
export function StaggeredContentRevealMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as StaggeredContentRevealConfig;
  const itemCount = typeof cfg.itemCount === 'number' && cfg.itemCount > 0 ? Math.min(cfg.itemCount, 8) : 6;
  const delayStep = typeof cfg.delayStep === 'number' && cfg.delayStep > 0 ? cfg.delayStep : 80;

  const [loadedCount, setLoadedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const doneTimerRef = useRef<number | null>(null);

  // Build items list (clamped to SAMPLE length)
  const items: CardItem[] = SAMPLE.slice(0, itemCount).map((s, i) => ({ ...s, id: i + 1 }));

  useEffect(() => {
    return () => {
      if (doneTimerRef.current) window.clearTimeout(doneTimerRef.current);
    };
  }, []);

  function startLoad() {
    if (loading) return;
    setLoadedCount(0);
    setDone(false);
    setLoading(true);

    items.forEach((_, i) => {
      window.setTimeout(() => {
        setLoadedCount(i + 1);
        if (i + 1 === items.length) {
          setLoading(false);
          doneTimerRef.current = window.setTimeout(() => setDone(true), 300);
        }
      }, delayStep * (i + 1));
    });
  }

  function reset() {
    setLoadedCount(0);
    setDone(false);
    setLoading(false);
  }

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Подписки"
        left={<ChevronLeft className="h-4 w-4" />}
        right={
          <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
            {loadedCount}/{itemCount}
          </span>
        }
      />

      {/* Progress bar */}
      <div className="px-3 pt-2">
        <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <motion.div
            animate={{ width: `${(loadedCount / itemCount) * 100}%` }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="h-full rounded-full bg-emerald-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pt-3">
        {loadedCount === 0 ? (
          <EmptyState itemCount={itemCount} delayStep={delayStep} />
        ) : (
          <ul className="space-y-2">
            <AnimatePresence>
              {items.slice(0, loadedCount).map((it, idx) => (
                <motion.li
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 14, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 280 }}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900',
                    idx === loadedCount - 1 && loading && 'ring-1 ring-emerald-300 dark:ring-emerald-700',
                  )}
                >
                  {/* Avatar */}
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white', it.color)}>
                    {it.initials}
                  </div>

                  {/* Body */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {it.name}
                    </div>
                    <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                      {it.handle} · обновлено только что
                    </div>
                  </div>

                  {/* Trailing badge */}
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <CircleUser className="h-2.5 w-2.5" />
                    друг
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>

            {/* Skeletons for upcoming items */}
            {loading &&
              items.slice(loadedCount).map((it) => (
                <li key={`s-${it.id}`} className="flex items-center gap-3 rounded-2xl bg-white p-3 dark:bg-neutral-900">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-2.5 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      <PhoneBottomBar>
        {done ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-[13px] font-semibold text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Снова
            </button>
            <button
              type="button"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 text-[13px] font-semibold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
            >
              <Check className="h-4 w-4" strokeWidth={3} />
              Готово
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startLoad}
            disabled={loading}
            className={cn(
              'flex h-11 w-full items-center justify-center gap-2 rounded-full text-[14px] font-semibold text-white transition-all',
              loading
                ? 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800',
            )}
          >
            {loading ? 'Загрузка...' : loadedCount > 0 ? 'Загрузить снова' : 'Загрузить'}
          </button>
        )}
      </PhoneBottomBar>

      {/* "Готово" toast */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ type: 'spring', damping: 18, stiffness: 320 }}
            className="absolute inset-x-3 top-12 z-50"
          >
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-lg">
              <Check className="h-3 w-3" strokeWidth={3} />
              Готово · загружено {itemCount} элементов
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}

function EmptyState({ itemCount, delayStep }: { itemCount: number; delayStep: number }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 pt-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
        <CircleUser className="h-7 w-7 text-neutral-400 dark:text-neutral-500" />
      </div>
      <h2 className="mt-4 text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white">
        Список пуст
      </h2>
      <p className="mt-1.5 max-w-[220px] text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
        Нажмите «Загрузить», чтобы показать {itemCount} элементов с шагом {delayStep} мс.
      </p>
    </div>
  );
}
