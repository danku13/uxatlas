'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Home,
  Unlink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
} from './_shared';
import { cn } from '@/lib/utils';

type PageNotFoundRecoveryConfig = {
  title?: string;
  body?: string;
  popularPages?: string[];
  searchPlaceholder?: string;
};

const DEFAULT_PAGES = ['Главная', 'Каталог', 'Корзина', 'Профиль', 'Заказы', 'Поддержка'];

/**
 * PageNotFoundRecoveryMockup — 404 recovery screen.
 * Крупное «404» с иконкой broken-link, заголовок/подзаголовок,
 * блок «Возможно вы искали» с чипами популярных страниц,
 * поисковая строка снизу и кнопка «На главную».
 */
export function PageNotFoundRecoveryMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as PageNotFoundRecoveryConfig;
  const title = cfg.title ?? 'Страница куда-то пропала';
  const body = cfg.body ?? 'Возможно, ссылка устарела или страницу перенесли. Ничего страшного — давайте найдём нужное.';
  const popularPages = Array.isArray(cfg.popularPages) && cfg.popularPages.length > 0 ? cfg.popularPages : DEFAULT_PAGES;
  const searchPlaceholder = cfg.searchPlaceholder ?? 'Поиск по сайту';

  const [query, setQuery] = useState('');
  const [visitedPage, setVisitedPage] = useState<string | null>(null);

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      <PhoneNavBar
        left={
          <button type="button" aria-label="Назад" className="flex items-center text-emerald-600 dark:text-emerald-400">
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
        title="Не найдено"
      />

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Hero 404 */}
        <div className="flex flex-col items-center pt-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Broken-link icon ring */}
            <div className="absolute inset-0 -z-10 rounded-full bg-red-100/60 blur-2xl dark:bg-red-950/30" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100 dark:bg-red-950/40 dark:ring-red-900/40">
              <Unlink className="h-10 w-10 text-red-500 dark:text-red-400" strokeWidth={1.8} />
            </div>
            {/* Floating "404" */}
            <motion.div
              initial={{ y: 4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-[20px] font-extrabold tracking-tight text-red-500 shadow-md ring-1 ring-red-100 dark:bg-neutral-900 dark:text-red-400 dark:ring-red-900/40"
            >
              404
            </motion.div>
          </motion.div>

          <h1 className="mt-8 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 max-w-[240px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {body}
          </p>
        </div>

        {/* Maybe you were looking for */}
        <section className="mt-7">
          <div className="mb-2 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            <Sparkles className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
            Возможно вы искали
          </div>
          <div className="flex flex-wrap gap-2">
            {popularPages.map((page) => {
              const visited = visitedPage === page;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setVisitedPage(page)}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all',
                    visited
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300',
                  )}
                >
                  {page}
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </button>
              );
            })}
          </div>
          {visitedPage && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              Открыли «{visitedPage}» для вас ✨
            </motion.div>
          )}
        </section>

        {/* Search */}
        <section className="mt-6">
          <div className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Или найдите вручную
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
            />
          </div>
          {query.trim().length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 rounded-xl bg-neutral-50 px-3 py-2 text-[11px] text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
            >
              <Search className="h-3 w-3" />
              Показать результаты по «{query.trim()}»
            </motion.div>
          )}
        </section>
      </div>

      <PhoneBottomBar>
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
        >
          <Home className="h-4 w-4" />
          На главную
        </button>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
