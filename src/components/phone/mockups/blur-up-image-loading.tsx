'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, RotateCcw, Check, ImageIcon } from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
} from './_shared';
import { cn } from '@/lib/utils';

type ImageItem = {
  id: number;
  color: string;
};

type BlurUpImageLoadingConfig = {
  images?: Array<{ id?: number; color: string; loaded?: boolean }>;
};

const DEFAULT_IMAGES: ImageItem[] = [
  { id: 1, color: 'bg-emerald-500' },
  { id: 2, color: 'bg-amber-500' },
  { id: 3, color: 'bg-rose-500' },
];

/**
 * BlurUpImageLoadingMockup — grid of 3 image cards with blur-up loading.
 * Каждое изображение показывается как blur-версия своего цвета + spinner.
 * Через 2 секунды блюр плавно исчезает и открывается «чёткое» изображение.
 * Кнопка «Перезагрузить» внизу — повторно запускает блюр для демо.
 */
export function BlurUpImageLoadingMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as BlurUpImageLoadingConfig;
  const base: ImageItem[] = useMemo(
    () =>
      Array.isArray(cfg.images) && cfg.images.length > 0
        ? cfg.images.map((im, i) => ({ id: typeof im.id === 'number' ? im.id : i + 1, color: im.color }))
        : DEFAULT_IMAGES,
    [cfg.images],
  );

  // `loadedKey === reloadKey` means the current "round" has finished loading.
  // When reloadKey bumps, loadedKey lags behind → images re-blur.
  const [reloadKey, setReloadKey] = useState(0);
  const [loadedKey, setLoadedKey] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setTimeout(() => setLoadedKey(reloadKey), 2000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [reloadKey]);

  function reload() {
    setReloadKey((k) => k + 1);
  }

  const loaded = loadedKey === reloadKey;
  const allLoaded = loaded;

  return (
    <MockupScreen className="relative flex flex-col bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Галерея"
        left={<ChevronLeft className="h-4 w-4" />}
        right={
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors',
              allLoaded
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
            )}
          >
            {allLoaded ? 'Загружено' : 'Загрузка'}
          </span>
        }
      />

      <div className="flex-1 overflow-y-auto px-3 pt-3">
        <div className="mb-3 flex items-center justify-between px-1">
          <h1 className="text-[15px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Свежие поступления
          </h1>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
            {base.length} фото
          </span>
        </div>

        {/* 3-card grid: two side-by-side, third spans full width below */}
        <div className="grid grid-cols-2 gap-2">
          {base.slice(0, 2).map((it, idx) => (
            <ImageCard key={`${it.id}-${reloadKey}-${idx}`} item={it} wide={false} loaded={loaded} />
          ))}
        </div>
        <div className="mt-2">
          {base[2] && (
            <ImageCard key={`${base[2].id}-${reloadKey}-wide`} item={base[2]} wide loaded={loaded} />
          )}
        </div>

        {/* Caption */}
        <div className="mt-3 flex items-start gap-1.5 rounded-xl bg-white p-2.5 text-[10px] leading-snug text-neutral-500 shadow-sm dark:bg-neutral-900 dark:text-neutral-400">
          <ImageIcon className="mt-0.5 h-3 w-3 shrink-0" />
          <span>
            {allLoaded
              ? 'Изображения загружены и кэшированы для мгновенного показа при следующем открытии.'
              : 'Показываем размытый placeholder, пока грузится полное изображение.'}
          </span>
        </div>
      </div>

      <PhoneBottomBar>
        <button
          type="button"
          onClick={reload}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white text-[13px] font-semibold text-neutral-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Перезагрузить
        </button>
      </PhoneBottomBar>

      <style jsx>{`
        @keyframes buSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </MockupScreen>
  );
}

function ImageCard({ item, wide, loaded }: { item: ImageItem; wide: boolean; loaded: boolean }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800',
        wide ? 'aspect-[16/7]' : 'aspect-square',
      )}
    >
      {/* Placeholder = blurred version of the color */}
      <motion.div
        animate={{
          filter: loaded ? 'blur(0px)' : 'blur(14px)',
          scale: loaded ? 1 : 1.15,
          opacity: loaded ? 1 : 0.7,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn('absolute inset-0', item.color)}
      />

      {/* "Sharp" content revealed on top */}
      <motion.div
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-end justify-between p-2.5"
      >
        <div>
          <div className="text-[12px] font-bold leading-tight text-white drop-shadow">
            Образец {item.id}
          </div>
          <div className="text-[9px] text-white/80">{wide ? 'Панорама · 2.4 МБ' : 'Фото · 1.2 МБ'}</div>
        </div>
        <span className="rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-bold text-neutral-900">
          {wide ? 'ПАНОРАМА' : 'NEW'}
        </span>
      </motion.div>

      {/* Spinner overlay */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/10"
          >
            <div className="relative flex h-8 w-8 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full border-2 border-white/30 border-t-white"
                style={{ animation: 'buSpin 0.8s linear infinite' }}
              />
              <ImageIcon className="h-3.5 w-3.5 text-white/80" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle check on load */}
      <AnimatePresence>
        {loaded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 280 }}
            className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md"
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
