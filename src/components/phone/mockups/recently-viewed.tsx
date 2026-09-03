'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Item = {
  name: string;
  price: string;
  color: string;
};

type Cfg = {
  items?: Item[];
};

const DEFAULT_ITEMS: Item[] = [
  { name: 'Кроссовки Air Max', price: '8 990 ₽', color: 'bg-emerald-200 dark:bg-emerald-700' },
  { name: 'Куртка зимняя', price: '12 500 ₽', color: 'bg-amber-200 dark:bg-amber-700' },
  { name: 'Рюкзак городской', price: '3 200 ₽', color: 'bg-rose-200 dark:bg-rose-700' },
  { name: 'Часы Smart', price: '15 900 ₽', color: 'bg-teal-200 dark:bg-teal-700' },
  { name: 'Наушники Pro', price: '6 790 ₽', color: 'bg-fuchsia-200 dark:bg-fuchsia-700' },
  { name: 'Кеды Urban', price: '5 490 ₽', color: 'bg-orange-200 dark:bg-orange-700' },
];

/**
 * RecentlyViewedMockup — "Вы недавно смотрели" section with horizontal
 * scrollable carousel of product cards (colored rects as image placeholders).
 * Each card: image + name (1 line) + price. Horizontal scroll with snap.
 * Drag/swipe to scroll. "Смотреть все" link at the end.
 */
export function RecentlyViewedMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const items =
    Array.isArray(cfg.items) && cfg.items.length > 0 ? (cfg.items as Item[]) : DEFAULT_ITEMS;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ startX: number; startScroll: number; active: boolean; moved: boolean }>({
    startX: 0,
    startScroll: 0,
    active: false,
    moved: false,
  });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateEdges() {
    const el = scrollRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }

  function scrollByDir(dir: 1 | -1) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 160, behavior: 'smooth' });
  }

  function onPointerDown(e: React.PointerEvent) {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      startX: e.clientX,
      startScroll: el.scrollLeft,
      active: true,
      moved: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const el = scrollRef.current;
    if (!el || !dragState.current.active) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 4) {
      dragState.current.moved = true;
      el.scrollLeft = dragState.current.startScroll - dx;
    }
  }

  function onPointerUp() {
    dragState.current.active = false;
    // small timeout so click suppression can work via the moved flag if needed
    window.setTimeout(updateEdges, 60);
  }

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      <PhoneNavBar
        title="Главная"
        left={<ChevronLeft className="h-4 w-4" />}
      />

      <div className="flex-1 overflow-y-auto pb-6">
        {/* Hero / banner placeholder */}
        <div className="mx-3 mt-3 flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-950/40">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-neutral-900 dark:text-white">
              С возвращением!
            </div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Продолжим с того места, где вы остановились
            </div>
          </div>
        </div>

        {/* Section header */}
        <div className="mt-5 flex items-center justify-between px-3">
          <div>
            <h2 className="text-[16px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Вы недавно смотрели
            </h2>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Потяните, чтобы пролистать
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Смотреть все
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative mt-3">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            disabled={atStart}
            aria-label="Назад"
            className={cn(
              'absolute left-1 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-opacity dark:bg-neutral-900/90',
              atStart ? 'opacity-30' : 'hover:bg-white dark:hover:bg-neutral-800',
            )}
          >
            <ChevronLeft className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </button>

          <div
            ref={scrollRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onScroll={updateEdges}
            className="flex cursor-grab gap-2.5 overflow-x-auto px-3 pb-2 active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory',
              touchAction: 'pan-x',
            }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="w-[120px] shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className={cn('relative h-24 w-full', item.color)}>
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-white/80 px-1.5 py-0.5 text-[9px] font-bold text-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-200">
                    #{i + 1}
                  </span>
                </div>
                <div className="p-2">
                  <div className="truncate text-[11px] font-medium text-neutral-900 dark:text-white">
                    {item.name}
                  </div>
                  <div className="mt-0.5 text-[12px] font-bold text-neutral-900 dark:text-white">
                    {item.price}
                  </div>
                </div>
              </div>
            ))}

            {/* "Смотреть все" card at end */}
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              className="flex w-[120px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-3 text-center text-emerald-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-emerald-400"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div className="text-[11px] font-semibold leading-tight">Смотреть все</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {items.length}+ товаров
              </div>
            </button>
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            disabled={atEnd}
            aria-label="Вперёд"
            className={cn(
              'absolute right-1 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition-opacity dark:bg-neutral-900/90',
              atEnd ? 'opacity-30' : 'hover:bg-white dark:hover:bg-neutral-800',
            )}
          >
            <ChevronRight className="h-4 w-4 text-neutral-700 dark:text-neutral-200" />
          </button>
        </div>

        {/* Dots indicator */}
        <div className="mt-2 flex items-center justify-center gap-1">
          {items.slice(0, 6).map((_, i) => (
            <span
              key={i}
              className={cn(
                'h-1 rounded-full transition-all',
                i === 0 ? 'w-4 bg-emerald-500' : 'w-1 bg-neutral-300 dark:bg-neutral-700',
              )}
            />
          ))}
        </div>

        {/* Inline tip */}
        <div className="mx-3 mt-4 rounded-xl bg-neutral-50 p-3 dark:bg-neutral-900">
          <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Совет
          </div>
          <div className="mt-0.5 text-[11px] leading-snug text-neutral-600 dark:text-neutral-300">
            История просмотров хранится на устройстве и помогает быстро вернуться
            к интересным товарам.
          </div>
        </div>
      </div>
    </MockupScreen>
  );
}
