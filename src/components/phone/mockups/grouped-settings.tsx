'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Bell, MapPin, Camera } from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type GroupItem = {
  label: string;
  description: string;
  enabled: boolean;
  /** пометить как «деструктивное» (например, отключение аналитики) */
  destructive?: boolean;
};

type Group = {
  title: string;
  items: GroupItem[];
};

type GroupedSettingsConfig = {
  groups?: Group[];
};

const DEFAULT_GROUPS: Group[] = [
  {
    title: 'Уведомления',
    items: [
      { label: 'Push-уведомления', description: 'Получать важные оповещения', enabled: true },
      { label: 'Email-рассылка', description: 'Новости и акции на почту', enabled: false },
      { label: 'SMS', description: 'Только критические уведомления', enabled: false },
    ],
  },
  {
    title: 'Конфиденциальность',
    items: [
      { label: 'Аналитика', description: 'Сбор обезличенных данных', enabled: true, destructive: true },
      { label: 'Реклама', description: 'Персонализированные предложения', enabled: true, destructive: true },
    ],
  },
  {
    title: 'Синхронизация',
    items: [
      { label: 'iCloud', description: 'Резервная копия настроек', enabled: true },
      { label: 'Авто-синхронизация', description: 'В фоне, раз в час', enabled: false },
    ],
  },
];

function iconForLabel(label: string) {
  const l = label.toLowerCase();
  if (l.includes('push') || l.includes('email') || l.includes('sms') || l.includes('уведомл'))
    return <Bell className="h-3.5 w-3.5 text-neutral-400" />;
  if (l.includes('аналит') || l.includes('реклам')) return <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />;
  if (l.includes('icloud') || l.includes('синхрон')) return <MapPin className="h-3.5 w-3.5 text-neutral-400" />;
  return <Camera className="h-3.5 w-3.5 text-neutral-400" />;
}

/**
 * GroupedSettingsMockup — iOS-style grouped settings list with Switch toggles.
 */
export function GroupedSettingsMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as GroupedSettingsConfig;
  const groups = cfg.groups ?? DEFAULT_GROUPS;

  const [state, setState] = useState<Group[]>(groups);
  const [destructiveMsg, setDestructiveMsg] = useState<string | null>(null);

  function toggle(groupIdx: number, itemIdx: number, next: boolean) {
    setState((prev) => {
      const nextGroups = prev.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              items: g.items.map((it, ii) =>
                ii === itemIdx ? { ...it, enabled: next } : it,
              ),
            }
          : g,
      );
      return nextGroups;
    });

    const item = state[groupIdx]?.items[itemIdx];
    if (item?.destructive && !next) {
      setDestructiveMsg('Данные собираться не будут');
      window.setTimeout(() => setDestructiveMsg(null), 2200);
    }
  }

  return (
    <MockupScreen className="relative bg-neutral-100 dark:bg-neutral-950">
      <PhoneNavBar
        title="Настройки"
        left={<ChevronLeft className="h-4 w-4" />}
      />

      <div className="h-[calc(100%-2.75rem)] overflow-y-auto pb-6">
        <h2 className="px-4 pb-2 pt-3 text-[22px] font-bold tracking-tight text-neutral-900 dark:text-white">
          Настройки
        </h2>

        <div className="space-y-5 px-3">
          {state.map((group, gi) => (
            <div key={gi}>
              <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {group.title}
              </div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-neutral-900">
                {group.items.map((item, ii) => (
                  <div
                    key={ii}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3',
                      ii > 0 && 'border-t border-neutral-100 dark:border-neutral-800',
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      {iconForLabel(item.label)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                        <span
                          className={cn(
                            'font-medium',
                            item.enabled
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-neutral-400 dark:text-neutral-500',
                          )}
                        >
                          {item.enabled ? 'Включено · ' : 'Выключено · '}
                        </span>
                        {item.description}
                      </div>
                    </div>
                    <Switch
                      checked={item.enabled}
                      onCheckedChange={(next) => toggle(gi, ii, next)}
                      aria-label={item.label}
                      className={cn(
                        item.enabled && 'bg-emerald-600 data-[state=checked]:bg-emerald-600',
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 px-4 text-center text-[10px] text-neutral-400">
          Версия 2.4.1 · build 1024
        </div>
      </div>

      {/* Destructive inline toast */}
      <AnimatePresence>
        {destructiveMsg && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-3 top-12 z-40"
          >
            <div className="flex items-center gap-2 rounded-xl bg-amber-500 px-3 py-2 text-white shadow-lg">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-[11px] font-medium">{destructiveMsg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MockupScreen>
  );
}
