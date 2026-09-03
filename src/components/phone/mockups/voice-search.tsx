'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, Search, Square } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  placeholder?: string;
  exampleQuery?: string;
};

type Stage = 'idle' | 'listening' | 'transcribed';

/**
 * VoiceSearchMockup — search bar with a mic icon. Tapping the mic starts
 * listening (animated waveform + "Слушаю..."), after ~2s the transcribed text
 * appears in the search bar. Text is editable; search button enables when
 * text present.
 */
export function VoiceSearchMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const placeholder = cfg.placeholder ?? 'Голосовой поиск';
  const exampleQuery = cfg.exampleQuery ?? 'красные кроссовки 42 размер';

  const [stage, setStage] = useState<Stage>('idle');
  const [query, setQuery] = useState('');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function startListening() {
    if (stage === 'listening') return;
    setStage('listening');
    setQuery('');
    // Simulate transcription after ~2 seconds.
    timerRef.current = window.setTimeout(() => {
      setQuery(exampleQuery);
      setStage('transcribed');
    }, 2000);
  }

  function stopListening() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStage('idle');
  }

  function reset() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStage('idle');
    setQuery('');
  }

  const canSearch = query.trim().length > 0;

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      <PhoneNavBar
        title="Поиск"
        left={
          <button type="button" aria-label="Назад" className="flex items-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
        }
      />

      {/* Search bar with mic */}
      <div className="px-3 py-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={cn(
              'h-11 w-full rounded-xl border bg-neutral-50 pl-9 pr-12 text-[13px] text-neutral-900 placeholder:text-neutral-400',
              'focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30',
              'dark:border-neutral-800 dark:bg-neutral-900 dark:text-white',
              stage === 'listening' && 'border-emerald-400',
            )}
          />
          <button
            type="button"
            onClick={stage === 'listening' ? stopListening : startListening}
            aria-label={stage === 'listening' ? 'Остановить запись' : 'Начать голосовой поиск'}
            className={cn(
              'absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full transition-colors',
              stage === 'listening'
                ? 'bg-red-500 text-white'
                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400',
            )}
          >
            <motion.div
              animate={
                stage === 'listening'
                  ? { scale: [1, 1.15, 1] }
                  : { scale: 1 }
              }
              transition={{ duration: 1, repeat: stage === 'listening' ? Infinity : 0 }}
            >
              {stage === 'listening' ? (
                <Square className="h-3 w-3 fill-white" />
              ) : (
                <Mic className="h-3.5 w-3.5" />
              )}
            </motion.div>
          </button>
        </div>

        {/* "Tap to edit" hint */}
        {stage === 'transcribed' && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 px-1 text-[10px] font-medium text-neutral-400 dark:text-neutral-500"
          >
            Нажмите, чтобы отредактировать
          </motion.div>
        )}
      </div>

      {/* Body — listening visualization or hint cards */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {stage === 'listening' && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              {/* Animated waveform */}
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900">
                <div className="flex items-center gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1 rounded-full bg-emerald-500"
                      animate={{ height: [6, 22, 10, 18, 6] }}
                      transition={{
                        duration: 0.9,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut',
                      }}
                      style={{ height: 8 }}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-5 text-[14px] font-semibold text-neutral-900 dark:text-white">
                Слушаю...
              </p>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Скажите, что вы ищете
              </p>
              <button
                type="button"
                onClick={stopListening}
                className="mt-5 rounded-full border border-neutral-200 px-3 py-1 text-[11px] font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
              >
                Прервать
              </button>
            </motion.div>
          )}

          {stage === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900">
                <Mic className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={1.6} />
              </div>
              <h2 className="mt-5 text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
                Голосовой поиск
              </h2>
              <p className="mt-2 max-w-[220px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Нажмите на микрофон в строке поиска и произнесите запрос вслух.
              </p>
            </motion.div>
          )}

          {stage === 'transcribed' && (
            <motion.div
              key="transcribed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex w-full flex-col items-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 260 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500"
                >
                  <Mic className="h-6 w-6 text-white" />
                </motion.div>
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Распознано
              </p>
              <p className="mt-1 text-[14px] font-medium text-neutral-900 dark:text-white">
                «{exampleQuery}»
              </p>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Текст можно отредактировать вручную
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <div className="flex gap-2">
          {stage === 'transcribed' && (
            <button
              type="button"
              onClick={reset}
              className="h-11 rounded-full border border-neutral-200 px-4 text-[13px] font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Сбросить
            </button>
          )}
          <button
            type="button"
            disabled={!canSearch}
            onClick={() => {
              if (canSearch) {
                setStage('idle');
                setQuery('');
              }
            }}
            className={cn(
              'h-11 flex-1 rounded-full text-[14px] font-semibold transition-colors',
              canSearch
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800'
                : 'cursor-not-allowed bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600',
            )}
          >
            Найти
          </button>
        </div>
      </div>
    </MockupScreen>
  );
}
