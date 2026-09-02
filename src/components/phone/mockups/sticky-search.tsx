'use client';

import { useMemo, useState } from 'react';
import { Clock, Search, TrendingUp, X } from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
} from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  recent?: string[];
  popular?: string[];
  suggestions?: string[];
};

type Mode = 'discover' | 'suggesting' | 'results';

const DEFAULT_RECENT = ['Зимние ботинки', 'Куртка пуховик', 'Шерстяной шарф'];
const DEFAULT_POPULAR = ['Угги', 'Дутые куртки', 'Шапки', 'Перчатки'];
const DEFAULT_SUGGESTIONS = [
  'Зимние ботинки',
  'Зимние сапоги женские',
  'Зимняя куртка',
  'Зимняя парка',
  'Зимняя обувь',
  'Зимний комбинезон',
];

const FAKE_RESULTS: Record<string, { title: string; meta: string; price: string }[]> = {
  default: [
    { title: 'Товар · 1', meta: '4.8 ★ · 124 отзыва', price: '4 990 ₽' },
    { title: 'Товар · 2', meta: '4.6 ★ · 88 отзывов', price: '6 490 ₽' },
    { title: 'Товар · 3', meta: '4.9 ★ · 312 отзывов', price: '8 990 ₽' },
  ],
};

export function StickySearchMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const recent = Array.isArray(cfg.recent) ? cfg.recent : DEFAULT_RECENT;
  const popular = Array.isArray(cfg.popular) ? cfg.popular : DEFAULT_POPULAR;
  const allSuggestions = Array.isArray(cfg.suggestions) ? cfg.suggestions : DEFAULT_SUGGESTIONS;

  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allSuggestions.slice(0, 6);
    return allSuggestions.filter((s) => s.toLowerCase().includes(q));
  }, [query, allSuggestions]);

  const mode: Mode = submitted
    ? 'results'
    : focused || query.length > 0
      ? 'suggesting'
      : 'discover';

  const pick = (s: string) => {
    setQuery(s);
    setSubmitted(s);
    setFocused(false);
  };

  const clear = () => {
    setQuery('');
    setSubmitted(null);
    setFocused(true);
  };

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      <PhoneNavBar title="Поиск" />

      {/* Sticky search bar — always visible below the nav bar */}
      <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white/95 px-3 py-2 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSubmitted(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 120)}
            placeholder="Поиск товаров"
            className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-9 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:focus:bg-neutral-900"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label="Очистить"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {mode === 'discover' && (
          <div className="space-y-5">
            <section>
              <div className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Clock className="h-3 w-3" /> Недавние
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => pick(r)}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[12px] font-medium text-neutral-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <TrendingUp className="h-3 w-3" /> Популярные
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popular.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => pick(p)}
                    className="flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-[12px] font-medium text-neutral-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {mode === 'suggesting' && (
          <div className="-mx-1">
            <div className="px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
              {query.trim() ? 'Подсказки' : 'Часто ищут'}
            </div>
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-[12px] text-neutral-400 dark:text-neutral-500">
                Ничего не найдено по «{query}»
              </div>
            )}
            {filtered.map((s) => {
              const q = query.trim().toLowerCase();
              const idx = q ? s.toLowerCase().indexOf(q) : -1;
              return (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-[13px] text-neutral-800 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-900"
                >
                  <Search className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                  <span>
                    {idx >= 0 ? (
                      <>
                        {s.slice(0, idx)}
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          {s.slice(idx, idx + q.length)}
                        </span>
                        {s.slice(idx + q.length)}
                      </>
                    ) : (
                      s
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {mode === 'results' && (
          <div style={{ animation: 'ssFade 200ms ease both' }}>
            <div className="mb-2 px-1 text-[12px] text-neutral-500 dark:text-neutral-400">
              Результаты по запросу{' '}
              <span className="font-semibold text-neutral-900 dark:text-white">«{submitted}»</span>
            </div>
            <div className="space-y-2">
              {FAKE_RESULTS.default.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-2.5 dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="h-14 w-14 shrink-0 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {submitted} · {i + 1}
                    </div>
                    <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                      {r.meta}
                    </div>
                    <div className="mt-0.5 text-[12px] font-semibold text-emerald-700 dark:text-emerald-400">
                      {r.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={clear}
              className="mt-4 w-full text-center text-[12px] font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              ← Изменить запрос
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes ssFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </MockupScreen>
  );
}
