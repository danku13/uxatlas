'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MockupScreen, PhonePrimaryButton } from './_shared';
import { cn } from '@/lib/utils';

type Slide = {
  icon: string;
  title: string;
  subtitle: string;
  emoji: string;
};

type Cfg = {
  slides: Slide[];
};

const DEFAULT_SLIDES: Slide[] = [
  {
    icon: 'Sparkles',
    title: 'Добро пожаловать',
    subtitle: 'Откройте для себя паттерны мобильного UX',
    emoji: '✨',
  },
  {
    icon: 'Compass',
    title: 'Исследуйте идеи',
    subtitle: 'Готовые решения для онбординга, поиска и оплаты',
    emoji: '🧭',
  },
  {
    icon: 'Rocket',
    title: 'Запускайте быстрее',
    subtitle: 'Применяйте лучшие практики в своём продукте',
    emoji: '🚀',
  },
];

const SLIDE_DURATION = 3000;

export function OnboardingCarouselMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const slides = Array.isArray(cfg.slides) && cfg.slides.length > 0 ? cfg.slides : DEFAULT_SLIDES;
  const total = slides.length;

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const pausedRef = useRef(false);

  const goTo = useCallback(
    (i: number) => {
      setIndex(((i % total) + total) % total);
      setProgress(0);
      startRef.current = performance.now();
    },
    [total],
  );

  const next = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  // Animation loop using rAF; advances slide when progress hits 100%.
  useEffect(() => {
    let mounted = true;
    startRef.current = performance.now();

    const loop = (now: number) => {
      if (!mounted) return;
      if (!pausedRef.current) {
        const elapsed = now - startRef.current;
        const pct = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
        setProgress(pct);
        if (pct >= 100) {
          setIndex((i) => (i + 1) % total);
          setProgress(0);
          startRef.current = now;
        }
      } else {
        // while paused, freeze start time so progress resumes correctly
        startRef.current = now - (progress / 100) * SLIDE_DURATION;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [total]);

  const isLast = index === total - 1;
  const slide = slides[index];

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      {/* Top progress bars — one per slide, only the active animates */}
      <div className="flex gap-1 px-4 pt-3">
        {slides.map((_, i) => (
          <div
            key={i}
            className="relative h-1 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
              style={{
                width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
                transition: i === index ? 'none' : 'width 200ms ease',
              }}
            />
          </div>
        ))}
      </div>

      {/* Slide content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div
          key={index}
          className="flex flex-col items-center"
          style={{ animation: 'onbFade 350ms ease both' }}
        >
          <div className="text-[64px] leading-none drop-shadow-sm">{slide.emoji}</div>
          <h2 className="mt-6 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
            {slide.title}
          </h2>
          <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Pagination dots + CTA */}
      <div className="px-6 pb-6">
        <div className="mb-4 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Слайд ${i + 1}`}
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-200',
                i === index
                  ? 'w-6 bg-emerald-500'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-700',
              )}
            />
          ))}
        </div>

        <PhonePrimaryButton onClick={next} disabled={false}>
          {isLast ? 'Начать' : 'Далее'}
        </PhonePrimaryButton>

        {isLast && (
          <button
            type="button"
            onClick={() => goTo(0)}
            className="mt-3 w-full text-center text-[12px] font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            Пропустить
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes onbFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </MockupScreen>
  );
}
