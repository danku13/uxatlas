'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, HelpCircle, X } from 'lucide-react';
import { MockupScreen, PhonePrimaryButton } from './_shared';

type Cfg = {
  slideTitle?: string;
  slideSubtitle?: string;
  emoji?: string;
  skipLabel?: string;
  snackbarMessage?: string;
};

const SLIDE_2 = {
  emoji: '🛒',
  title: 'Покупайте в один клик',
  subtitle: 'Сохраняйте карты и адреса — оформление займёт меньше минуты.',
};

const HELP_TOPICS = [
  { emoji: '🔑', title: 'Как восстановить доступ?', body: 'Если забыли пароль — нажмите «Восстановить» на экране входа.' },
  { emoji: '🚚', title: 'Где мой заказ?', body: 'Откройте раздел «Заказы» — там актуальный статус и карта доставки.' },
  { emoji: '💳', title: 'Как вернуть товар?', body: 'Возврат доступен в течение 14 дней прямо из карточки заказа.' },
];

/**
 * SkipOnboardingRestoreMockup — typical onboarding slide with a "Skip" link.
 * Skipping fades the slide out + raises a snackbar with a 5s countdown + "Открыть Помощь" action.
 * Clicking "Открыть Помощь" opens a faux Help sheet with 3 topics.
 */
export function SkipOnboardingRestoreMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const slideTitle = cfg.slideTitle ?? 'Находите всё за секунды';
  const slideSubtitle =
    cfg.slideSubtitle ??
    'Умный поиск по тысячам товаров и фильтры под рукой — для всего этого мы и создали приложение.';
  const emoji = cfg.emoji ?? '🔍';
  const skipLabel = cfg.skipLabel ?? 'Пропустить';
  const snackbarMessage =
    cfg.snackbarMessage ?? 'Онбординг пропущен. Вы можете вернуться к нему позже.';

  const [slide, setSlide] = useState(0); // 0 = first slide, 1 = next slide
  const [skipped, setSkipped] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [helpOpen, setHelpOpen] = useState(false);
  const [placeholderVisible, setPlaceholderVisible] = useState(false);

  const progressRef = useRef<number | null>(null);
  const dismissTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (progressRef.current) window.clearInterval(progressRef.current);
      if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);
    };
  }, []);

  function clearTimers() {
    if (progressRef.current) window.clearInterval(progressRef.current);
    if (dismissTimerRef.current) window.clearTimeout(dismissTimerRef.current);
    progressRef.current = null;
    dismissTimerRef.current = null;
  }

  function handleSkip() {
    if (skipped) return;
    setSkipped(true);
    // Wait for fade-out, then raise the snackbar
    window.setTimeout(() => {
      setSnackbarVisible(true);
      setPlaceholderVisible(true);
      const start = Date.now();
      const duration = 5000;
      progressRef.current = window.setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(pct);
        if (pct <= 0 && progressRef.current) {
          window.clearInterval(progressRef.current);
          progressRef.current = null;
        }
      }, 50);
      dismissTimerRef.current = window.setTimeout(() => {
        setSnackbarVisible(false);
      }, duration);
    }, 320);
  }

  function handleNext() {
    if (skipped) return;
    setSlide(1);
  }

  function openHelp() {
    clearTimers();
    setSnackbarVisible(false);
    setHelpOpen(true);
  }

  const currentSlide = slide === 0 ? { emoji, title: slideTitle, subtitle: slideSubtitle } : SLIDE_2;

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      {/* Top bar: skip button on the right */}
      <div className="flex h-11 items-center justify-between px-4">
        <div className="flex gap-1.5">
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? 'w-6 bg-emerald-500' : 'w-1.5 bg-neutral-200 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleSkip}
          disabled={skipped}
          className="text-[12px] font-medium text-neutral-400 transition-colors hover:text-neutral-700 disabled:opacity-50 dark:hover:text-neutral-200"
        >
          {skipLabel}
        </button>
      </div>

      {/* Slide content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          {!skipped && (
            <motion.div
              key={`${slide}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <div className="text-[72px] leading-none">{currentSlide.emoji}</div>
              <h2 className="mt-6 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
                {currentSlide.title}
              </h2>
              <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {currentSlide.subtitle}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Placeholder after skip */}
        <AnimatePresence>
          {placeholderVisible && !helpOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
                <HelpCircle className="h-8 w-8 text-neutral-300 dark:text-neutral-600" />
              </div>
              <div className="mt-4 text-[13px] font-medium text-neutral-500 dark:text-neutral-400">
                Главный экран приложения
              </div>
              <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                Подсказки скрыты — откройте «Помощь», чтобы вернуться
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        {!skipped && (
          <PhonePrimaryButton onClick={handleNext}>
            {slide === 0 ? 'Далее' : 'Начать'}
          </PhonePrimaryButton>
        )}
        {skipped && (
          <button
            type="button"
            onClick={() => {
              clearTimers();
              setSkipped(false);
              setSnackbarVisible(false);
              setPlaceholderVisible(false);
              setHelpOpen(false);
              setSlide(0);
              setProgress(100);
            }}
            className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Повторить сценарий
          </button>
        )}
      </div>

      {/* Snackbar */}
      <AnimatePresence>
        {snackbarVisible && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="absolute inset-x-3 bottom-4 z-40 overflow-hidden rounded-xl bg-neutral-900 shadow-xl dark:bg-neutral-800"
          >
            <div className="flex items-center justify-between gap-2 px-3 py-2.5">
              <span className="text-[12px] font-medium text-white">{snackbarMessage}</span>
              <button
                type="button"
                onClick={openHelp}
                className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Открыть Помощь
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="h-0.5 w-full bg-white/10">
              <div
                className="h-full bg-emerald-400 transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help sheet */}
      <AnimatePresence>
        {helpOpen && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.button
              type="button"
              aria-label="Закрыть помощь"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative max-h-[80%] overflow-y-auto rounded-t-2xl bg-white p-4 pb-6 dark:bg-neutral-900"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="mx-auto h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <button
                  type="button"
                  onClick={() => setHelpOpen(false)}
                  aria-label="Закрыть"
                  className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-[16px] font-bold text-neutral-900 dark:text-white">Помощь</h3>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                Частые вопросы и быстрый доступ к разделам
              </p>
              <div className="mt-3 space-y-2">
                {HELP_TOPICS.map((t) => (
                  <button
                    key={t.title}
                    type="button"
                    className="flex w-full items-start gap-3 rounded-xl border border-neutral-100 p-3 text-left transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                  >
                    <span className="text-[20px] leading-none">{t.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                        {t.title}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {t.body}
                      </div>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-neutral-300 dark:text-neutral-600" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
