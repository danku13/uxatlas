'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Trash2, Undo2, Bell } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Item = {
  id: number;
  title: string;
  subtitle: string;
};

type Cfg = {
  items?: Item[];
  undoWindow?: number;
};

const DEFAULT_ITEMS: Item[] = [
  { id: 1, title: 'Заказ доставлен', subtitle: 'Ваш заказ #4821 доставлён' },
  { id: 2, title: 'Новое сообщение', subtitle: 'Анна: Спасибо за помощь!' },
  { id: 3, title: 'Скидка 20% на всё', subtitle: 'Только до конца недели' },
];

type Removed = { item: Item; originalIdx: number };

/**
 * SwipeToDeleteUndoMockup — list with 3 items. Drag a row left with pointer
 * events to reveal a red "Удалить" action; if dragged past threshold, the row
 * slides out and a snackbar with countdown progress appears for the undo
 * window (5 sec). Tap "Отменить" — item slides back in.
 */
export function SwipeToDeleteUndoMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const initialItems =
    Array.isArray(cfg.items) && cfg.items.length > 0 ? (cfg.items as Item[]) : DEFAULT_ITEMS;
  const undoWindow =
    typeof cfg.undoWindow === 'number' && cfg.undoWindow > 0 ? cfg.undoWindow : 5000;

  const [items, setItems] = useState<Item[]>(initialItems);
  const [dragId, setDragId] = useState<number | null>(null);
  const [offsets, setOffsets] = useState<Record<number, number>>({});
  const [removed, setRemoved] = useState<Removed | null>(null);
  const [progress, setProgress] = useState(100);

  const startRef = useRef<{ x: number; y: number; id: number; horizontal: boolean | null } | null>(null);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (progressRef.current) window.clearInterval(progressRef.current);
    };
  }, []);

  function clearTimers() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressRef.current) {
      window.clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }

  function onPointerDown(e: React.PointerEvent, id: number) {
    startRef.current = { x: e.clientX, y: e.clientY, id, horizontal: null };
    setDragId(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const start = startRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (start.horizontal === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        start.horizontal = Math.abs(dx) > Math.abs(dy);
      }
      if (!start.horizontal) return;
    }
    const clamped = Math.max(-130, Math.min(0, dx));
    setOffsets((prev) => ({ ...prev, [start.id]: clamped }));
  }

  function onPointerUp() {
    const start = startRef.current;
    startRef.current = null;
    if (!start) return;
    const off = offsets[start.id] ?? 0;
    setDragId(null);

    if (off <= -100) {
      // complete the swipe
      setOffsets((prev) => ({ ...prev, [start.id]: -400 }));
      window.setTimeout(() => doRemove(start.id), 220);
    } else {
      setOffsets((prev) => ({ ...prev, [start.id]: 0 }));
    }
  }

  function doRemove(id: number) {
    let removedItem: Item | null = null;
    let removedIdx = -1;
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0) return prev;
      removedItem = prev[idx];
      removedIdx = idx;
      const next = prev.filter((x) => x.id !== id);
      return next;
    });
    setOffsets((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // schedule snackbar after we've captured the removed item via state updater above
    window.setTimeout(() => {
      if (!removedItem) return;
      setRemoved({ item: removedItem, originalIdx: removedIdx });
      setProgress(100);

      clearTimers();
      const startTs = Date.now();
      progressRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTs;
        const pct = Math.max(0, 100 - (elapsed / undoWindow) * 100);
        setProgress(pct);
        if (pct <= 0 && progressRef.current) {
          window.clearInterval(progressRef.current);
          progressRef.current = null;
          setRemoved(null);
        }
      }, 60);

      timerRef.current = window.setTimeout(() => {
        setRemoved(null);
      }, undoWindow);
    }, 0);
  }

  function undo() {
    if (!removed) return;
    const current = removed;
    clearTimers();
    setItems((prev) => {
      if (prev.some((x) => x.id === current.item.id)) return prev;
      const next = [...prev];
      const insertAt = Math.min(current.originalIdx, next.length);
      next.splice(insertAt, 0, current.item);
      return next;
    });
    setRemoved(null);
    setProgress(100);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Уведомления"
        left={<ChevronLeft className="h-4 w-4" />}
        right={<span className="text-[11px] text-neutral-400">{items.length}</span>}
      />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto pb-24">
        <div className="px-4 pb-1 pt-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Сегодня · потяните влево, чтобы удалить
        </div>

        <AnimatePresence initial={false}>
          {items.map((it) => {
            const off = offsets[it.id] ?? 0;
            return (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="relative overflow-hidden border-b border-neutral-100 dark:border-neutral-800"
              >
                {/* Red action background */}
                <div className="absolute inset-0 flex items-center justify-end bg-red-500 px-4">
                  <div className="flex items-center gap-1.5 text-white">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-[12px] font-semibold">Удалить</span>
                  </div>
                </div>

                {/* Foreground row */}
                <div
                  onPointerDown={(e) => onPointerDown(e, it.id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                  className={cn(
                    'relative flex touch-pan-y items-center gap-3 bg-white px-4 py-3 dark:bg-neutral-900',
                    dragId === it.id ? 'cursor-grabbing' : 'cursor-grab',
                  )}
                  style={{
                    transform: `translateX(${off}px)`,
                    transition: dragId === it.id ? 'none' : 'transform 220ms ease-out',
                  }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
                    <Bell className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {it.title}
                    </div>
                    <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                      {it.subtitle}
                    </div>
                  </div>
                  {off < -10 && (
                    <span className="shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {off <= -100 ? 'Отпустите' : 'Тяните'}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
            <Bell className="mb-2 h-8 w-8 opacity-30" />
            <div className="text-[12px]">Нет уведомлений</div>
          </div>
        )}
      </div>

      {/* Snackbar */}
      <AnimatePresence>
        {removed && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="absolute inset-x-3 bottom-3 z-40 overflow-hidden rounded-xl bg-neutral-900 shadow-xl dark:bg-neutral-800"
          >
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="truncate pr-2 text-[12px] font-medium text-white">
                «{removed.item.title}» удалено
              </span>
              <button
                type="button"
                onClick={undo}
                className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Отменить
              </button>
            </div>
            <div className="h-0.5 w-full bg-white/10">
              <div
                className="h-full bg-emerald-400 transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
