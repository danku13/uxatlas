'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Ruler, Check, X } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type SizeRow = { size: string; chest: number; waist: number };
type Helper = { height: string; weight: string; recommended: string };

type SizeGuideConfig = {
  sizes?: SizeRow[];
  unit?: string;
  helper?: Helper;
};

const DEFAULT_SIZES: SizeRow[] = [
  { size: 'XS', chest: 84, waist: 64 },
  { size: 'S', chest: 90, waist: 70 },
  { size: 'M', chest: 96, waist: 76 },
  { size: 'L', chest: 102, waist: 82 },
  { size: 'XL', chest: 108, waist: 88 },
  { size: 'XXL', chest: 114, waist: 94 },
];

const DEFAULT_HELPER: Helper = {
  height: '175 см',
  weight: '70 кг',
  recommended: 'M',
};

const INCH_FACTOR = 0.3937;

/**
 * SizeGuidePickerMockup — нижний лист «Таблица размеров» с помощником подбора.
 * Сверху переключатель см/дюймы. Под таблицей — рост/вес + «Рассчитать».
 * При расчёте подсвечивается рекомендованная строка и показывается toast.
 */
export function SizeGuidePickerMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as SizeGuideConfig;
  const sizes = cfg.sizes ?? DEFAULT_SIZES;
  const helper = cfg.helper ?? DEFAULT_HELPER;

  const [unit, setUnit] = useState<'cm' | 'inch'>(cfg.unit === 'inch' ? 'inch' : 'cm');
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [height, setHeight] = useState(helper.height);
  const [weight, setWeight] = useState(helper.weight);

  const displayed = useMemo(() => {
    return sizes.map((s) => ({
      size: s.size,
      chest:
        unit === 'cm' ? `${s.chest}` : (s.chest * INCH_FACTOR).toFixed(1),
      waist:
        unit === 'cm' ? `${s.waist}` : (s.waist * INCH_FACTOR).toFixed(1),
    }));
  }, [sizes, unit]);

  function calculate() {
    setHighlighted(helper.recommended);
    setToast(`Ваш размер: ${helper.recommended}`);
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <MockupScreen className="relative bg-neutral-100 dark:bg-neutral-950">
      {/* Faux parent screen behind the sheet */}
      <PhoneNavBar title="Товар" left={<ChevronLeft className="h-4 w-4" />} />

      <div className="flex h-[calc(100%-2.75rem)] items-end">
        {/* dimmed background hint */}
        <div className="absolute inset-0 top-11 bg-neutral-900/30" />

        {/* Bottom sheet */}
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          className="relative z-10 max-h-full w-full overflow-y-auto rounded-t-[1.5rem] bg-white px-4 pb-5 pt-2 dark:bg-neutral-900"
        >
          {/* grabber */}
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

          {/* Title row */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-[15px] font-bold text-neutral-900 dark:text-white">
                Таблица размеров
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setUnit((u) => (u === 'cm' ? 'inch' : 'cm'))}
              className="flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              aria-label="Переключить единицы измерения"
            >
              {unit === 'cm' ? 'см' : 'дюйм'}
            </button>
          </div>

          {/* Size table */}
          <div className="overflow-hidden rounded-xl border border-neutral-100 dark:border-neutral-800">
            <div className="grid grid-cols-3 bg-neutral-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:bg-neutral-800/60 dark:text-neutral-400">
              <div>Размер</div>
              <div className="text-right">Грудь ({unit})</div>
              <div className="text-right">Талия ({unit})</div>
            </div>
            {displayed.map((row, i) => {
              const isHL = highlighted === row.size;
              return (
                <motion.div
                  key={row.size}
                  initial={false}
                  animate={{
                    backgroundColor: isHL
                      ? 'rgba(16,185,129,0.10)'
                      : 'rgba(0,0,0,0)',
                  }}
                  className={cn(
                    'relative grid grid-cols-3 items-center px-3 py-2.5 text-[12px]',
                    i > 0 &&
                      'border-t border-neutral-100 dark:border-neutral-800',
                  )}
                >
                  <div
                    className={cn(
                      'font-bold',
                      isHL
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-neutral-900 dark:text-white',
                    )}
                  >
                    {row.size}
                  </div>
                  <div className="text-right tabular-nums text-neutral-600 dark:text-neutral-300">
                    {row.chest}
                  </div>
                  <div className="text-right tabular-nums text-neutral-600 dark:text-neutral-300">
                    {row.waist}
                  </div>
                  {isHL && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Helper */}
          <div className="mt-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-3 dark:border-emerald-900 dark:bg-emerald-950/30">
            <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 dark:text-emerald-300">
              <Ruler className="h-3.5 w-3.5" />
              Помощник подбора
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-[10px] text-neutral-500 dark:text-neutral-400">
                  Рост
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-2 text-[12px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] text-neutral-500 dark:text-neutral-400">
                  Вес
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-2 text-[12px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={calculate}
              className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-emerald-600 text-[13px] font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800"
            >
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              Рассчитать
            </button>
          </div>

          <div className="mt-3 flex items-start gap-2 px-1 text-[10px] leading-relaxed text-neutral-400 dark:text-neutral-500">
            <X className="mt-px h-3 w-3 shrink-0" />
            Справочно. Замеры производите по фигуре в лёгкой одежде.
          </div>
        </motion.div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-x-3 top-12 z-30"
          >
            <div className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-white shadow-lg">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </div>
              <span className="flex-1 text-[12px] font-semibold">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
