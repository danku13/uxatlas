'use client';

import { useState } from 'react';
import { ArrowLeft, Bell, SearchX } from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
} from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  query?: string;
  suggestions?: string[];
  categories?: string[];
};

const DEFAULT_SUGGESTIONS = ['Зимние ботинки', 'Угги', 'Дутые куртки', 'Шерстяной шарф'];
const DEFAULT_CATEGORIES = ['Обувь', 'Верхняя одежда', 'Аксессуары', 'Спорт'];

export function EmptySearchMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const initialQuery = cfg.query ?? 'зимние шлёпанцы';
  const suggestions = Array.isArray(cfg.suggestions) ? cfg.suggestions : DEFAULT_SUGGESTIONS;
  const categories = Array.isArray(cfg.categories) ? cfg.categories : DEFAULT_CATEGORIES;

  const [query, setQuery] = useState(initialQuery);
  const [notified, setNotified] = useState(false);

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      <PhoneNavBar
        left={
          <button type="button" aria-label="Назад" className="flex items-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
        title="Поиск"
      />

      {/* Read-only query bar */}
      <div className="border-b border-neutral-100 px-3 py-2 dark:border-neutral-800">
        <div className="relative">
          <SearchX className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск товаров"
            className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Empty state hero */}
        <div
          className="flex flex-col items-center pt-8 text-center"
          style={{ animation: 'esFade 250ms ease both' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
            <SearchX className="h-9 w-9 text-neutral-400 dark:text-neutral-500" />
          </div>
          <h2 className="mt-5 text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Ничего не найдено
          </h2>
          <p className="mt-2 max-w-[230px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Попробуйте изменить запрос или загляните в популярные категории ниже.
          </p>
        </div>

        {/* Maybe you meant */}
        <section className="mt-8">
          <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Возможно вы искали
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[12px] font-medium text-neutral-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Popular categories */}
        <section className="mt-6">
          <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Популярные категории
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c, i) => (
              <button
                key={c}
                type="button"
                className={cn(
                  'flex h-12 items-center justify-center rounded-xl border text-[12px] font-medium transition-colors',
                  i % 2 === 0
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950'
                    : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/60',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom: notify when available */}
      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setNotified((n) => !n)}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-[12px] font-medium transition-colors',
            notified
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
              : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900',
          )}
        >
          <Bell className={cn('h-3.5 w-3.5', notified && 'fill-emerald-500/30')} />
          {notified ? 'Мы сообщим, когда появится' : 'Сообщить о появлении'}
        </button>
      </div>

      <style jsx>{`
        @keyframes esFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </MockupScreen>
  );
}
