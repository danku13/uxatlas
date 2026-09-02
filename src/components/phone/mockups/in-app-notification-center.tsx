'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  ChevronRight,
  Package,
  Mail,
  Tag,
  Settings,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { cn } from '@/lib/utils';

type NotifType = 'order' | 'message' | 'promo' | 'system';

type NotificationItem = {
  id: number;
  type: NotifType;
  title: string;
  time: string;
  unread: boolean;
};

type InAppNotificationCenterConfig = {
  unread?: number;
  notifications?: NotificationItem[];
};

const DEFAULT_NOTIFS: NotificationItem[] = [
  { id: 1, type: 'order', title: 'Заказ #1042 отправлен', time: '2 мин назад', unread: true },
  { id: 2, type: 'message', title: 'Новое сообщение от продавца', time: '15 мин назад', unread: true },
  { id: 3, type: 'promo', title: 'Скидка 20% на всё до конца недели', time: '1 час назад', unread: true },
  { id: 4, type: 'system', title: 'Обновление приложения готово', time: '5 часов назад', unread: false },
];

/** Render the icon for a notification type. Returns JSX. */
function renderTypeIcon(type: NotifType, className: string) {
  switch (type) {
    case 'message':
      return <Mail className={className} />;
    case 'promo':
      return <Tag className={className} />;
    case 'system':
      return <Settings className={className} />;
    case 'order':
    default:
      return <Package className={className} />;
  }
}

function typeColor(type: NotifType): string {
  switch (type) {
    case 'message':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300';
    case 'promo':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300';
    case 'system':
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
    case 'order':
    default:
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300';
  }
}

/**
 * InAppNotificationCenterMockup — header с колокольчиком + dropdown.
 */
export function InAppNotificationCenterMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as InAppNotificationCenterConfig;
  const initialNotifs: NotificationItem[] =
    Array.isArray(cfg.notifications) && cfg.notifications.length > 0
      ? cfg.notifications.map((n, i) => ({
          id: n.id ?? i + 1,
          type: n.type,
          title: n.title,
          time: n.time,
          unread: n.unread,
        }))
      : DEFAULT_NOTIFS;

  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<NotificationItem[]>(initialNotifs);
  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  const unreadCount = notifs.filter((n) => n.unread).length;

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id: number) {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    setHighlightedId(id);
    window.setTimeout(() => setHighlightedId(null), 1200);
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Лента"
        left={<ChevronLeft className="h-4 w-4" />}
        right={
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={`Уведомления${unreadCount > 0 ? `, ${unreadCount} непрочитанных` : ''}`}
            aria-expanded={open}
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950">
                {unreadCount}
              </span>
            )}
          </button>
        }
      />

      {/* Faux feed content */}
      <div className="h-[calc(100%-2.75rem)] overflow-y-auto p-3">
        <div className="space-y-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900">
            <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-2 h-2.5 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-900">
            <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="mt-2 h-2.5 w-1/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>

      {/* Dropdown panel — slides down from header */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-2 top-12 z-40 overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-3 py-2.5 dark:border-neutral-800">
              <h3 className="text-[13px] font-bold text-neutral-900 dark:text-white">
                Уведомления
              </h3>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="text-[11px] font-semibold text-emerald-600 transition-colors hover:text-emerald-700 disabled:opacity-40 dark:text-emerald-400"
              >
                Прочитать все
              </button>
            </div>

            {/* Notifications list */}
            <div className="max-h-[260px] overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="py-8 text-center text-[11px] text-neutral-400 dark:text-neutral-600">
                  Нет уведомлений
                </div>
              ) : (
                notifs.map((n) => {
                  const isHighlighted = highlightedId === n.id;
                  return (
                    <motion.button
                      key={n.id}
                      type="button"
                      onClick={() => markRead(n.id)}
                      animate={
                        isHighlighted
                          ? { backgroundColor: ['rgba(16,185,129,0.12)', 'rgba(16,185,129,0)'] }
                          : {}
                      }
                      transition={{ duration: 1.1 }}
                      className={cn(
                        'flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors',
                        'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
                        n.unread && 'bg-emerald-50/40 dark:bg-emerald-950/20',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          typeColor(n.type),
                        )}
                      >
                        {renderTypeIcon(n.type, 'h-4 w-4')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-1.5">
                          <span
                            className={cn(
                              'flex-1 text-[12px] leading-snug text-neutral-900 dark:text-neutral-100',
                              n.unread ? 'font-semibold' : 'font-medium',
                            )}
                          >
                            {n.title}
                          </span>
                          {n.unread && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                          )}
                        </div>
                        <div className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                          {n.time}
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Footer — see all */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-1 border-t border-neutral-100 py-2.5 text-[12px] font-semibold text-emerald-600 transition-colors hover:bg-emerald-50 dark:border-neutral-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
            >
              Смотреть все
              <ChevronRight className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brief toast when all marked as read */}
      <AnimatePresence>
        {open && unreadCount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-none absolute inset-x-2 top-12 z-30"
          >
            <div className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-semibold text-white shadow-md">
              <Check className="h-3 w-3" strokeWidth={3} />
              Все прочитано
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
