'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, AlertTriangle, ToggleLeft, ToggleRight, ChevronLeft } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type CommentItem = { text: string; liked: boolean; likes: number };
type OptimisticUiConfig = {
  items?: CommentItem[];
};

const DEFAULT_ITEMS: CommentItem[] = [
  { text: 'Классный дизайн! Прямо в точку — почувствовал, что это про нас.', liked: false, likes: 12 },
  { text: 'А можно такой же паттерн для десктопа? Было бы супер.', liked: false, likes: 5 },
  { text: 'Согласен, такое часто нужно в B2B-приложениях.', liked: false, likes: 8 },
  { text: 'Закинули в библиотеку паттернов, спасибо!', liked: false, likes: 3 },
];

type PendingState = { id: number; optimisticLiked: boolean; optimisticLikes: number; status: 'pending' | 'error' };

/**
 * OptimisticUiMockup — мгновенная реакция UI на лайк, с возможностью отката.
 */
export function OptimisticUiMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as OptimisticUiConfig;
  const items = cfg.items ?? DEFAULT_ITEMS;

  const [state, setState] = useState<CommentItem[]>(items);
  const [forceError, setForceError] = useState(false);
  const [shakeId, setShakeId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const pendingRef = useRef<Record<number, PendingState>>({});

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }

  function toggleLike(id: number) {
    // Capture fail decision at click time so the deferred check uses a single source of truth.
    const willFail = forceError || Math.random() < 0.2;
    // если был включён forceError — выключаем после одного использования
    if (forceError) setForceError(false);

    setState((prev) => {
      const item = prev[id];
      const newLiked = !item.liked;
      const newLikes = newLiked ? item.likes + 1 : item.likes - 1;

      // сохраняем состояние до отката
      pendingRef.current[id] = {
        id,
        optimisticLiked: newLiked,
        optimisticLikes: newLikes,
        status: 'pending',
      };

      const next = [...prev];
      next[id] = { ...item, liked: newLiked, likes: newLikes };
      return next;
    });

    // Серверный ответ через 800ms
    window.setTimeout(() => {
      const pending = pendingRef.current[id];
      if (!pending) return;

      if (pending.status === 'error') return; // уже обработано

      if (willFail) {
        // откат
        pending.status = 'error';
        setShakeId(id);
        window.setTimeout(() => setShakeId(null), 500);
        showToast('Не удалось — попробуйте ещё раз');
        // откатываем к исходному состоянию
        setState((prev) => {
          const next = [...prev];
          const original = items[id];
          next[id] = { ...original };
          return next;
        });
      }
      // иначе успех — состояние остаётся
      delete pendingRef.current[id];
    }, 800);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Комментарии"
        left={<ChevronLeft className="h-4 w-4" />}
        right={<span className="text-[11px] text-neutral-400">{state.length}</span>}
      />

      <div className="h-[calc(100%-7.5rem)] overflow-y-auto p-3">
        <div className="space-y-2">
          {state.map((c, i) => {
            const isLiked = c.liked;
            const isShaking = shakeId === i;
            return (
              <motion.div
                key={i}
                animate={isShaking ? { x: [0, -4, 4, -3, 3, -2, 2, 0] } : { x: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900"
              >
                <div className="flex gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] leading-relaxed text-neutral-800 dark:text-neutral-200">
                      {c.text}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">
                        {i + 1} час назад
                      </span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleLike(i)}
                          aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
                          className={cn(
                            'flex items-center gap-1 rounded-full px-2 py-1 transition-colors',
                            isLiked
                              ? 'bg-rose-50 dark:bg-rose-950/40'
                              : 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                          )}
                        >
                          <Heart
                            className={cn(
                              'h-3.5 w-3.5 transition-all',
                              isLiked
                                ? 'fill-rose-500 text-rose-500 scale-110'
                                : 'text-neutral-400',
                            )}
                          />
                          <span
                            className={cn(
                              'text-[11px] font-semibold tabular-nums',
                              isLiked
                                ? 'text-rose-500'
                                : 'text-neutral-500 dark:text-neutral-400',
                            )}
                          >
                            {c.likes}
                          </span>
                        </button>
                        {/* +1 floating animation */}
                        <AnimatePresence>
                          {isLiked && (
                            <motion.span
                              initial={{ opacity: 0, y: 0 }}
                              animate={{ opacity: 1, y: -16 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6 }}
                              className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-500"
                            >
                              +1
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-neutral-100 bg-white px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-950">
        <button
          type="button"
          onClick={() => setForceError((v) => !v)}
          aria-pressed={forceError}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors',
            forceError
              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300',
          )}
        >
          {forceError ? (
            <ToggleRight className="h-4 w-4" />
          ) : (
            <ToggleLeft className="h-4 w-4" />
          )}
          Имитировать ошибку
        </button>
        <span className="text-[10px] text-neutral-400">
          {forceError ? 'Следующий лайк упадёт' : '20% шанс ошибки'}
        </span>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-3 top-11 z-40"
          >
            <div className="flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-white shadow-lg">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-[11px] font-medium">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
