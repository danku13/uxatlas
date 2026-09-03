'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  Eye,
  Flame,
  Clock,
  ShoppingBag,
  Bell,
} from 'lucide-react';
import { MockupScreen, PhoneNavBar, PhoneBottomBar } from './_shared';

type ScarcityConfig = {
  viewersCount?: number;
  stockLeft?: number;
  discountEndsIn?: string; // e.g. "02:34:18"
  recentPurchases?: string[];
};

const DEFAULT_RECENT = [
  'Анна из Москвы купила 5 мин назад',
  'Иван из Казани купил 8 мин назад',
  'Мария из Сочи купила 11 мин назад',
];

/**
 * ScarcityUrgencyMockup — экран товара с несколькими триггерами срочности:
 * (1) «N человек смотрят сейчас» с глаз-иконкой (флуктуация ±2).
 * (2) «Осталось N шт» в красном (низкий остаток).
 * (3) Живой countdown «Скидка истекает через HH:MM:SS».
 * (4) Вращающиеся social proof уведомления снизу.
 */
export function ScarcityUrgencyMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as ScarcityConfig;
  const baseViewers = typeof cfg.viewersCount === 'number' ? cfg.viewersCount : 12;
  const stockLeft = typeof cfg.stockLeft === 'number' ? cfg.stockLeft : 2;
  const initialRecent = cfg.recentPurchases ?? DEFAULT_RECENT;

  // ----- viewers count fluctuation -----
  const [viewers, setViewers] = useState(baseViewers);
  useEffect(() => {
    const t = window.setInterval(() => {
      const delta = Math.floor(Math.random() * 5) - 2; // -2..+2
      setViewers((v) => Math.max(3, Math.min(40, v + delta)));
    }, 2200);
    return () => window.clearInterval(t);
  }, []);

  // ----- countdown -----
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const raw = cfg.discountEndsIn ?? '02:34:18';
    const parts = raw.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 9258;
  });
  useEffect(() => {
    const t = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(t);
  }, []);
  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  // ----- rotating social proof -----
  const [notifIdx, setNotifIdx] = useState(0);
  const [showNotif, setShowNotif] = useState(true);
  useEffect(() => {
    let i = 0;
    const cycle = window.setInterval(() => {
      i = (i + 1) % initialRecent.length;
      setNotifIdx(i);
      window.setTimeout(() => setShowNotif(true), 50);
      window.setTimeout(() => setShowNotif(false), 3550);
    }, 6000);
    // initial kick-off (hide after 3.5s)
    const initialHide = window.setTimeout(() => setShowNotif(false), 3500);
    return () => {
      window.clearInterval(cycle);
      window.clearTimeout(initialHide);
    };
  }, []);

  return (
    <MockupScreen className="relative bg-white dark:bg-neutral-950">
      <PhoneNavBar title="Товар" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="h-[calc(100%-7rem)] overflow-y-auto pb-3">
        {/* Product image with urgency badges */}
        <div className="relative mx-3 mt-2 h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 via-amber-50 to-emerald-50 dark:from-rose-900/40 dark:via-amber-950/40 dark:to-emerald-950/40">
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            <Flame className="h-3 w-3" />
            Хит продаж
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
            −30%
          </div>
        </div>

        {/* Product info */}
        <div className="mt-3 px-4">
          <div className="text-[15px] font-bold text-neutral-900 dark:text-white">
            Наушники Studio One
          </div>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-[18px] font-bold text-red-600 dark:text-red-400">
              6 990 ₽
            </span>
            <span className="pb-0.5 text-[11px] text-neutral-400 line-through">
              9 990 ₽
            </span>
          </div>
        </div>

        {/* Urgency cues */}
        <div className="mt-3 space-y-2 px-3">
          {/* (1) viewers count */}
          <motion.div
            key={viewers}
            initial={{ scale: 0.96, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950/30"
          >
            <div className="relative">
              <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <motion.span
                className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            </div>
            <span className="text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
              <span className="font-bold tabular-nums">{viewers}</span> человек смотрят сейчас
            </span>
          </motion.div>

          {/* (2) low stock */}
          <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 dark:bg-red-950/30">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </div>
            <span className="text-[12px] font-bold text-red-700 dark:text-red-300">
              Осталось {stockLeft} шт
            </span>
            <span className="ml-auto text-[10px] text-red-500 dark:text-red-400">
              Заканчивается!
            </span>
          </div>

          {/* (3) countdown */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              <Clock className="h-3 w-3" />
              Скидка истекает через
            </div>
            <div className="flex items-center gap-1.5">
              {[hh, mm, ss].map((part, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <motion.div
                    key={part}
                    initial={{ y: -4, opacity: 0.6 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex h-8 min-w-[2rem] items-center justify-center rounded-md bg-neutral-900 px-1.5 font-mono text-[15px] font-bold tabular-nums text-amber-300 dark:bg-black dark:text-amber-200"
                  >
                    {part}
                  </motion.div>
                  {i < 2 && (
                    <span className="text-[14px] font-bold text-amber-700 dark:text-amber-300">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-3 px-4">
          <div className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Беспроводные наушники с активным шумоподавлением. До 30 часов работы.
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <PhoneBottomBar>
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-red-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800"
        >
          <ShoppingBag className="h-4 w-4" />
          Купить сейчас
        </button>
      </PhoneBottomBar>

      {/* (4) rotating social proof notification */}
      <AnimatePresence>
        {showNotif && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="absolute inset-x-3 bottom-20 z-30"
          >
            <div className="flex items-center gap-2.5 rounded-xl bg-neutral-900/95 px-3 py-2.5 text-white shadow-xl backdrop-blur dark:bg-neutral-800/95">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-medium">
                  {initialRecent[notifIdx]}
                </div>
                <div className="mt-0.5 text-[9px] text-white/60">
                  Только что · проверено
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
