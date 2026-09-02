'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScanFace, Lock, Check, ChevronLeft, Fingerprint } from 'lucide-react';
import { MockupScreen } from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  appName?: string;
  lastLogin?: string;
};

type Stage = 'lock' | 'scanning' | 'success' | 'home' | 'password';

/**
 * BiometricAuthMockup — lock screen with Face ID and a password fallback.
 * "Войти через Face ID" starts a brief scanning animation (1.2s progress ring).
 * On success: green check + "Вход выполнен" + faux home screen briefly.
 * "Использовать пароль" reveals a numeric password input — "1234" succeeds, anything else errors.
 */
export function BiometricAuthMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const appName = cfg.appName ?? 'МойБанк';
  const lastLogin = cfg.lastLogin ?? 'Последний вход: вчера, 19:42';

  const [stage, setStage] = useState<Stage>('lock');
  const [progress, setProgress] = useState(0); // 0..100 for the scanning ring
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);
  const scanTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    };
  }, []);

  function startFaceId() {
    if (stage !== 'lock') return;
    setStage('scanning');
    setProgress(0);
    const start = Date.now();
    const duration = 1200;
    // tick via rAF would be cleaner, but a 50ms interval is fine for a mockup
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(interval);
        scanTimerRef.current = window.setTimeout(() => {
          setStage('success');
          scanTimerRef.current = window.setTimeout(() => {
            setStage('home');
            scanTimerRef.current = window.setTimeout(() => {
              setStage('lock');
              setProgress(0);
              setPw('');
              setPwError(false);
            }, 2000);
          }, 1100);
        }, 250);
      }
    }, 40);
  }

  function submitPassword() {
    if (pw === '1234') {
      setPwError(false);
      setStage('success');
      scanTimerRef.current = window.setTimeout(() => {
        setStage('home');
        scanTimerRef.current = window.setTimeout(() => {
          setStage('lock');
          setPw('');
          setProgress(0);
        }, 1800);
      }, 900);
    } else {
      setPwError(true);
    }
  }

  // Ring geometry
  const R = 52;
  const CIRC = 2 * Math.PI * R;

  return (
    <MockupScreen className="relative flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Status bar area / app branding */}
      <div className="flex h-11 items-center justify-between px-4">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => {
            setStage('lock');
            setPw('');
            setPwError(false);
            setProgress(0);
          }}
          className="flex items-center text-[13px] font-medium text-emerald-600 dark:text-emerald-400"
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </button>
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Вход
        </span>
        <span className="w-8" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* App lock icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
          <Lock className="h-6 w-6" strokeWidth={2.2} />
        </div>
        <h2 className="mt-4 text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
          {appName}
        </h2>
        <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{lastLogin}</p>

        {/* Face ID scanning zone */}
        {stage !== 'home' && (
          <div className="relative mt-8 flex h-32 w-32 items-center justify-center">
            {/* Progress ring */}
            {(stage === 'scanning' || stage === 'success') && (
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-neutral-200 dark:text-neutral-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={R}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-emerald-500"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC - (CIRC * (stage === 'success' ? 100 : progress)) / 100}
                  style={{ transition: 'stroke-dashoffset 60ms linear' }}
                />
              </svg>
            )}

            {/* Pulsing aura when idle */}
            {stage === 'lock' && (
              <span
                className="absolute inset-2 rounded-full bg-emerald-400/15"
                style={{ animation: 'bioPulse 1.8s ease-in-out infinite' }}
              />
            )}

            {/* Icon */}
            <div className="relative flex h-20 w-20 items-center justify-center">
              {stage === 'success' ? (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 280 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950"
                >
                  <Check className="h-9 w-9 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                </motion.div>
              ) : stage === 'scanning' ? (
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                >
                  <ScanFace className="h-12 w-12 text-emerald-600 dark:text-emerald-400" strokeWidth={1.6} />
                </motion.div>
              ) : stage === 'password' ? (
                <Fingerprint className="h-12 w-12 text-neutral-300 dark:text-neutral-600" strokeWidth={1.6} />
              ) : (
                <ScanFace className="h-12 w-12 text-emerald-600 dark:text-emerald-400" strokeWidth={1.6} />
              )}
            </div>
          </div>
        )}

        {/* Status text */}
        {stage === 'lock' && (
          <p className="mt-6 text-[12px] text-neutral-500 dark:text-neutral-400">
            Используйте Face ID для входа
          </p>
        )}
        {stage === 'scanning' && (
          <p className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
            Сканирование...
          </p>
        )}
        {stage === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-[14px] font-semibold text-emerald-600 dark:text-emerald-400"
          >
            Вход выполнен
          </motion.p>
        )}
        {stage === 'home' && <HomeScreen appName={appName} />}

        {/* Password fallback */}
        {stage === 'password' && (
          <div className="mt-6 w-full max-w-[230px]" style={{ animation: 'bioFade 220ms ease both' }}>
            <input
              type="tel"
              inputMode="numeric"
              autoFocus
              value={pw}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                setPw(v);
                setPwError(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitPassword();
              }}
              placeholder="Введите пароль"
              className={cn(
                'h-12 w-full rounded-xl border bg-white px-3 text-center text-[16px] font-semibold tracking-[0.5em] text-neutral-900',
                'focus:outline-none focus:ring-2',
                'dark:bg-neutral-900 dark:text-white',
                pwError
                  ? 'border-red-400 focus:ring-red-500/30'
                  : 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-800',
              )}
            />
            {pwError && (
              <p className="mt-1.5 text-center text-[11px] font-medium text-red-500">
                Неверный пароль
              </p>
            )}
            <p className="mt-2 text-center text-[10px] text-neutral-400 dark:text-neutral-500">
              Подсказка: 1234
            </p>
            <button
              type="button"
              onClick={submitPassword}
              className="mt-3 h-11 w-full rounded-full bg-emerald-600 text-[13px] font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800"
            >
              Войти
            </button>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="px-6 pb-6">
        <AnimatePresence mode="wait">
          {stage === 'lock' && (
            <motion.div
              key="lock"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2"
            >
              <button
                type="button"
                onClick={startFaceId}
                className="h-11 w-full rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
              >
                Войти через Face ID
              </button>
              <button
                type="button"
                onClick={() => setStage('password')}
                className="h-9 w-full text-[12px] font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                Использовать пароль
              </button>
            </motion.div>
          )}
          {(stage === 'scanning' || stage === 'success' || stage === 'home') && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center text-[11px] text-neutral-400 dark:text-neutral-500"
            >
              Авторизация...
            </motion.div>
          )}
          {stage === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <button
                type="button"
                onClick={() => {
                  setStage('lock');
                  setPw('');
                  setPwError(false);
                }}
                className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
              >
                Использовать Face ID
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes bioPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.15;
          }
        }
        @keyframes bioFade {
          from {
            opacity: 0;
            transform: translateY(6px);
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

function HomeScreen({ appName }: { appName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {appName}
      </div>
      <div className="rounded-2xl bg-white p-3 text-left shadow-sm dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Баланс</span>
          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            +12%
          </span>
        </div>
        <div className="mt-1 text-[18px] font-bold text-neutral-900 dark:text-white">142 580 ₽</div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {['Перевод', 'Оплата', 'История'].map((q) => (
            <div
              key={q}
              className="rounded-lg bg-neutral-100 py-1.5 text-center text-[9px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {q}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
