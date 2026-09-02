'use client';

import { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Check,
  CreditCard,
  MapPin,
  Truck,
  User,
} from 'lucide-react';
import {
  MockupScreen,
  PhoneFieldLabel,
  PhoneInput,
  PhonePrimaryButton,
} from './_shared';
import { cn } from '@/lib/utils';

type Cfg = {
  steps?: string[];
  current?: number;
  field?: { label: string; placeholder: string };
};

type Stage = 'flow' | 'success';

const ADDRESS_OPTIONS = [
  { id: 'home', label: 'Дом', address: 'ул. Лесная, 12, кв. 47', icon: Building2 },
  { id: 'work', label: 'Работа', address: 'пр. Мира, 105, оф. 312', icon: Building2 },
  { id: 'pickup', label: 'Самовывоз', address: 'Магазин на Тверской, 5', icon: MapPin },
];

const PAYMENT_OPTIONS = [
  { id: 'card', label: 'Картой', sub: 'Visa •• 4242', icon: CreditCard },
  { id: 'apple', label: 'Apple Pay', sub: 'Быстрая оплата', icon: CreditCard },
  { id: 'cod', label: 'Наличными', sub: 'При получении', icon: Truck },
];

export function MultiStepFormMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as Cfg;
  const steps = Array.isArray(cfg.steps) && cfg.steps.length > 0 ? cfg.steps : ['Имя', 'Адрес', 'Оплата'];
  const total = steps.length;
  const fieldDef = cfg.field ?? { label: 'Имя получателя', placeholder: 'Иван Петров' };

  const [stage, setStage] = useState<Stage>('flow');
  const [step, setStep] = useState<number>(
    typeof cfg.current === 'number' && cfg.current >= 0 && cfg.current < total ? cfg.current : 0,
  );
  const [name, setName] = useState('');
  const [addressId, setAddressId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const progress = ((step + 1) / total) * 100;
  const isLast = step === total - 1;

  const canProceed = () => {
    if (step === 0) return name.trim().length >= 2;
    if (step === 1) return addressId !== null;
    if (step === 2) return paymentId !== null;
    return true;
  };

  const onPrimary = () => {
    if (isLast) {
      setStage('success');
      return;
    }
    if (canProceed()) setStep((s) => Math.min(total - 1, s + 1));
  };

  const onBack = () => {
    if (step === 0) return;
    setStep((s) => Math.max(0, s - 1));
  };

  if (stage === 'success') {
    return (
      <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
        <div className="flex h-11 items-center px-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Оформление заказа
          </span>
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center px-6 text-center"
          style={{ animation: 'msFade 300ms ease both' }}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-4 ring-emerald-100 dark:bg-emerald-950 dark:ring-emerald-900">
            <Check className="h-10 w-10 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
          </div>
          <h2 className="mt-6 text-[24px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Готово!
          </h2>
          <p className="mt-3 max-w-[230px] text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Заказ оформлен. Мы отправим подтверждение на почту.
          </p>
          <div className="mt-6 w-full rounded-xl border border-neutral-100 bg-neutral-50 p-3 text-left dark:border-neutral-800 dark:bg-neutral-900">
            <Row label="Получатель" value={name || 'Иван Петров'} />
            <Row label="Адрес" value={ADDRESS_OPTIONS.find((a) => a.id === addressId)?.address ?? '—'} />
            <Row label="Оплата" value={PAYMENT_OPTIONS.find((p) => p.id === paymentId)?.label ?? '—'} last />
          </div>
          <button
            type="button"
            onClick={() => {
              setStage('flow');
              setStep(0);
              setName('');
              setAddressId(null);
              setPaymentId(null);
            }}
            className="mt-6 text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            Повторить сценарий
          </button>
        </div>
        <style jsx>{`
          @keyframes msFade {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </MockupScreen>
    );
  }

  return (
    <MockupScreen className="flex flex-col bg-white dark:bg-neutral-950">
      {/* Top: back + step counter */}
      <div className="flex h-11 items-center justify-between px-3">
        <button
          type="button"
          onClick={onBack}
          disabled={step === 0}
          aria-label="Назад"
          className="flex items-center text-[13px] font-medium text-emerald-600 disabled:opacity-30 dark:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
          Шаг {step + 1} из {total}
        </span>
        <span className="w-4" />
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          {steps.map((s, i) => (
            <span
              key={s}
              className={cn(
                'transition-colors',
                i <= step ? 'text-emerald-600 dark:text-emerald-400' : '',
              )}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div key={step} style={{ animation: 'msFade 250ms ease both' }}>
          {step === 0 && (
            <div>
              <SectionHeading
                icon={User}
                title="Кто получит заказ?"
                subtitle="Укажите имя получателя для курьера."
              />
              <div className="mt-4">
                <PhoneFieldLabel>{fieldDef.label}</PhoneFieldLabel>
                <PhoneInput
                  value={name}
                  onChange={setName}
                  placeholder={fieldDef.placeholder}
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <SectionHeading
                icon={MapPin}
                title="Куда доставить?"
                subtitle="Выберите сохранённый адрес или добавьте новый."
              />
              <div className="mt-4 space-y-2">
                {ADDRESS_OPTIONS.map((opt) => {
                  const selected = addressId === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAddressId(opt.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all',
                        selected
                          ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg',
                          selected
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                          {opt.label}
                        </div>
                        <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                          {opt.address}
                        </div>
                      </div>
                      {selected && (
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <SectionHeading
                icon={CreditCard}
                title="Как оплатить?"
                subtitle="Выберите удобный способ оплаты заказа."
              />
              <div className="mt-4 space-y-2">
                {PAYMENT_OPTIONS.map((opt) => {
                  const selected = paymentId === opt.id;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentId(opt.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all',
                        selected
                          ? 'border-emerald-500 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/40'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg',
                          selected
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                            : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-semibold text-neutral-900 dark:text-white">
                          {opt.label}
                        </div>
                        <div className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                          {opt.sub}
                        </div>
                      </div>
                      {selected && (
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
        <PhonePrimaryButton disabled={!canProceed()} onClick={onPrimary}>
          {isLast ? 'Завершить' : 'Далее'}
        </PhonePrimaryButton>
      </div>

      <style jsx>{`
        @keyframes msFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </MockupScreen>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:ring-emerald-900">
        <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h2 className="mt-3 text-[18px] font-bold tracking-tight text-neutral-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">{subtitle}</p>
    </div>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn('flex justify-between gap-2 py-1.5', !last && 'border-b border-neutral-100 dark:border-neutral-800')}>
      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{label}</span>
      <span className="truncate text-[11px] font-medium text-neutral-900 dark:text-white">{value}</span>
    </div>
  );
}
