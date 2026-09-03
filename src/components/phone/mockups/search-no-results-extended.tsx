'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  SearchX,
  Bell,
  Check,
  Mail,
  ChevronRight,
} from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
} from './_shared';
import { cn } from '@/lib/utils';

type SearchNoResultsExtendedConfig = {
  query?: string;
  similar?: string[];
  popularCategories?: string[];
  subscribeCta?: string;
};

const DEFAULT_SIMILAR = ['Зимние ботинки', 'Угги зимние', 'Дутые сапоги', 'Тёплые ботинки'];
const DEFAULT_CATEGORIES = ['Обувь', 'Верхняя одежда', 'Аксессуары', 'Спорт', 'Дом', 'Электроника'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * SearchNoResultsExtendedMockup — расширенный no-results.
 * Поисковая строка с запросом → большой «Ничего не найдено» с SearchX.
 * «Возможно вы искали» (чипы подобных запросов), «Популярные категории» (чипы категорий).
 * Кнопка «Сообщить, когда появится» → форма email → success.
 */
export function SearchNoResultsExtendedMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as SearchNoResultsExtendedConfig;
  const initialQuery = cfg.query ?? 'зимние шлёпанцы';
  const similar = Array.isArray(cfg.similar) && cfg.similar.length > 0 ? cfg.similar : DEFAULT_SIMILAR;
  const categories = Array.isArray(cfg.popularCategories) && cfg.popularCategories.length > 0 ? cfg.popularCategories : DEFAULT_CATEGORIES;
  const subscribeCta = cfg.subscribeCta ?? 'Сообщить, когда появится';

  const [query, setQuery] = useState(initialQuery);
  const [subStage, setSubStage] = useState<'idle' | 'form' | 'success'>('idle');
  const [email, setEmail] = useState('');
  const emailValid = EMAIL_RE.test(email.trim());

  function pickSimilar(s: string) {
    setQuery(s);
    setSubStage('idle');
    setEmail('');
  }

  function pickCategory(c: string) {
    setQuery(c);
    setSubStage('idle');
    setEmail('');
  }

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      <PhoneNavBar
        left={
          <button type="button" aria-label="Назад" className="flex items-center text-emerald-600 dark:text-emerald-400">
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
        title="Поиск"
      />

      {/* Search bar */}
      <div className="border-b border-neutral-100 px-3 py-2 dark:border-neutral-800">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск товаров"
            className="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-3">
        {/* Empty hero */}
        <div className="flex flex-col items-center pt-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-neutral-100 blur-xl dark:bg-neutral-900" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
              <SearchX className="h-9 w-9 text-neutral-400 dark:text-neutral-500" />
            </div>
          </motion.div>

          <h2 className="mt-5 text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Ничего не найдено
          </h2>
          <p className="mt-2 max-w-[230px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            По запросу <span className="font-semibold text-neutral-700 dark:text-neutral-200">«{query}»</span> ничего нет. Попробуйте изменить запрос или подпишитесь, чтобы узнать о появлении.
          </p>
        </div>

        {/* Maybe you meant */}
        <section className="mt-6">
          <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Возможно вы искали
          </div>
          <div className="flex flex-wrap gap-2">
            {similar.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => pickSimilar(s)}
                className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[12px] font-medium text-neutral-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
              >
                <Search className="h-3 w-3 opacity-60" />
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Popular categories */}
        <section className="mt-5">
          <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Популярные категории
          </div>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => pickCategory(c)}
                className={cn(
                  'flex h-11 items-center justify-center rounded-xl border text-[11px] font-medium transition-all',
                  i % 3 === 0
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-950'
                    : i % 3 === 1
                      ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400 dark:hover:bg-amber-950/60'
                      : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/60',
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Subscribe CTA / form / success */}
        <section className="mt-6">
          <AnimatePresence mode="wait">
            {subStage === 'idle' && (
              <motion.button
                key="cta"
                type="button"
                onClick={() => setSubStage('form')}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 bg-neutral-50 py-3 text-[12px] font-medium text-neutral-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
              >
                <Bell className="h-3.5 w-3.5" />
                {subscribeCta}
              </motion.button>
            )}

            {subStage === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900 dark:bg-emerald-950/30"
              >
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <Bell className="h-3 w-3" />
                  Сообщим, когда «{query}» появится
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ваш@email.ru"
                      className={cn(
                        'h-9 w-full rounded-lg border bg-white pl-8 pr-2 text-[12px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2',
                        'dark:bg-neutral-900 dark:text-white',
                        email.length === 0
                          ? 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-800'
                          : emailValid
                            ? 'border-emerald-400 focus:ring-emerald-500/30'
                            : 'border-red-400 focus:ring-red-500/30',
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => emailValid && setSubStage('success')}
                    disabled={!emailValid}
                    className={cn(
                      'h-9 shrink-0 rounded-lg px-3 text-[12px] font-semibold text-white transition-colors',
                      emailValid ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800' : 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700',
                    )}
                  >
                    Подписаться
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setSubStage('idle')}
                  className="mt-2 text-[10px] font-medium text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  Отмена
                </button>
              </motion.div>
            )}

            {subStage === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-300">
                    Подписка оформлена
                  </div>
                  <div className="truncate text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
                    Напишем на {email || 'почту'} о появлении
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-emerald-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </MockupScreen>
  );
}
