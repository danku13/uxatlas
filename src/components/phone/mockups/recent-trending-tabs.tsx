'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Search, TrendingUp, X } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  recent?: string[];
  trending?: string[];
};

const DEFAULT_RECENT = ['Кроссовки Nike', 'Рюкзак городской', 'Куртка зимняя'];
const DEFAULT_TRENDING = ['AirPods Pro', 'Часы Garmin', 'Фен Dyson', 'Чайник Bosch'];

type Tab = 'recent' | 'trending';

/**
 * RecentTrendingTabsMockup — search bar at top + two tabs (Недавние / В тренде).
 * Tapping a chip fills the search bar; tabs slide horizontally.
 */
export function RecentTrendingTabsMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const recent = Array.isArray(cfg.recent) && cfg.recent.length > 0 ? cfg.recent : DEFAULT_RECENT;
  const trending =
    Array.isArray(cfg.trending) && cfg.trending.length > 0 ? cfg.trending : DEFAULT_TRENDING;

  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('recent');

  const items = tab === 'recent' ? recent : trending;

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      <PhoneNavBar
        title="Поиск"
        left={
          <button type="button" aria-label="Назад" className="flex items-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
        right={<span className="text-[12px] font-medium">Отмена</span>}
      />

      {/* Search bar */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Что ищете?"
            className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-8 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Очистить"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3">
        <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => setTab('recent')}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-medium transition-colors',
              tab === 'recent'
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400',
            )}
          >
            <Clock className="h-3 w-3" />
            Недавние
          </button>
          <button
            type="button"
            onClick={() => setTab('trending')}
            className={cn(
              'relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-medium transition-colors',
              tab === 'trending'
                ? 'text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400',
            )}
          >
            <TrendingUp className="h-3 w-3" />
            В тренде
          </button>
          {/* Active indicator */}
          <motion.div
            layout
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm dark:bg-neutral-800"
            animate={{ x: tab === 'recent' ? 0 : 'calc(100% + 4px)' }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            style={{ left: 4 }}
          />
        </div>
      </div>

      {/* Tab content */}
      <div className="relative mt-2 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: tab === 'recent' ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === 'recent' ? 16 : -16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-0 overflow-y-auto px-3 pb-4"
          >
            <div className="mb-2 mt-1 flex items-center gap-1.5 px-1">
              {tab === 'recent' ? (
                <>
                  <Clock className="h-3 w-3 text-neutral-400" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Недавно искали
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Популярно сейчас
                  </span>
                </>
              )}
            </div>

            <div className="space-y-1">
              {items.map((item, i) => {
                const isQuery = query === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors',
                      isQuery
                        ? 'bg-emerald-50 dark:bg-emerald-950/40'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-900',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                        tab === 'recent'
                          ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
                          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
                      )}
                    >
                      {tab === 'recent' ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'flex-1 truncate text-[13px] font-medium',
                        isQuery
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-neutral-800 dark:text-neutral-200',
                      )}
                    >
                      {item}
                    </span>
                    {tab === 'trending' && (
                      <span className="text-[10px] font-bold text-emerald-500">
                        {['+', '+', '+', ''][i] ?? ''}
                        {i + 1}
                      </span>
                    )}
                    {isQuery && (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[9px] font-bold text-white"
                      >
                        выбрано
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint */}
            <div className="mt-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/50">
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Нажмите на запрос, чтобы подставить его в поиск.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </MockupScreen>
  );
}
