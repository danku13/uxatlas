'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw, ChevronLeft, Bell, Sparkles } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type PullToRefreshConfig = {
  items?: string[];
};

const REFRESHED_ITEMS = [
  'Новая активность в вашем аккаунте',
  'Скидка 30% на избранные товары',
  'Получено 4 новых сообщения',
];

/**
 * PullToRefreshMockup — drag handle + симуляция жеста + pointer events.
 */
export function PullToRefreshMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as PullToRefreshConfig;
  const initialItems = cfg.items ?? [
    'Сегодня 3 новых уведомления',
    'Заказ #F4421 отправлен',
    'Скидка 10% на следующую покупку',
  ];

  const [items, setItems] = useState<string[]>(initialItems);
  const [pull, setPull] = useState(0); // px
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const startY = useRef<number | null>(null);
  const pointerActive = useRef(false);

  const THRESHOLD = 60;

  function triggerRefresh() {
    setRefreshing(true);
    setPull(THRESHOLD);
    window.setTimeout(() => {
      // prepend a "new" item with badge to first item
      const newItems = [...items];
      if (newItems.length > 0) {
        newItems[0] = `[обновлено] ${newItems[0]}`;
      } else {
        newItems.push('Свежие данные загружены');
      }
      // optionally add a fresh item
      const fresh = REFRESHED_ITEMS[refreshCount % REFRESHED_ITEMS.length];
      newItems.unshift(`★ ${fresh}`);
      setItems(newItems);
      setRefreshCount((c) => c + 1);
      setRefreshing(false);
      setPull(0);
    }, 1200);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (refreshing) return;
    startY.current = e.clientY;
    pointerActive.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!pointerActive.current || startY.current === null || refreshing) return;
    const dy = e.clientY - startY.current;
    if (dy <= 0) {
      setPull(0);
      return;
    }
    // resistance: ease out as user pulls further
    const eased = Math.min(THRESHOLD * 1.5, dy * 0.5);
    setPull(eased);
  }
  function onPointerUp() {
    if (!pointerActive.current) return;
    pointerActive.current = false;
    startY.current = null;
    if (pull >= THRESHOLD && !refreshing) {
      triggerRefresh();
    } else {
      setPull(0);
    }
  }

  // Hint animation: pulse the pull handle initially for ~3s
  const [hinting, setHinting] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setHinting(false), 3200);
    return () => window.clearTimeout(t);
  }, []);

  const spinnerRotating = pull > 4 || refreshing;
  const progress = Math.min(1, pull / THRESHOLD);

  return (
    <MockupScreen className="relative overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Уведомления"
        left={<ChevronLeft className="h-4 w-4" />}
      />

      {/* Pull-to-refresh hint zone */}
      <div
        className="absolute inset-x-0 top-11 z-10 touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex flex-col items-center justify-end"
          style={{ height: `${pull}px` }}
        >
          <motion.div
            animate={
              hinting && pull === 0
                ? { y: [0, 6, 0] }
                : { y: 0 }
            }
            transition={
              hinting && pull === 0
                ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0 }
            }
            className="flex flex-col items-center text-neutral-400"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : progress * 270 }}
              transition={
                refreshing
                  ? { duration: 0.8, repeat: Infinity, ease: 'linear' }
                  : { duration: 0.15 }
              }
            >
              <RefreshCw
                className={cn(
                  'h-4 w-4',
                  refreshing ? 'text-emerald-500' : 'text-neutral-400',
                )}
              />
            </motion.div>
            <span className="mt-1 text-[10px] font-medium text-neutral-400">
              {refreshing
                ? 'Обновление…'
                : pull > THRESHOLD * 0.5
                  ? 'Отпустите для обновления'
                  : 'Потяните вниз для обновления'}
            </span>
          </motion.div>
        </div>

        {/* Draggable list */}
        <motion.div
          animate={{ y: pull }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="bg-neutral-50 dark:bg-neutral-950"
          style={{ height: 'calc(100% - 11px)' }}
        >
          {/* Button-triggered refresh (alternative to drag) */}
          <div className="border-b border-neutral-100 px-4 py-2 dark:border-neutral-800">
            <button
              type="button"
              onClick={triggerRefresh}
              disabled={refreshing}
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white py-1.5 text-[11px] font-medium text-neutral-600 shadow-sm transition-colors hover:bg-neutral-100 disabled:opacity-50 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <RefreshCw className={cn('h-3 w-3', refreshing && 'animate-spin')} />
              {refreshing ? 'Обновление…' : 'Обновить список'}
            </button>
          </div>

          <div className="h-[calc(100%-2.25rem)] overflow-y-auto p-3">
            <AnimatePresence initial={false}>
              {items.map((text, i) => (
                <motion.div
                  key={`${i}-${text}`}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    'mb-2 flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900',
                    i === 0 && refreshCount > 0 && 'ring-1 ring-emerald-400',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      i === 0 && refreshCount > 0
                        ? 'bg-emerald-100 dark:bg-emerald-900/40'
                        : 'bg-neutral-100 dark:bg-neutral-800',
                    )}
                  >
                    {i === 0 && refreshCount > 0 ? (
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Bell className="h-3.5 w-3.5 text-neutral-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={cn(
                        'text-[12px] leading-relaxed',
                        i === 0 && refreshCount > 0
                          ? 'font-semibold text-neutral-900 dark:text-white'
                          : 'text-neutral-700 dark:text-neutral-300',
                      )}
                    >
                      {text}
                    </div>
                    <div className="mt-0.5 text-[10px] text-neutral-400">
                      {i === 0 && refreshCount > 0 ? 'Только что' : `${i + 2} ч назад`}
                    </div>
                  </div>
                  {i === 0 && refreshCount > 0 && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      new
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </MockupScreen>
  );
}
