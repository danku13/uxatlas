'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * PhoneFrame — универсальная CSS-only рамка iPhone-стиля.
 *
 * Не требует изображений. Внутренний экран — белый/чёрный в зависимости от темы.
 * Размеры управляются через className (по умолчанию 280×580).
 *
 * Используется как обёртка для всех интерактивных мокапов.
 */
export function PhoneFrame({
  children,
  className,
  screenClassName,
  variant = 'light',
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  /** Принудительный цвет экрана, по умолчанию light (как в большинстве iOS apps) */
  variant?: 'light' | 'dark';
}) {
  return (
    <div
      className={cn(
        'relative mx-auto aspect-[9/19.5] w-full max-w-[300px]',
        'rounded-[2.5rem] border-[10px] border-neutral-900 bg-neutral-900',
        'shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] ring-1 ring-black/5',
        'dark:ring-white/10',
        // Size variants (override max-w-[300px] default)
        // Default: full size (~300px wide × 650px tall — for detail dialog)
        // sm: ~240px × 520px — for compact previews
        // xs: ~180px × 390px — for catalog cards
        className,
      )}
      data-phone-frame=""
    >
      {/* Dynamic Island */}
      <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-neutral-900" />

      {/* Screen */}
      <div
        className={cn(
          'relative h-full w-full overflow-hidden rounded-[1.75rem]',
          variant === 'light' ? 'bg-white' : 'bg-neutral-950',
          screenClassName,
        )}
      >
        {/* Status bar */}
        <StatusBar variant={variant} />

        {/* Content area */}
        <div className="absolute inset-x-0 top-8 bottom-5 overflow-hidden">
          {children}
        </div>

        {/* Home indicator */}
        <div
          className={cn(
            'absolute bottom-1.5 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full',
            variant === 'light' ? 'bg-neutral-900/80' : 'bg-white/80',
          )}
        />
      </div>
    </div>
  );
}

function StatusBar({ variant }: { variant: 'light' | 'dark' }) {
  const color = variant === 'light' ? 'text-neutral-900' : 'text-white';
  return (
    <div
      className={cn(
        'absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between px-6 pt-1 text-[11px] font-semibold',
        color,
      )}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1">
        {/* signal */}
        <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" aria-hidden>
          <rect x="0" y="6" width="2.5" height="4" rx="0.5" />
          <rect x="4" y="4" width="2.5" height="6" rx="0.5" />
          <rect x="8" y="2" width="2.5" height="8" rx="0.5" />
          <rect x="12" y="0" width="2.5" height="10" rx="0.5" />
        </svg>
        {/* wifi */}
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor" aria-hidden>
          <path d="M7 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3.2-3.2a4.5 4.5 0 0 1 6.4 0l1.1-1.1a6 6 0 0 0-8.6 0l1.1 1.1zm1.5 1.5a2.4 2.4 0 0 1 3.4 0l1-1a3.8 3.8 0 0 0-5.4 0l1 1z" />
        </svg>
        {/* battery */}
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none" aria-hidden>
          <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="17" height="7" rx="1.5" fill="currentColor" />
          <rect x="21.5" y="3.5" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}
