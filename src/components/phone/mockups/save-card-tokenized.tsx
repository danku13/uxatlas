'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  Check,
  Plus,
  CreditCard,
  ShieldCheck,
  Star,
} from 'lucide-react';
import {
  MockupScreen,
  PhoneNavBar,
  PhoneBottomBar,
  PhoneFieldLabel,
} from './_shared';
import { cn } from '@/lib/utils';

type SavedCard = {
  brand: string;
  last4: string;
  expiry: string;
  default?: boolean;
};

type SaveCardTokenizedConfig = {
  savedCards?: SavedCard[];
  newCard?: boolean;
};

const DEFAULT_CARDS: SavedCard[] = [
  { brand: 'visa', last4: '4242', expiry: '08/27', default: true },
  { brand: 'mc', last4: '5573', expiry: '11/26' },
  { brand: 'visa', last4: '1881', expiry: '03/28' },
];

const TOTAL = '9 680 ₽';

function brandVisual(brand: string): { label: string; gradient: string } {
  switch (brand.toLowerCase()) {
    case 'visa':
      return { label: 'VISA', gradient: 'from-slate-700 to-slate-900' };
    case 'mc':
    case 'mastercard':
      return { label: 'MC', gradient: 'from-rose-500 to-amber-500' };
    case 'mir':
      return { label: 'МИР', gradient: 'from-emerald-600 to-emerald-800' };
    default:
      return { label: brand.toUpperCase().slice(0, 4), gradient: 'from-neutral-600 to-neutral-800' };
  }
}

const CARD_NUMBER_RE = /^[\d ]{19}$/; // 16 digits + 3 spaces

/**
 * SaveCardTokenizedMockup — выбор сохранённой карты или добавление новой.
 * Карты отображаются как цветные плашки с лейблом бренда.
 * При добавлении новой — форма с инлайн-валидацией (номер, срок, CVC).
 */
