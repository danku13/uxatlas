'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  Coffee,
  Sparkles,
  Archive,
  Check,
} from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
} from './_shared';
import { cn } from '@/lib/utils';

type InboxZeroCelebrationConfig = {
  emoji?: string;
  title?: string;
  body?: string;
};

// Confetti particles — fixed positions for deterministic render
const CONFETTI = Array.from({ length: 16 }).map((_, i) => ({
  id: i,
  x: 10 + (i * 5.5) % 80, // percent
  delay: (i % 8) * 0.06,
  rotate: (i * 37) % 360,
  color: ['bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-emerald-500', 'bg-amber-500'][i % 5],
  size: i % 2 === 0 ? 'h-1.5 w-1.5' : 'h-1 w-2',
}));

/**
 * InboxZeroCelebrationMockup — celebratory empty inbox.
 * Большой эмодзи с bounce, заголовок/тело, конфетти из мелких частиц,
 * кнопка «Отдохнуть» + ссылка «Посмотреть архив».
 */
export function InboxZeroCelebrationMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as InboxZeroCelebrationConfig;
  const emoji = cfg.emoji ?? '🎉';
  const title = cfg.title ?? 'Входящие пусты!';
  const body = cfg.body ?? 'Вы расправились со всеми письмами. Прекрасная работа — самое время выдохнуть.';

  const [resting, setResting] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  // Re-trigger confetti every 6 seconds
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setBurst((b) => b + 1), 6000);
    return () => window.clearInterval(t);
  }, []);

  // Sparkles around the emoji (5 small ones)
  const sparkles = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        top: [-8, 30, -4, 60, 10][i],
        left: [-10, 90, 100, 5, 105][i],
        size: [10, 8, 12, 9, 11][i],
        delay: i * 0.15,
      })),
    [],
  );

  return (
    <MockupScreen className="relative flex flex-col overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white dark:from-emerald-950/30 dark:via-neutral-950 dark:to-neutral-950">
      <PhoneNavBar
        left={<ChevronLeft className="h-4 w-4" />}
        title="Входящие"
        right={
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            0
          </span>
        }
      />

      {/* Confetti layer */}
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        {CONFETTI.map((c) => (
          <motion.div
            key={`${c.id}-${burst}`}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{ y: 320, opacity: [0, 1, 1, 0], rotate: c.rotate }}
            transition={{
              duration: 2.2,
              delay: c.delay,
              repeat: 0,
              ease: 'easeOut',
            }}
            className={cn('absolute rounded-sm', c.color, c.size)}
            style={{ left: `${c.x}%`, top: 40 }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Hero emoji with sparkles */}
        <div className="relative mb-2">
          {sparkles.map((s) => (
            <motion.div
              key={s.id}
              animate={{ scale: [0.6, 1, 0.6], opacity: [0, 1, 0], rotate: [0, 90, 180] }}
              transition={{ duration: 2, delay: s.delay, repeat: Infinity }}
              className="absolute"
              style={{ top: `${s.top}px`, left: `${s.left}px` }}
            >
              <Sparkles className="text-amber-400" style={{ width: s.size, height: s.size }} />
            </motion.div>
          ))}

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white text-[44px] shadow-lg shadow-emerald-500/15 ring-4 ring-emerald-100 dark:bg-neutral-900 dark:ring-emerald-950"
          >
            {emoji}
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {resting ? (
            <motion.div
              key="resting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 14, stiffness: 280 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950"
              >
                <Coffee className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <h2 className="mt-3 text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
                Приятного отдыха!
              </h2>
              <p className="mt-1 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Мы напишем, если появится что-то срочное.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="celebrate"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-[22px] font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {title}
              </h1>
              <p className="mt-2 max-w-[230px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {body}
              </p>

              {/* Stats row */}
              <div className="mt-5 flex gap-2">
                <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-neutral-900">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400">Сегодня</div>
                  <div className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400">12 писем</div>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-neutral-900">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400">Время</div>
                  <div className="text-[14px] font-bold text-neutral-900 dark:text-white">7 мин</div>
                </div>
                <div className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-neutral-900">
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400">Серия</div>
                  <div className="text-[14px] font-bold text-amber-500">🔥 5</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Archive peek */}
      <AnimatePresence>
        {showArchive && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute inset-x-3 bottom-20 z-20"
          >
            <div className="rounded-2xl bg-white p-3 shadow-lg ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10">
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Archive className="h-3 w-3" />
                Недавнее в архиве
              </div>
              <div className="space-y-1.5">
                {[
                  { from: 'Дизайн-команда', subj: 'Релиз 2.4', date: 'вчера' },
                  { from: 'Поддержка', subj: 'Чек #1042', date: 'пн' },
                  { from: 'Анна К.', subj: 'Re: встреча', date: 'сб' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg px-1.5 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                    <div className="min-w-0">
                      <div className="truncate text-[11px] font-semibold text-neutral-900 dark:text-white">
                        {m.from}
                      </div>
                      <div className="truncate text-[10px] text-neutral-500 dark:text-neutral-400">
                        {m.subj}
                      </div>
                    </div>
                    <span className="text-[9px] text-neutral-400 dark:text-neutral-500">{m.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PhoneBottomBar>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setResting((v) => !v)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            {resting ? (
              <>
                <Check className="h-4 w-4" strokeWidth={3} />
                Продолжить работу
              </>
            ) : (
              <>
                <Coffee className="h-4 w-4" />
                Отдохнуть
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowArchive((v) => !v)}
            className="flex w-full items-center justify-center gap-1 text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <Archive className="h-3.5 w-3.5" />
            {showArchive ? 'Скрыть архив' : 'Посмотреть архив'}
          </button>
        </div>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
