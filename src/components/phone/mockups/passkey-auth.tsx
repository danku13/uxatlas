'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Check,
  Fingerprint,
  KeyRound,
  ScanFace,
  Lock,
} from 'lucide-react';
import { MockupScreen } from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  appName?: string;
  lastLogin?: string;
};

type Stage = 'lock' | 'scanning' | 'success' | 'home' | 'password';

/**
 * PasskeyAuthMockup — lock screen with a Passkey CTA. Tapping starts a brief
 * Face ID scan (progress ring), then a green check + "Вход выполнен" + a faux
 * home screen briefly before resetting. "Использовать пароль" reveals a
 * numeric password input (1234 succeeds).
 */
export function PasskeyAuthMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const appName = cfg.appName ?? 'Кошелёк';
  const lastLogin = cfg.lastLogin ?? 'Последний вход: сегодня, 09:14';

  const [stage, setStage] = useState<Stage>('lock');
  const [progress, setProgress] = useState(0);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function startPasskey() {
    if (stage !== 'lock') return;
    setStage('scanning');
    setProgress(0);
    const start = Date.now();
    const duration = 1300;
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct >= 100) {
        window.clearInterval(interval);
        timerRef.current = window.setTimeout(() => {
          setStage('success');
          timerRef.current = window.setTimeout(() => {
            setStage('home');
            timerRef.current = window.setTimeout(() => {
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
      timerRef.current = window.setTimeout(() => {
        setStage('home');
        timerRef.current = window.setTimeout(() => {
          setStage('lock');
          setPw('');
          setProgress(0);
        }, 1800);
      }, 900);
    } else {
      setPwError(true);
    }
  }

  const R = 50;
  const CIRC = 2 * Math.PI * R;

  return (
    <MockupScreen className="relative flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Top bar */}
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
        {/* App icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
          <KeyRound className="h-6 w-6" strokeWidth={2.2} />
        </div>
        <h2 className="mt-4 text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
          {appName}
        </h2>
        <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{lastLogin}</p>

        {/* Passkey badge */}
        {stage === 'lock' && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900"
          >
            <Fingerprint className="h-3 w-3" />
            Passkey включён
          </motion.div>
        )}

        {/* Scanning / success zone */}
        {stage !== 'home' && (
          <div className="relative mt-8 flex h-32 w-32 items-center justify-center">
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

            {stage === 'lock' && (
              <span
                className="absolute inset-3 rounded-full bg-emerald-400/15"
                style={{ animation: 'pkPulse 1.8s ease-in-out infinite' }}
              />
            )}

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
                <Lock className="h-12 w-12 text-neutral-300 dark:text-neutral-600" strokeWidth={1.6} />
              ) : (
                <ScanFace className="h-12 w-12 text-emerald-600 dark:text-emerald-400" strokeWidth={1.6} />
              )}
            </div>
          </div>
        )}

        {/* Status text */}
        {stage === 'lock' && (
          <p className="mt-6 text-[12px] text-neutral-500 dark:text-neutral-400">
            Войдите через Passkey — без пароля
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
        {stage === 'home' && <FauxHome appName={appName} />}

        {/* Password fallback */}
        {stage === 'password' && (
          <div className="mt-6 w-full max-w-[230px]" style={{ animation: 'pkFade 220ms ease both' }}>
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
                onClick={startPasskey}
                className="h-11 w-full rounded-full bg-emerald-600 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 active:bg-emerald-800"
              >
                Войти через Passkey
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
                Использовать Passkey
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes pkPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.15); opacity: 0.15; }
        }
        @keyframes pkFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </MockupScreen>
  );
}

function FauxHome({ appName }: { appName: string }) {
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
            +8%
          </span>
        </div>
        <div className="mt-1 text-[18px] font-bold text-neutral-900 dark:text-white">86 320 ₽</div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {['Отправить', 'Заплатить', 'История'].map((q) => (
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
