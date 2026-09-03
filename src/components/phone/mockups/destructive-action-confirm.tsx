'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Trash2, AlertTriangle, X, Undo2, Folder } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  icon?: string;
  title?: string;
  consequences?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
};

const DEFAULT_ITEMS = [
  { id: 1, name: 'Проект «Альфа».fig', meta: '2.3 МБ · изменён сегодня' },
  { id: 2, name: 'Скриншоты бренда', meta: '14 файлов · 8.7 МБ' },
  { id: 3, name: 'Старые макеты', meta: '38 файлов · 22.4 МБ' },
  { id: 4, name: 'Резервная копия', meta: '1.1 ГБ · 3 дня назад' },
];

type Pending = { itemId: number; countdown: number; canConfirm: boolean };

/**
 * DestructiveActionConfirmMockup — list with delete buttons. Tap delete opens
 * a modal with red icon + title + consequences (3 items with red X) + a
 * "Удалить" button that is disabled for 3 sec with a live countdown, while
 * "Отмена" is the default focus. After confirm: item fades out + snackbar
 * "Удалено. Отменить" for 5 sec.
 */
export function DestructiveActionConfirmMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const title = cfg.title ?? 'Удалить без возможности восстановления?';
  const consequences =
    Array.isArray(cfg.consequences) && cfg.consequences.length > 0
      ? cfg.consequences.slice(0, 3)
      : [
          'Все файлы в проекте будут удалены навсегда',
          'Доступ у соавторов будет прекращён мгновенно',
          'Восстановить проект будет невозможно',
        ];
  const confirmLabel = cfg.confirmLabel ?? 'Удалить';
  const cancelLabel = cfg.cancelLabel ?? 'Отмена';

  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [pending, setPending] = useState<Pending | null>(null);
  const [removed, setRemoved] = useState<{ id: number; item: typeof DEFAULT_ITEMS[number] } | null>(null);
  const [snackbarProgress, setSnackbarProgress] = useState(100);
  const [undoFlash, setUndoFlash] = useState(false);
  const countdownRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, []);

  function startDelete(itemId: number) {
    setPending({ itemId, countdown: 3, canConfirm: false });
    if (countdownRef.current) window.clearInterval(countdownRef.current);
    countdownRef.current = window.setInterval(() => {
      setPending((prev) => {
        if (!prev) return prev;
        const next = prev.countdown - 1;
        if (next <= 0) {
          if (countdownRef.current) {
            window.clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return { ...prev, countdown: 0, canConfirm: true };
        }
        return { ...prev, countdown: next, canConfirm: false };
      });
    }, 1000);
  }

  function cancelDelete() {
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setPending(null);
  }

  function confirmDelete() {
    if (!pending || !pending.canConfirm) return;
    const item = items.find((x) => x.id === pending.itemId);
    if (!item) {
      cancelDelete();
      return;
    }
    setItems((prev) => prev.filter((x) => x.id !== item.id));
    setRemoved({ id: item.id, item });
    setSnackbarProgress(100);
    setPending(null);

    const start = Date.now();
    const dur = 5000;
    countdownRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / dur) * 100);
      setSnackbarProgress(pct);
      if (pct <= 0 && countdownRef.current) {
        window.clearInterval(countdownRef.current);
        countdownRef.current = null;
        setRemoved(null);
      }
    }, 60);
  }

  function undo() {
    if (!removed) return;
    const current = removed;
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setUndoFlash(true);
    window.setTimeout(() => setUndoFlash(false), 700);
    setItems((prev) => {
      const exists = prev.some((x) => x.id === current.id);
      if (exists) return prev;
      const originalIdx = DEFAULT_ITEMS.findIndex((x) => x.id === current.id);
      const insertAt = originalIdx >= 0 ? originalIdx : prev.length;
      const next = [...prev];
      next.splice(insertAt, 0, current.item);
      return next;
    });
    setRemoved(null);
    setSnackbarProgress(100);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Файлы"
        left={<ChevronLeft className="h-4 w-4" />}
        right={<span className="text-[11px] text-neutral-400">{items.length}</span>}
      />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto pb-24">
        <AnimatePresence initial={false}>
          {items.map((it) => (
            <motion.div
              key={it.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: undoFlash && removed === null ? 1 : 1 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className={cn(
                'flex items-center gap-3 border-b border-neutral-100 bg-white px-3 py-3 dark:border-neutral-800 dark:bg-neutral-900',
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                <Folder className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                  {it.name}
                </div>
                <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                  {it.meta}
                </div>
              </div>
              <button
                type="button"
                onClick={() => startDelete(it.id)}
                aria-label={`Удалить ${it.name}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
            <Folder className="mb-2 h-8 w-8 opacity-30" />
            <div className="text-[12px]">Все элементы удалены</div>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {pending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelDelete}
              className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 6 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              className="relative w-full max-w-[260px] rounded-2xl bg-white p-4 shadow-2xl dark:bg-neutral-900"
            >
              <button
                type="button"
                onClick={cancelDelete}
                aria-label="Закрыть"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100 dark:bg-red-950/60 dark:ring-red-900">
                  <AlertTriangle className="h-6 w-6 text-red-500" strokeWidth={2.2} />
                </div>
              </div>

              <h3 className="mt-3 text-center text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {title}
              </h3>

              <ul className="mt-3 space-y-1.5">
                {consequences.map((c, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/70">
                      <X className="h-3 w-3 text-red-500" strokeWidth={3} />
                    </span>
                    <span className="text-[11px] leading-snug text-neutral-600 dark:text-neutral-300">
                      {c}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={!pending.canConfirm}
                  className={cn(
                    'relative h-11 w-full overflow-hidden rounded-full text-[13px] font-semibold text-white transition-all',
                    pending.canConfirm
                      ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                      : 'cursor-not-allowed bg-red-600/40',
                  )}
                >
                  {!pending.canConfirm && (
                    <motion.span
                      key={pending.countdown}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 1, ease: 'linear' }}
                      className="absolute inset-y-0 left-0 bg-red-600/40"
                    />
                  )}
                  <span className="relative">
                    {pending.canConfirm
                      ? confirmLabel
                      : `${confirmLabel} · ${pending.countdown}`}
                  </span>
                </button>
                <button
                  type="button"
                  autoFocus
                  onClick={cancelDelete}
                  className="h-10 w-full rounded-full border border-neutral-200 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
                >
                  {cancelLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Snackbar "Удалено. Отменить" */}
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
              <span className="text-[12px] font-medium text-white">Удалено</span>
              <button
                type="button"
                onClick={undo}
                className="flex items-center gap-1 text-[12px] font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Отменить
              </button>
            </div>
            <div className="h-0.5 w-full bg-white/10">
              <div
                className="h-full bg-emerald-400 transition-[width] duration-75 ease-linear"
                style={{ width: `${snackbarProgress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
