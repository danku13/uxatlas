'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus, Check } from 'lucide-react';
import { MockupScreen, PhoneNavBar, PhoneBottomBar } from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  min?: number;
  max?: number;
  currentMin?: number;
  currentMax?: number;
  histogram?: number[];
};

const DEFAULT_HISTOGRAM = [4, 9, 18, 32, 48, 62, 58, 41, 28, 19, 11, 5];
const PRICE_STEP = 100;

/**
 * PriceRangeSliderMockup — dual-handle range slider.
 * Above slider: histogram bars showing price distribution. Below: numeric
 * min/max inputs with +/- steppers. "Применить" at bottom shows live
 * "Найдено N товаров".
 */
export function PriceRangeSliderMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const min = typeof cfg.min === 'number' ? cfg.min : 0;
  const max = typeof cfg.max === 'number' ? cfg.max : 30000;
  const cMin0 = typeof cfg.currentMin === 'number' ? cfg.currentMin : 4000;
  const cMax0 = typeof cfg.currentMax === 'number' ? cfg.currentMax : 20000;
  const histogram =
    Array.isArray(cfg.histogram) && cfg.histogram.length > 0
      ? (cfg.histogram as number[])
      : DEFAULT_HISTOGRAM;

  const [curMin, setCurMin] = useState(Math.max(min, Math.min(cMin0, cMax0)));
  const [curMax, setCurMax] = useState(Math.min(max, Math.max(cMin0, cMax0)));
  const [appliedMin, setAppliedMin] = useState(curMin);
  const [appliedMax, setAppliedMax] = useState(curMax);
  const [justApplied, setJustApplied] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<'min' | 'max' | null>(null);

  const span = max - min;
  const minPct = ((curMin - min) / span) * 100;
  const maxPct = ((curMax - min) / span) * 100;

  const maxHist = Math.max(...histogram);

  // Items found: simulate by integrating histogram bars inside the selected range
  const foundCount = useMemo(() => {
    const lo = Math.min(curMin, curMax);
    const hi = Math.max(curMin, curMax);
    const loIdx = Math.max(
      0,
      Math.floor(((lo - min) / span) * histogram.length),
    );
    const hiIdx = Math.min(
      histogram.length - 1,
      Math.ceil(((hi - min) / span) * histogram.length),
    );
    let sum = 0;
    for (let i = loIdx; i <= hiIdx; i++) {
      sum += histogram[i] ?? 0;
    }
    // scale to a believable catalog number (e.g. 4–8x)
    return Math.max(0, Math.round(sum * 4.2));
  }, [curMin, curMax, histogram, min, span]);

  function setFromClientX(clientX: number, which: 'min' | 'max') {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * span;
    const stepped = Math.round(raw / PRICE_STEP) * PRICE_STEP;
    if (which === 'min') {
      setCurMin(Math.max(min, Math.min(stepped, curMax - PRICE_STEP)));
    } else {
      setCurMax(Math.min(max, Math.max(stepped, curMin + PRICE_STEP)));
    }
  }

  function onPointerDown(which: 'min' | 'max') {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      draggingRef.current = which;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    setFromClientX(e.clientX, draggingRef.current);
  }

  function onPointerUp() {
    draggingRef.current = null;
  }

  function stepMin(delta: number) {
    setCurMin((v) => Math.max(min, Math.min(v + delta, curMax - PRICE_STEP)));
  }
  function stepMax(delta: number) {
    setCurMax((v) => Math.min(max, Math.max(v + delta, curMin + PRICE_STEP)));
  }

  function apply() {
    setAppliedMin(curMin);
    setAppliedMax(curMax);
    setJustApplied(true);
    window.setTimeout(() => setJustApplied(false), 900);
  }

  function reset() {
    setCurMin(min);
    setCurMax(max);
  }

  const fmt = (n: number) => `${n.toLocaleString('ru-RU')} ₽`;

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar title="Цена" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="flex-1 overflow-y-auto px-4 pb-3 pt-4">
        <h2 className="text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Диапазон цен
        </h2>
        <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">
          Перетащите ползунки, чтобы сузить поиск. Гистограмма показывает
          распределение товаров.
        </p>

        {/* Histogram */}
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-2 flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            <span>Распределение цен</span>
            <span>{histogram.length} групп</span>
          </div>
          <div className="flex h-16 items-end justify-between gap-0.5">
            {histogram.map((h, i) => {
              const barLo = (i / histogram.length) * 100;
              const barHi = ((i + 1) / histogram.length) * 100;
              const inRange = barHi > minPct && barLo < maxPct;
              const heightPct = maxHist > 0 ? (h / maxHist) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-colors"
                  style={{
                    height: `${Math.max(4, heightPct)}%`,
                    backgroundColor: inRange
                      ? 'rgb(16 185 129)'
                      : 'rgb(229 229 229)',
                  }}
                  title={`${h} товаров`}
                />
              );
            })}
          </div>

          {/* Track + handles */}
          <div
            ref={trackRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className="relative mt-3 h-6 w-full touch-none select-none"
          >
            {/* Track bg */}
            <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            {/* Selected range */}
            <div
              className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-emerald-500"
              style={{ left: `${minPct}%`, width: `${Math.max(0, maxPct - minPct)}%` }}
            />
            {/* Min handle */}
            <div
              onPointerDown={onPointerDown('min')}
              role="slider"
              aria-label="Минимальная цена"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={curMin}
              tabIndex={0}
              className="absolute top-1/2 z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-emerald-500 bg-white shadow-md active:cursor-grabbing dark:bg-neutral-900"
              style={{ left: `${minPct}%` }}
            />
            {/* Max handle */}
            <div
              onPointerDown={onPointerDown('max')}
              role="slider"
              aria-label="Максимальная цена"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={curMax}
              tabIndex={0}
              className="absolute top-1/2 z-10 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-emerald-500 bg-white shadow-md active:cursor-grabbing dark:bg-neutral-900"
              style={{ left: `${maxPct}%` }}
            />
          </div>

          <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
            <span>{fmt(min)}</span>
            <span>{fmt(max)}</span>
          </div>
        </div>

        {/* Numeric inputs */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {/* Min */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              От
            </div>
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => stepMin(-PRICE_STEP)}
                aria-label="Уменьшить минимальную цену"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Minus className="h-3 w-3" />
              </button>
              <input
                type="number"
                value={curMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v)) {
                    setCurMin(Math.max(min, Math.min(v, curMax - PRICE_STEP)));
                  }
                }}
                className="w-full bg-transparent text-center text-[13px] font-bold text-neutral-900 focus:outline-none dark:text-white"
              />
              <button
                type="button"
                onClick={() => stepMin(PRICE_STEP)}
                aria-label="Увеличить минимальную цену"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Max */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              До
            </div>
            <div className="flex items-center justify-between gap-1">
              <button
                type="button"
                onClick={() => stepMax(-PRICE_STEP)}
                aria-label="Уменьшить максимальную цену"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Minus className="h-3 w-3" />
              </button>
              <input
                type="number"
                value={curMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (Number.isFinite(v)) {
                    setCurMax(Math.min(max, Math.max(v, curMin + PRICE_STEP)));
                  }
                }}
                className="w-full bg-transparent text-center text-[13px] font-bold text-neutral-900 focus:outline-none dark:text-white"
              />
              <button
                type="button"
                onClick={() => stepMax(PRICE_STEP)}
                aria-label="Увеличить максимальную цену"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Applied summary */}
        <div
          className={cn(
            'mt-3 flex items-center justify-between rounded-xl border px-3 py-2.5 transition-colors',
            justApplied
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30'
              : 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900',
          )}
        >
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              Применённый диапазон
            </div>
            <div className="text-[12px] font-semibold text-neutral-900 dark:text-white">
              {fmt(appliedMin)} – {fmt(appliedMax)}
            </div>
          </div>
          <AnimatePresence>
            {justApplied && (
              <motion.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500"
              >
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <PhoneBottomBar>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="h-11 flex-1 rounded-full border border-neutral-200 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            Сбросить
          </button>
          <button
            type="button"
            onClick={apply}
            className="h-11 flex-[2] rounded-full bg-emerald-600 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
          >
            Применить · {foundCount} тов.
          </button>
        </div>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
