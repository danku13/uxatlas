'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Camera,
  Bell,
  MapPin,
  Mic,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { MockupScreen, PhoneNavBar } from './_shared';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type PermStatus = 'granted' | 'denied' | 'not-determined';

type PermissionRow = {
  name: string;
  status: PermStatus;
  icon: string;
};

type PermissionStatusDashboardConfig = {
  permissions?: PermissionRow[];
};

const DEFAULT_PERMS: PermissionRow[] = [
  { name: 'Камера', status: 'denied', icon: 'Camera' },
  { name: 'Уведомления', status: 'granted', icon: 'Bell' },
  { name: 'Геолокация', status: 'not-determined', icon: 'MapPin' },
  { name: 'Микрофон', status: 'not-determined', icon: 'Mic' },
];

/** Render the requested lucide icon (or fallback Shield). Returns JSX. */
function renderIcon(name: string, className: string) {
  switch (name) {
    case 'Bell':
      return <Bell className={className} />;
    case 'MapPin':
      return <MapPin className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'Camera':
    default:
      return <Camera className={className} />;
  }
}

type StatusMeta = {
  label: string;
  badgeClass: string;
  iconClass: string;
  ringClass: string;
};

const STATUS_META: Record<PermStatus, StatusMeta> = {
  granted: {
    label: 'Разрешено',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    iconClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    ringClass: 'ring-emerald-500/40',
  },
  denied: {
    label: 'Отклонено',
    badgeClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    iconClass: 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400',
    ringClass: 'ring-red-500/40',
  },
  'not-determined': {
    label: 'Не запрашивалось',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    iconClass: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    ringClass: 'ring-slate-400/40',
  },
};

type View = 'list' | 'explanation' | 'systemDialog' | 'settings';

/**
 * PermissionStatusDashboardMockup — list of permissions + status-colored icons.
 * denied → explanation card → settings; not-determined → system dialog.
 */
