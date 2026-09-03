'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Camera,
  ChevronLeft,
  Check,
  X,
  Bell,
  MapPin,
  Mic,
} from 'lucide-react';
import { MockupScreen } from './_shared';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

type PermissionRerequestConfig = {
  icon?: string;
  title?: string;
  body?: string;
  primaryCta?: string;
  secondaryCta?: string;
};

type View = 'modal' | 'settings' | 'success' | 'dismissed';

const PERMISSIONS = [
  { key: 'camera', label: 'Камера', desc: 'Доступ к камере', icon: Camera, enabled: false },
  { key: 'notifications', label: 'Уведомления', desc: 'Push, баннеры, звуки', icon: Bell, enabled: true },
  { key: 'location', label: 'Геолокация', desc: 'При использовании', icon: MapPin, enabled: true },
  { key: 'microphone', label: 'Микрофон', desc: 'Для записи аудио', icon: Mic, enabled: false },
];

/** Render the requested icon — returns JSX, not a component type. */
function renderIcon(name: string | undefined, className: string) {
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

/**
 * PermissionRerequestMockup — повторный запрос доступа (amber = warning).
 * Primary CTA открывает фейковые iOS Настройки, можно включить Camera → success.
 */
export function PermissionRerequestMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as PermissionRerequestConfig;
  const title = cfg.title ?? 'Доступ к камере нужен';
  const body = cfg.body ?? 'Без камеры нельзя отсканировать документы. Включите доступ в настройках устройства.';
  const primaryCta = cfg.primaryCta ?? 'Открыть настройки';
  const secondaryCta = cfg.secondaryCta ?? 'Не сейчас';

  const [view, setView] = useState<View>('modal');
  const [perms, setPerms] = useState(PERMISSIONS);

  function setPerm(key: string, value: boolean) {
    setPerms((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled: value } : p)),
    );
  }

  const cameraOn = perms.find((p) => p.key === 'camera')?.enabled;

  // Если камеру включили — переходим к success автоматически
  function onToggleCamera(value: boolean) {
    setPerm('camera', value);
    if (value) {
      window.setTimeout(() => setView('success'), 400);
    }
  }

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      {/* Modal / success / dismissed views share the underlying screen */}
      {view === 'modal' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex h-full flex-col items-center justify-center px-6"
        >
          {/* Icon in amber tinted circle (warning) */}
          <div className="relative mb-5">
            <div className="absolute inset-0 -z-10 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
              {renderIcon(cfg.icon, 'h-9 w-9 text-amber-600 dark:text-amber-400')}
            </div>
          </div>

          <h1 className="text-center text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 max-w-[230px] text-center text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            {body}
          </p>

          <div className="mt-6 w-full max-w-[240px] space-y-2">
            <button
              type="button"
              onClick={() => setView('settings')}
              className="h-11 w-full rounded-full bg-amber-500 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 active:bg-amber-700"
            >
              {primaryCta}
            </button>
            <button
              type="button"
              onClick={() => setView('dismissed')}
              className="h-10 w-full rounded-full text-[13px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
            >
              {secondaryCta}
            </button>
          </div>

          {/* tiny hint */}
          <div className="mt-4 flex items-center gap-1 text-[10px] text-neutral-400">
            <span>Настройки → UX Patterns → Камера</span>
          </div>
        </motion.div>
      )}

      {/* Dismissed view */}
      {view === 'dismissed' && (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
            <Camera className="h-7 w-7 text-neutral-400" />
          </div>
          <div className="mt-4 text-[14px] font-semibold text-neutral-900 dark:text-white">
            Доступ всё ещё нужен
          </div>
          <p className="mt-2 max-w-[230px] text-[12px] text-neutral-500 dark:text-neutral-400">
            Без камеры вы не сможете отсканировать документы. Доступ можно включить в любой момент.
          </p>
          <button
            type="button"
            onClick={() => setView('modal')}
            className="mt-5 flex items-center gap-1 rounded-full bg-neutral-900 px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Вернуться к запросу
          </button>
        </div>
      )}

      {/* Success view */}
      <AnimatePresence>
        {view === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex h-full flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 280 }}
              className="relative mb-5"
            >
              <div className="absolute inset-0 -z-10 rounded-full bg-emerald-400/30 blur-2xl" />
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
              </div>
            </motion.div>
            <h1 className="text-center text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
              Доступ к камере включён
            </h1>
            <p className="mt-2 max-w-[230px] text-center text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              Теперь вы можете сканировать документы. Вернёмся к приложению…
            </p>
            <button
              type="button"
              onClick={() => setView('modal')}
              className="mt-6 h-11 w-full max-w-[240px] rounded-full bg-emerald-600 text-[14px] font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Продолжить
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings panel — slides up */}
      <AnimatePresence>
        {view === 'settings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col bg-neutral-100 dark:bg-neutral-950"
          >
            {/* Settings header */}
            <div className="flex h-11 items-center justify-between border-b border-neutral-200 px-3 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setView(cameraOn ? 'success' : 'modal')}
                className="flex items-center gap-1 text-[13px] font-medium text-amber-500 dark:text-amber-400"
                aria-label="Назад"
              >
                <ChevronLeft className="h-4 w-4" />
                Назад
              </button>
              <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                Настройки
              </div>
              <div className="w-12" />
            </div>

            {/* App row */}
            <div className="px-4 pb-2 pt-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-neutral-900">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40">
                  <Camera className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                    UX Patterns
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Доступ к функциям приложения
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions list */}
            <div className="px-4 pb-4">
              <div className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Разрешения
              </div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-neutral-900">
                {perms.map((p, i) => {
                  const PIcon = p.icon;
                  const isCamera = p.key === 'camera';
                  return (
                    <div
                      key={p.key}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3',
                        i > 0 && 'border-t border-neutral-100 dark:border-neutral-800',
                      )}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                        <PIcon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-medium text-neutral-900 dark:text-white">
                          {p.label}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {p.desc}
                        </div>
                      </div>
                      {isCamera ? (
                        <Switch
                          checked={p.enabled}
                          onCheckedChange={onToggleCamera}
                          aria-label={p.label}
                          className={p.enabled ? 'bg-emerald-600 data-[state=checked]:bg-emerald-600' : ''}
                        />
                      ) : (
                        <Switch
                          checked={p.enabled}
                          onCheckedChange={(v) => setPerm(p.key, v)}
                          aria-label={p.label}
                          className={p.enabled ? 'bg-emerald-600 data-[state=checked]:bg-emerald-600' : ''}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Helper */}
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 p-2.5 text-[10px] text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <span className="mt-[1px]">ⓘ</span>
                <span>Включите «Камера», чтобы продолжить. После включения кнопка «Назад» вернёт вас в приложение.</span>
              </div>
            </div>

            {/* Bottom action */}
            <div className="mt-auto px-4 pb-6">
              <button
                type="button"
                onClick={() => setView(cameraOn ? 'success' : 'modal')}
                className={cn(
                  'h-11 w-full rounded-full text-[14px] font-semibold text-white transition-colors',
                  cameraOn
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-black',
                )}
              >
                {cameraOn ? 'Готово' : 'Закрыть'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close X — top right when modal is open */}
      {view === 'modal' && (
        <button
          type="button"
          onClick={() => setView('dismissed')}
          aria-label="Закрыть"
          className="absolute right-3 top-3 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </MockupScreen>
  );
}
