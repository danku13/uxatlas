'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trash2, ChevronLeft, Star, Undo2 } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type EmailItem = {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  color: string;
  initials: string;
  unread?: boolean;
};

type SnackbarConfig = {
  message?: string;
  action?: string;
};

const INITIAL: EmailItem[] = [
  {
    id: 1,
    sender: 'Apple',
    subject: 'Receipt for your purchase',
    preview: 'Спасибо за покупку. Ваш заказ #F4421...',
    color: 'bg-neutral-200 dark:bg-neutral-700',
    initials: 'A',
    unread: true,
  },
  {
    id: 2,
    sender: 'Google Workspace',
    subject: 'Security alert',
    preview: 'Новое устройство вошло в аккаунт...',
    color: 'bg-amber-100 dark:bg-amber-900/40',
    initials: 'G',
  },
  {
    id: 3,
    sender: 'LinkedIn',
    subject: 'You have 4 new connections',
    preview: 'Новые люди хотят добавить вас...',
    color: 'bg-emerald-100 dark:bg-emerald-900/40',
    initials: 'in',
    unread: true,
  },
  {
    id: 4,
    sender: 'Medium Daily',
    subject: 'Today’s recommendations',
    preview: '5 историй, которые мы для вас...',
    color: 'bg-rose-100 dark:bg-rose-900/40',
    initials: 'M',
  },
];

type Snackbar = {
  itemId: number;
  item: EmailItem;
  visible: boolean;
};

/**
 * SnackbarActionMockup — список писем с удалением + Undo snackbar.
 */
export function SnackbarActionMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as SnackbarConfig;
  const message = cfg.message ?? 'Письмо удалено';
  const actionLabel = cfg.action ?? 'Отменить';

  const [items, setItems] = useState<EmailItem[]>(INITIAL);
  const [snackbar, setSnackbar] = useState<Snackbar | null>(null);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<number | null>(null);
  const progressRef = useRef<number | null>(null);

  function clearTimers() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (progressRef.current) window.clearInterval(progressRef.current);
    timerRef.current = null;
    progressRef.current = null;
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  function deleteItem(item: EmailItem) {
    // Если уже есть snackbar — предыдущее письмо удаляем окончательно
    if (snackbar) {
      clearTimers();
    }
    setItems((prev) => prev.filter((x) => x.id !== item.id));
    setSnackbar({ itemId: item.id, item, visible: true });
    setProgress(100);

    // progress bar countdown
    const start = Date.now();
    const duration = 5000;
    progressRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct <= 0 && progressRef.current) {
        window.clearInterval(progressRef.current);
        progressRef.current = null;
      }
    }, 50);

    // auto-dismiss
    timerRef.current = window.setTimeout(() => {
      setSnackbar(null);
      // окончательное удаление — письмо уже нет в списке
    }, duration);
  }

  function undo() {
    if (!snackbar) return;
    clearTimers();
    const { item } = snackbar;
    setItems((prev) => {
      // возвращаем на ту же позицию (по id)
      const exists = prev.find((x) => x.id === item.id);
      if (exists) return prev;
      const originalIndex = INITIAL.findIndex((x) => x.id === item.id);
      const insertAt = originalIndex >= 0 ? originalIndex : prev.length;
      const next = [...prev];
      next.splice(insertAt, 0, item);
      return next;
    });
    setSnackbar(null);
    setProgress(100);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Входящие"
        left={<ChevronLeft className="h-4 w-4" />}
        right={<span className="text-[11px] text-neutral-400">{items.length}</span>}
      />

      <div className="h-[calc(100%-3rem)] overflow-y-auto pb-20">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.25 }}
              className={cn(
                'flex items-center gap-3 border-b border-neutral-100 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900',
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-neutral-700 dark:text-neutral-200',
                  item.color,
                )}
              >
                {item.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'truncate text-[13px] text-neutral-900 dark:text-white',
                      item.unread ? 'font-bold' : 'font-medium',
                    )}
                  >
                    {item.sender}
                  </span>
                  {item.unread && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  )}
                </div>
                <div className="truncate text-[12px] text-neutral-600 dark:text-neutral-300">
                  {item.subject}
                </div>
                <div className="truncate text-[11px] text-neutral-400 dark:text-neutral-500">
                  {item.preview}
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteItem(item)}
                aria-label={`Удалить письмо от ${item.sender}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
            <Star className="mb-2 h-8 w-8 opacity-30" />
            <div className="text-[12px]">Папка пуста</div>
          </div>
        )}
      </div>

      {/* Snackbar */}
      <AnimatePresence>
        {snackbar && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="absolute inset-x-3 bottom-3 z-40 overflow-hidden rounded-xl bg-neutral-900 shadow-xl dark:bg-neutral-800"
          >
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[12px] font-medium text-white">{message}</span>
              <button
                type="button"
                onClick={undo}
                className="flex items-center gap-1 text-[12px] font-semibold text-emerald-400 transition-colors hover:text-emerald-300"
              >
                <Undo2 className="h-3.5 w-3.5" />
                {actionLabel}
              </button>
            </div>
            {/* Progress bar */}
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