export function PermissionStatusDashboardMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as PermissionStatusDashboardConfig;
  const initialPerms: PermissionRow[] =
    Array.isArray(cfg.permissions) && cfg.permissions.length > 0
      ? cfg.permissions.map((p) => ({
          name: p.name,
          status: p.status,
          icon: p.icon,
        }))
      : DEFAULT_PERMS;

  const [perms, setPerms] = useState<PermissionRow[]>(initialPerms);
  const [view, setView] = useState<View>('list');
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [toast, setToast] = useState<string | null>(null);
  const [permToggles, setPermToggles] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    initialPerms.forEach((p) => {
      map[p.name] = p.status === 'granted';
    });
    return map;
  });

  const toastTimer = useRef<number | null>(null);
  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }

  function handleClickRow(i: number) {
    const p = perms[i];
    setActiveIdx(i);
    if (p.status === 'denied') {
      setView('explanation');
    } else if (p.status === 'not-determined') {
      setView('systemDialog');
    } else {
      // granted
      showToast('Уже разрешено');
    }
  }

  function openSettings() {
    setView('settings');
  }

  function setPermStatus(name: string, status: PermStatus) {
    setPerms((prev) => prev.map((p) => (p.name === name ? { ...p, status } : p)));
  }

  function handleSystemDialog(allow: boolean) {
    const active = perms[activeIdx];
    if (active) {
      setPermStatus(active.name, allow ? 'granted' : 'denied');
      setPermToggles((prev) => ({ ...prev, [active.name]: allow }));
    }
    setView('list');
    showToast(allow ? `«${active?.name}» разрешено` : `«${active?.name}» отклонено`);
  }

  function handleSettingsToggle(name: string, value: boolean) {
    setPermToggles((prev) => ({ ...prev, [name]: value }));
    setPermStatus(name, value ? 'granted' : 'denied');
  }

  const activePerm = activeIdx >= 0 ? perms[activeIdx] : null;

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Разрешения"
        left={
          view !== 'list' ? (
            <button
              type="button"
              onClick={() => setView('list')}
              aria-label="Назад"
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </button>
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )
        }
      />

      {/* List view */}
      {view === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-[calc(100%-2.75rem)] overflow-y-auto px-4 py-4"
        >
          <div className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Доступ к функциям
          </div>
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-neutral-900">
            {perms.map((p, i) => {
              const meta = STATUS_META[p.status];
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleClickRow(i)}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-3 text-left transition-colors',
                    'hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
                    i > 0 && 'border-t border-neutral-100 dark:border-neutral-800',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1',
                      meta.iconClass,
                      meta.ringClass,
                    )}
                  >
                    {renderIcon(p.icon, 'h-4 w-4')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                      {p.name}
                    </div>
                    <span
                      className={cn(
                        'mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                        meta.badgeClass,
                      )}
                    >
                      {p.status === 'granted' && (
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      )}
                      {meta.label}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300 dark:text-neutral-600" />
                </button>
              );
            })}
          </div>

          {/* Help banner */}
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-[10px] text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
            <ShieldCheck className="mt-[1px] h-3.5 w-3.5 shrink-0" />
            <span>
              Разрешения можно включить или отключить в любой момент. Нажмите на
              элемент, чтобы изменить.
            </span>
          </div>
        </motion.div>
      )}

      {/* Explanation card (denied) */}
      <AnimatePresence>
        {view === 'explanation' && activePerm && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-4 top-16 z-40"
          >
            <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-xl dark:border-red-900/40 dark:bg-neutral-900">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
                  {renderIcon(activePerm.icon, 'h-4 w-4 text-red-600 dark:text-red-400')}
                </div>
                <div className="text-[14px] font-bold text-neutral-900 dark:text-white">
                  {activePerm.name} отключено
                </div>
              </div>
              <p className="text-[12px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                Чтобы включить {activePerm.name.toLowerCase()}, перейдите в
                Настройки → Конфиденциальность.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={openSettings}
                  className="h-10 flex-1 rounded-full bg-emerald-600 text-[12px] font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Открыть настройки
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="h-10 rounded-full bg-neutral-100 px-4 text-[12px] font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  Не сейчас
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* System dialog (not-determined) */}
      <AnimatePresence>
        {view === 'systemDialog' && activePerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center bg-black/40"
            onClick={() => setView('list')}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full rounded-t-[1.5rem] bg-white px-5 pb-6 pt-4 dark:bg-neutral-900"
            >
              {/* handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

              <div className="mb-3 flex flex-col items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  {renderIcon(activePerm.icon, 'h-6 w-6 text-slate-600 dark:text-slate-300')}
                </div>
                <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white">
                  Разрешить {activePerm.name.toLowerCase()}?
                </h3>
                <p className="mt-1 max-w-[230px] text-[11px] text-neutral-500 dark:text-neutral-400">
                  Приложение UX Patterns запрашивает доступ к функции «{activePerm.name}».
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSystemDialog(true)}
                  className="h-11 w-full rounded-full bg-emerald-600 text-[14px] font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Разрешить
                </button>
                <button
                  type="button"
                  onClick={() => handleSystemDialog(false)}
                  className="h-11 w-full rounded-full text-[14px] font-semibold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  Не разрешать
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel (denied → open settings) */}
      <AnimatePresence>
        {view === 'settings' && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="absolute inset-0 z-50 flex flex-col bg-neutral-100 dark:bg-neutral-950"
          >
            <PhoneNavBar title="Настройки" />
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* App row */}
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                    UX Patterns
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Доступ к функциям
                  </div>
                </div>
              </div>

              <div className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Разрешения
              </div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-neutral-900">
                {perms.map((p, i) => (
                  <div
                    key={p.name}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3',
                      i > 0 && 'border-t border-neutral-100 dark:border-neutral-800',
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      {renderIcon(p.icon, 'h-4 w-4 text-neutral-500 dark:text-neutral-400')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[13px] font-medium text-neutral-900 dark:text-white">
                        {p.name}
                      </div>
                    </div>
                    <Switch
                      checked={!!permToggles[p.name]}
                      onCheckedChange={(v) => handleSettingsToggle(p.name, v)}
                      aria-label={p.name}
                      className={permToggles[p.name] ? 'bg-emerald-600 data-[state=checked]:bg-emerald-600' : ''}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-3 top-12 z-40 flex justify-center"
          >
            <div className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-2 text-white shadow-lg dark:bg-neutral-800">
              <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={3} />
              <span className="text-[11px] font-medium">{toast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close X for explanation card */}
      {view === 'explanation' && (
        <button
          type="button"
          onClick={() => setView('list')}
          aria-label="Закрыть"
          className="absolute right-3 top-3 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </MockupScreen>
  );
}
