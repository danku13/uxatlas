'use client';

/**
 * Shared helpers + small building blocks for interactive mockups.
 * Все мокапы рендерятся внутри PhoneFrame (280×~580px контент).
 * Используем tailwind utility classes с очень маленькими шрифтами (text-[10px], text-xs).
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

/** Стандартный контейнер для мокапа — занимает весь экран телефона */
export function MockupScreen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('h-full w-full overflow-hidden bg-white dark:bg-neutral-950', className)}>
      {children}
    </div>
  );
}

/** Шапка приложения внутри мокапа (как iOS navigation bar) */
export function PhoneNavBar({
  title,
  left,
  right,
  className,
}: {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-11 items-center justify-between border-b border-neutral-100 px-3 dark:border-neutral-800',
        className,
      )}
    >
      <div className="flex min-w-[40px] items-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
        {left}
      </div>
      <div className="flex-1 truncate text-center text-[13px] font-semibold text-neutral-900 dark:text-white">
        {title}
      </div>
      <div className="flex min-w-[40px] items-center justify-end text-[13px] font-medium text-emerald-600 dark:text-emerald-400">
        {right}
      </div>
    </div>
  );
}

/** iOS-style large title heading */
export function PhoneLargeTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="px-4 pb-2 pt-3 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
      {children}
    </h2>
  );
}

/** Главная кнопка (CTA) внутри мокапа — iOS pill style */
export function PhonePrimaryButton({
  children,
  className,
  onClick,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-11 w-full rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors',
        'hover:bg-emerald-700 active:bg-emerald-800',
        'disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Вторичная кнопка внутри мокапа */
export function PhoneSecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 w-full rounded-full text-[14px] font-medium text-emerald-600 transition-colors hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
    >
      {children}
    </button>
  );
}

/** Поле ввода внутри мокапа */
export function PhoneInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  autoFocus,
  suffix,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number';
  error?: boolean;
  autoFocus?: boolean;
  suffix?: ReactNode;
}) {
  return (
    <div className="relative">
      <input
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-12 w-full rounded-xl border bg-neutral-50 px-3 text-[14px] text-neutral-900 placeholder:text-neutral-400',
          'focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40',
          'dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500 dark:focus:bg-neutral-900',
          error
            ? 'border-red-400 focus:ring-red-500/40'
            : 'border-neutral-200 dark:border-neutral-800',
        )}
      />
      {suffix && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
  );
}

/** Низ мокапа с одной кнопкой (как iOS bottom action bar) */
export function PhoneBottomBar({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-0 border-t border-neutral-100 bg-white/95 p-3 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95">
      {children}
    </div>
  );
}

/** Метка поля */
export function PhoneFieldLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
      {children}
    </div>
  );
}