export function SaveCardTokenizedMockup({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const cfg = config as SaveCardTokenizedConfig;
  const cards = Array.isArray(cfg.savedCards) && cfg.savedCards.length > 0 ? cfg.savedCards : DEFAULT_CARDS;
  const defaultIdx = Math.max(
    0,
    cards.findIndex((c) => c.default),
  );

  const [selectedIdx, setSelectedIdx] = useState<number>(defaultIdx >= 0 ? defaultIdx : 0);
  const [addingNew, setAddingNew] = useState<boolean>(!!cfg.newCard);

  // New card fields
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // validation
  const numberDigits = number.replace(/\D/g, '');
  const numberValid = numberDigits.length === 16;
  const expiryValid = /^\d{2}\/\d{2}$/.test(expiry);
  const cvcValid = /^\d{3}$/.test(cvc);
  const newCardValid = numberValid && expiryValid && cvcValid;

  function formatCardNumber(v: string): string {
    const d = v.replace(/\D/g, '').slice(0, 16);
    return d.replace(/(.{4})/g, '$1 ').trim();
  }

  function formatExpiry(v: string): string {
    const d = v.replace(/\D/g, '').slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  }

  function handleAddNew() {
    if (!newCardValid) return;
    // simulate adding the card to the list as a tokenized entry
    const newCard: SavedCard = {
      brand: numberDigits.startsWith('4') ? 'visa' : 'mc',
      last4: numberDigits.slice(-4),
      expiry,
      default: false,
    };
    // mutate cards via state through array — use closure on cards since they come from props
    // We'll just visually select the newly-added one.
    setSelectedIdx(cards.length);
    setAddingNew(false);
    // store the newly added card visually — we keep it in a local state
    setExtraCards((prev) => [...prev, newCard]);
    setNumber('');
    setExpiry('');
    setCvc('');
  }

  const [extraCards, setExtraCards] = useState<SavedCard[]>([]);
  const allCards = [...cards, ...extraCards];

  return (
    <MockupScreen className="relative bg-neutral-50 dark:bg-neutral-950">
      <PhoneNavBar
        title="Способ оплаты"
        left={<ChevronLeft className="h-4 w-4" />}
      />

      <div className="px-4 pb-36 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-[16px] font-bold tracking-tight text-neutral-900 dark:text-white">
            Сохранённые карты
          </h1>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {allCards.length}
          </span>
        </div>

        {/* Cards list */}
        <div className="space-y-2.5">
          <AnimatePresence initial={false}>
            {allCards.map((card, i) => {
              const selected = !addingNew && selectedIdx === i;
              const visual = brandVisual(card.brand);
              return (
                <motion.button
                  key={`${card.brand}-${card.last4}-${i}`}
                  type="button"
                  onClick={() => {
                    setSelectedIdx(i);
                    setAddingNew(false);
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  aria-pressed={selected}
                  className={cn(
                    'relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left transition-all',
                    selected
                      ? 'border-emerald-500 bg-white shadow-md ring-1 ring-emerald-500/20 dark:bg-neutral-900'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
                  )}
                >
                  {/* Brand color block */}
                  <div
                    className={cn(
                      'flex h-9 w-12 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-[10px] font-bold text-white shadow-inner',
                      visual.gradient,
                    )}
                  >
                    {visual.label}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[13px] font-semibold text-neutral-900 dark:text-white">
                        •• {card.last4}
                      </span>
                      {card.default && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <Star className="h-2.5 w-2.5 fill-current" />
                          По умолчанию
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500">
                      До {card.expiry}
                    </div>
                  </div>

                  {/* Selection indicator */}
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                      selected
                        ? 'border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500'
                        : 'border-neutral-300 dark:border-neutral-600',
                    )}
                  >
                    {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add new card button */}
        <button
          type="button"
          onClick={() => setAddingNew((v) => !v)}
          aria-expanded={addingNew}
          className={cn(
            'mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed py-3 text-[13px] font-medium transition-colors',
            addingNew
              ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : 'border-neutral-300 text-neutral-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300',
          )}
        >
          <Plus className="h-4 w-4" />
          {addingNew ? 'Скрыть форму' : 'Добавить новую карту'}
        </button>

        {/* New card form */}
        <AnimatePresence>
          {addingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3 rounded-2xl bg-white p-3.5 shadow-sm dark:bg-neutral-900">
                {/* Card visual preview */}
                <div className="rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-950 p-3 text-white shadow-md">
                  <div className="flex items-center justify-between">
                    <CreditCard className="h-4 w-4 text-white/70" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
                      {numberDigits.startsWith('4') ? 'Visa' : 'Mastercard'}
                    </span>
                  </div>
                  <div className="mt-2 font-mono text-[14px] tracking-wider">
                    {number || '•••• •••• •••• ••••'}
                  </div>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <div className="text-[8px] uppercase tracking-wide text-white/40">До</div>
                      <div className="text-[11px] font-medium">{expiry || 'ММ/ГГ'}</div>
                    </div>
                    <div className="text-[11px] font-medium">•••</div>
                  </div>
                </div>

                <div>
                  <PhoneFieldLabel>Номер карты</PhoneFieldLabel>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => setNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    className={cn(
                      'h-11 w-full rounded-xl border bg-neutral-50 px-3 font-mono text-[13px] text-neutral-900 focus:outline-none focus:ring-2',
                      'dark:bg-neutral-950 dark:text-white',
                      number.length === 0
                        ? 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-800'
                        : numberValid
                          ? 'border-emerald-400 focus:ring-emerald-500/30'
                          : 'border-red-400 focus:ring-red-500/30',
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <PhoneFieldLabel>Срок</PhoneFieldLabel>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="ММ/ГГ"
                      className={cn(
                        'h-11 w-full rounded-xl border bg-neutral-50 px-3 font-mono text-[13px] text-neutral-900 focus:outline-none focus:ring-2',
                        'dark:bg-neutral-950 dark:text-white',
                        expiry.length === 0
                          ? 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-800'
                          : expiryValid
                            ? 'border-emerald-400 focus:ring-emerald-500/30'
                            : 'border-red-400 focus:ring-red-500/30',
                      )}
                    />
                  </div>
                  <div>
                    <PhoneFieldLabel>CVC</PhoneFieldLabel>
                    <input
                      type="password"
                      inputMode="numeric"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="•••"
                      className={cn(
                        'h-11 w-full rounded-xl border bg-neutral-50 px-3 font-mono text-[13px] text-neutral-900 focus:outline-none focus:ring-2',
                        'dark:bg-neutral-950 dark:text-white',
                        cvc.length === 0
                          ? 'border-neutral-200 focus:ring-emerald-500/30 dark:border-neutral-800'
                          : cvcValid
                            ? 'border-emerald-400 focus:ring-emerald-500/30'
                            : 'border-red-400 focus:ring-red-500/30',
                      )}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddNew}
                  disabled={!newCardValid}
                  className={cn(
                    'h-10 w-full rounded-full text-[13px] font-semibold text-white transition-all',
                    newCardValid
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                      : 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700',
                  )}
                >
                  Сохранить карту
                </button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                  <ShieldCheck className="h-3 w-3" />
                  Данные токенизируются и не хранятся на устройстве
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PhoneBottomBar>
        <button
          type="button"
          disabled={addingNew && !newCardValid}
          className={cn(
            'h-12 w-full rounded-full text-[15px] font-semibold text-white transition-all',
            addingNew && !newCardValid
              ? 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-700'
              : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800',
          )}
        >
          Оплатить {TOTAL}
        </button>
      </PhoneBottomBar>
    </MockupScreen>
  );
}
