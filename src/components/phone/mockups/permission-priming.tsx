'use client';

import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { LucideIcon } from '@/components/lucide-icon';
import { MockupScreen, PhonePrimaryButton, PhoneSecondaryButton } from './_shared';

type Cfg = {
  icon?: string;
  title?: string;
  body?: string;
  primaryCta?: string;
  secondaryCta?: string;
};

type Stage = 'intro' | 'maybe-later' | 'system-sheet' | 'granted';

export function PermissionPrimingMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const iconName = cfg.icon ?? 'MapPin';
  const title = cfg.title ?? 'Доступ к геолокации';
  const body =
    cfg.body ??
    'Это поможет показывать ближайшие объекты и рассчитывать точное время доставки.';
  const primaryCta = cfg.primaryCta ?? 'Разрешить доступ';
  const secondaryCta = cfg.secondaryCta ?? 'Может быть позже';

  const [stage, setStage] = useState<Stage>('intro');

  return (
    <MockupScreen className="relative flex flex-col bg-white dark:bg-neutral-950">
      {/* Top app bar — shows back arrow when in "maybe later" state */}
      <div className="flex h-11 items-center px-3">
        {stage === 'maybe-later' ? (
          <button
            type="button"
            onClick={() => setStage('intro')}
            aria-label="Назад"
            className="flex items-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="ml-1">Назад</span>
          </button>
        ) : (
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Шаг 1 из 3
          </span>
        )}
      </div>

      {/* Card body — fades between intro and maybe-later */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        {stage === 'intro' && (
          <div className="flex flex-col items-center" style={{ animation: 'ppFade 250ms ease both' }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900">
              <LucideIcon
                name={iconName}
                className="h-9 w-9 text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <h2 className="mt-6 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {body}
            </p>
          </div>
        )}

        {stage === 'maybe-later' && (
          <div className="flex flex-col items-center" style={{ animation: 'ppFade 250ms ease both' }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-100 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
              <LucideIcon
                name="BellOff"
                className="h-9 w-9 text-neutral-400 dark:text-neutral-500"
              />
            </div>
            <h2 className="mt-6 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Хорошо, позже
            </h2>
            <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Вы сможете включить доступ в любой момент из настроек приложения.
            </p>
          </div>
        )}

        {stage === 'granted' && (
          <div className="flex flex-col items-center" style={{ animation: 'ppFade 300ms ease both' }}>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
              <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
            </div>
            <h2 className="mt-6 text-[20px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Доступ предоставлен
            </h2>
            <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Теперь мы можем показывать актуальную информацию рядом с вами.
            </p>
            <button
              type="button"
              onClick={() => setStage('intro')}
              className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
            >
              Повторить сценарий
            </button>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="px-6 pb-6">
        {stage === 'intro' && (
          <div style={{ animation: 'ppFade 250ms ease both' }}>
            <PhonePrimaryButton onClick={() => setStage('system-sheet')}>
              {primaryCta}
            </PhonePrimaryButton>
            <PhoneSecondaryButton onClick={() => setStage('maybe-later')}>
              {secondaryCta}
            </PhoneSecondaryButton>
          </div>
        )}

        {stage === 'maybe-later' && (
          <div style={{ animation: 'ppFade 250ms ease both' }}>
            <PhonePrimaryButton onClick={() => setStage('intro')}>
              Продолжить
            </PhonePrimaryButton>
          </div>
        )}
      </div>

      {/* iOS-style system permission sheet sliding up from the bottom */}
      {stage === 'system-sheet' && (
        <div className="absolute inset-0 z-30 flex flex-col justify-end">
          {/* Dimmed backdrop */}
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/40"
            onClick={() => setStage('intro')}
          />
          <div
            className="relative rounded-t-2xl bg-white p-4 pb-6 shadow-2xl dark:bg-neutral-900"
            style={{ animation: 'ppSheet 280ms cubic-bezier(0.22, 1, 0.36, 1) both' }}
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex flex-col items-center text-center">
              <LucideIcon
                name={iconName}
                className="mb-3 h-8 w-8 text-emerald-600 dark:text-emerald-400"
              />
              <div className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                «Приложение» хочет использовать
              </div>
              <div className="mt-1 text-[15px] font-semibold text-neutral-900 dark:text-white">
                {title}
              </div>
              <p className="mt-2 max-w-[260px] text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {body}
              </p>
            </div>

            <div className="mt-4 divide-y divide-neutral-100 rounded-xl border border-neutral-100 dark:divide-neutral-800 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setStage('granted')}
                className="flex w-full items-center justify-center py-3 text-[15px] font-semibold text-emerald-600 dark:text-emerald-400"
              >
                Разрешить
              </button>
              <button
                type="button"
                onClick={() => setStage('maybe-later')}
                className="flex w-full items-center justify-center py-3 text-[15px] font-medium text-neutral-700 dark:text-neutral-200"
              >
                Запретить
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes ppFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ppSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </MockupScreen>
  );
}
