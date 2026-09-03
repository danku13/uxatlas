'use client';

import * as React from 'react';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MockupRenderer } from '@/components/phone/mockup-registry';
import { cn } from '@/lib/utils';
import type { TagDTO } from '@/lib/types';

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  CircleAlert,
  Send,
  X,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Static option catalogs — kept in sync with the seed + API contract.
// ---------------------------------------------------------------------------

const CATEGORIES: { slug: string; name: string }[] = [
  { slug: 'onboarding', name: 'Онбординг и первый запуск' },
  { slug: 'authentication', name: 'Регистрация и авторизация' },
  { slug: 'search-discovery', name: 'Поиск и обнаружение' },
  { slug: 'forms-input', name: 'Формы и ввод данных' },
  { slug: 'checkout-payment', name: 'Оплата и checkout' },
  { slug: 'errors-recovery', name: 'Ошибки и восстановление' },
  { slug: 'empty-states', name: 'Empty states' },
  { slug: 'loading-waiting', name: 'Загрузка и ожидание' },
  { slug: 'notifications-feedback', name: 'Уведомления и обратная связь' },
  { slug: 'settings-permissions', name: 'Настройки и разрешения' },
];

const MOCKUP_TYPES: { slug: string; name: string }[] = [
  { slug: 'onboarding-carousel', name: 'Onboarding carousel' },
  { slug: 'permission-priming', name: 'Permission priming' },
  { slug: 'passwordless-auth', name: 'Passwordless auth' },
  { slug: 'inline-validation-form', name: 'Inline validation form' },
  { slug: 'sticky-search', name: 'Sticky search' },
  { slug: 'empty-search', name: 'Empty search results' },
  { slug: 'multi-step-form', name: 'Multi-step form' },
  { slug: 'autofill-form', name: 'Autofill form' },
  { slug: 'express-checkout', name: 'Express checkout' },
  { slug: 'inline-payment-error', name: 'Inline payment error' },
  { slug: 'inline-error', name: 'Inline error' },
  { slug: 'actionable-empty', name: 'Actionable empty state' },
  { slug: 'skeleton-screen', name: 'Skeleton screen' },
  { slug: 'optimistic-ui', name: 'Optimistic UI' },
  { slug: 'snackbar-action', name: 'Snackbar with action' },
  { slug: 'pull-to-refresh', name: 'Pull to refresh' },
  { slug: 'grouped-settings', name: 'Grouped settings' },
  { slug: 'permission-rerequest', name: 'Permission re-request' },
  { slug: 'progressive-onboarding', name: 'Progressive onboarding (in-context hints)' },
  { slug: 'skip-onboarding-restore', name: 'Skip-able onboarding with restore' },
  { slug: 'biometric-auth', name: 'Biometric authentication (Face ID)' },
  { slug: 'search-filters-sheet', name: 'Search filters as bottom sheet' },
  { slug: 'smart-input-masks', name: 'Smart input masks (phone, card)' },
  { slug: 'order-summary-delivery', name: 'Order summary with delivery estimate' },
  { slug: 'offline-mode-cached', name: 'Offline mode with cached data' },
  { slug: 'retry-with-status', name: 'Retry with progressive status' },
  { slug: 'first-time-empty-tutorial', name: 'First-time empty state with tutorial' },
  { slug: 'error-empty-state', name: 'Error empty state (distinct from no-data)' },
  { slug: 'inline-progress-percentage', name: 'Inline progress with percentage + ETA' },
  { slug: 'in-app-notification-center', name: 'In-app notification center' },
  { slug: 'permission-status-dashboard', name: 'Permission status dashboard' },
  // Batch 2 — 40 new mockup types
  { slug: 'personalization-survey', name: 'Personalization survey onboarding' },
  { slug: 'feature-tour-overlay', name: 'Feature tour overlay' },
  { slug: 'time-to-value-progress', name: 'Time-to-value progress indicator' },
  { slug: 'passkey-auth', name: 'Passkey / WebAuthn authentication' },
  { slug: 'account-recovery', name: 'Account recovery flow' },
  { slug: 'recent-trending-tabs', name: 'Recent + Trending tabs in search' },
  { slug: 'voice-search', name: 'Voice search' },
  { slug: 'conditional-fields', name: 'Conditional fields (progressive disclosure)' },
  { slug: 'autosave-draft', name: 'Autosave draft' },
  { slug: 'file-upload-preview', name: 'File upload with preview' },
  { slug: 'guest-checkout', name: 'Guest checkout (no account required)' },
  { slug: 'save-card-tokenized', name: 'Save card (tokenized, secure)' },
  { slug: 'abandoned-cart-recovery', name: 'Abandoned cart recovery' },
  { slug: 'page-not-found-recovery', name: '404 / page not found recovery' },
  { slug: 'session-expired-recovery', name: 'Session expired recovery' },
  { slug: 'form-conflict-resolution', name: 'Form conflict resolution (optimistic locking)' },
  { slug: 'inbox-zero-celebration', name: 'Inbox zero celebration' },
  { slug: 'search-no-results-extended', name: 'Search no results — extended recovery' },
  { slug: 'blur-up-image-loading', name: 'Blur-up image loading' },
  { slug: 'staggered-content-reveal', name: 'Staggered content reveal' },
  { slug: 'haptic-feedback', name: 'Haptic feedback on actions' },
  { slug: 'destructive-action-confirm', name: 'Destructive action confirmation' },
  { slug: 'swipe-to-delete-undo', name: 'Swipe-to-delete with undo' },
  { slug: 'dark-mode-toggle', name: 'Dark mode (system/light/dark)' },
  { slug: 'account-deletion-flow', name: 'Account deletion flow with grace period' },
  { slug: 'product-filter-facets', name: 'Product filter facets with counts' },
  { slug: 'sort-dropdown', name: 'Sort dropdown' },
  { slug: 'quick-view-modal', name: 'Quick view modal' },
  { slug: 'price-range-slider', name: 'Price range slider (dual handle)' },
  { slug: 'recently-viewed', name: 'Recently viewed carousel' },
  { slug: 'variant-selection', name: 'Variant selection (color, size)' },
  { slug: 'size-guide-picker', name: 'Size guide with measurements' },
  { slug: 'quantity-stepper', name: 'Quantity stepper with stock awareness' },
  { slug: 'cart-preview-drawer', name: 'Cart preview drawer (slide-in)' },
  { slug: 'coupon-code-input', name: 'Coupon / promo code input' },
  { slug: 'bundle-cross-sell', name: 'Bundle / cross-sell' },
  { slug: 'empty-cart-recommendations', name: 'Empty cart with recommendations' },
  { slug: 'wishlist-favorites', name: 'Wishlist / favorites' },
  { slug: 'scarcity-urgency', name: 'Scarcity / urgency cues' },
  { slug: 'out-of-stock-recovery', name: 'Out of stock recovery' },
];

const SEVERITY_OPTIONS: {
  value: 'high' | 'medium' | 'low';
  label: string;
  hint: string;
}[] = [
  { value: 'high', label: 'High', hint: 'Критичная точка дроп-оффа' },
  { value: 'medium', label: 'Medium', hint: 'Заметный эффект на конверсию' },
  { value: 'low', label: 'Low', hint: 'Минорное UX-улучшение' },
];

const GUIDELINE_SOURCES: { value: string; label: string }[] = [
  { value: 'material', label: 'Material Design' },
  { value: 'hig', label: 'Apple HIG' },
  { value: 'nielsen', label: 'Nielsen Norman' },
  { value: 'custom', label: 'Custom' },
];

const STEPS = [
  { id: 0, label: 'Основы' },
  { id: 1, label: 'Проблема и решение' },
  { id: 2, label: 'Описание и мокап' },
  { id: 3, label: 'Дополнительно' },
  { id: 4, label: 'Проверка' },
];

// Fields that must be valid before leaving each step.
const STEP_FIELDS: (keyof FormValues)[][] = [
  ['title', 'summary', 'categorySlug', 'severity', 'authorName'],
  ['problemStatement', 'solution'],
  ['description', 'mockupType', 'mockupConfigRaw', 'platforms'],
  [], // extras — fully optional, but guidelines sub-fields validated on submit
  [], // review
];

// ---------------------------------------------------------------------------
// Zod schema — mirrors the POST /api/patterns contract.
// mockupConfigRaw is a string in the form; we parse it to an object on submit.
// ---------------------------------------------------------------------------

const guidelinesItemSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Заголовок ≥ 3 символа')
    .max(120, 'Заголовок ≤ 120 символов'),
  body: z
    .string()
    .trim()
    .min(5, 'Текст ≥ 5 символов')
    .max(2000, 'Текст ≤ 2000 символов'),
  source: z.enum(['material', 'hig', 'nielsen', 'custom']),
});

const formSchema = z.object({
  // Step 1 — Basics
  title: z
    .string()
    .trim()
    .min(3, 'Заголовок должен быть от 3 символов')
    .max(100, 'Заголовок до 100 символов'),
  summary: z
    .string()
    .trim()
    .min(10, 'Краткое описание от 10 символов')
    .max(200, 'Краткое описание до 200 символов'),
  categorySlug: z.string().min(1, 'Выберите категорию'),
  severity: z.enum(['high', 'medium', 'low']),
  authorName: z
    .string()
    .trim()
    .max(60, 'Имя автора до 60 символов')
    .default('Community'),

  // Step 2 — Problem & solution
  problemStatement: z
    .string()
    .trim()
    .min(10, 'Описание проблемы от 10 символов')
    .max(500, 'Описание проблемы до 500 символов'),
  solution: z
    .string()
    .trim()
    .min(10, 'Описание решения от 10 символов')
    .max(1000, 'Описание решения до 1000 символов'),

  // Step 3 — Description & mockup
  description: z
    .string()
    .trim()
    .min(20, 'Подробное описание от 20 символов')
    .max(2000, 'Подробное описание до 2000 символов'),
  mockupType: z.string().min(1, 'Выберите тип мокапа'),
  mockupConfigRaw: z
    .string()
    .min(1, 'JSON-конфиг обязателен')
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
        } catch {
          return false;
        }
      },
      'Должен быть валидный JSON-объект',
    ),
  platforms: z
    .array(z.string())
    .refine(
      (arr) => arr.includes('ios') || arr.includes('android'),
      'Выберите хотя бы одну платформу',
    ),

  // Step 4 — Extras (all optional)
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  useCases: z.array(z.string()).default([]),
  tagSlugs: z.array(z.string()).default([]),
  guidelines: z.array(guidelinesItemSchema).default([]),
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_MOCKUP_CONFIG = `{
  "title": "Управляйте подписками",
  "subtitle": "Найдите и отмените ненужные за 2 минуты",
  "emoji": "✨"
}`;

const DEFAULT_VALUES: FormValues = {
  title: '',
  summary: '',
  categorySlug: '',
  severity: 'medium',
  authorName: 'Community',
  problemStatement: '',
  solution: '',
  description: '',
  mockupType: '',
  mockupConfigRaw: DEFAULT_MOCKUP_CONFIG,
  platforms: ['ios', 'android'],
  pros: [],
  cons: [],
  useCases: [],
  tagSlugs: [],
  guidelines: [],
};

// ---------------------------------------------------------------------------
// Main dialog
// ---------------------------------------------------------------------------

export function SubmitPatternDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = React.useState(0);
  const [submitState, setSubmitState] = React.useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = form;

  // Reset step + form when dialog opens.
  React.useEffect(() => {
    if (open) {
      setStep(0);
      setSubmitState('idle');
      setSubmitError(null);
      reset(DEFAULT_VALUES);
    }
  }, [open, reset]);

  const advance = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields);
    if (valid) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (values: FormValues) => {
    setSubmitState('submitting');
    setSubmitError(null);

    // Parse mockup config (already validated client-side).
    let mockupConfig: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(values.mockupConfigRaw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        mockupConfig = parsed as Record<string, unknown>;
      }
    } catch {
      // Should never happen — schema enforces valid JSON.
    }

    // Filter out empty string entries from dynamic lists.
    const cleaned = {
      ...values,
      mockupConfig,
      pros: values.pros.map((s) => s.trim()).filter(Boolean),
      cons: values.cons.map((s) => s.trim()).filter(Boolean),
      useCases: values.useCases.map((s) => s.trim()).filter(Boolean),
      tagSlugs: values.tagSlugs,
      guidelines: values.guidelines.map((g) => ({
        title: g.title.trim(),
        body: g.body.trim(),
        source: g.source,
      })),
    };

    try {
      const res = await fetch('/api/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleaned),
      });

      if (res.status === 201) {
        setSubmitState('success');
        return;
      }

      if (res.status === 400) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string; details?: { path: string; message: string }[] }
          | null;
        setSubmitError(
          body?.details?.length
            ? body.details[0].message
            : body?.error ?? 'Не удалось отправить заявку',
        );
        setSubmitState('error');
        return;
      }

      setSubmitError('Сервер недоступен — попробуйте позже');
      setSubmitState('error');
    } catch {
      setSubmitError('Сетевая ошибка — проверьте подключение');
      setSubmitState('error');
    }
  };

  const handleClose = (next: boolean) => {
    if (submitState === 'submitting') return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={submitState !== 'submitting'}
        className="flex max-h-[92vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
        aria-describedby={undefined}
      >
        <DialogTitle id="submit-pattern-title" className="sr-only">
          Подать новый UX-паттерн
        </DialogTitle>
        <DialogDescription id="submit-pattern-desc" className="sr-only">
          Многошаговая форма. После отправки заявка попадёт в очередь модерации.
        </DialogDescription>

        {submitState === 'success' ? (
          <SuccessScreen onClose={() => onOpenChange(false)} />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col"
            noValidate
          >
            <Header step={step} />

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
              {step === 0 && (
                <StepBasics form={form} />
              )}
              {step === 1 && (
                <StepProblemSolution form={form} />
              )}
              {step === 2 && (
                <StepDescriptionMockup form={form} />
              )}
              {step === 3 && <StepExtras form={form} />}
              {step === 4 && <StepReview getValues={getValues} />}
            </div>

            <Footer
              step={step}
              submitState={submitState}
              submitError={submitError}
              onBack={back}
              onNext={advance}
            />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Header (progress indicator)
// ---------------------------------------------------------------------------

function Header({ step }: { step: number }) {
  const pct = ((step + 1) / STEPS.length) * 100;
  return (
    <div className="border-b bg-background/95 px-5 py-4 sm:px-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Подать паттерн
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-foreground sm:text-lg">
            Шаг {step + 1} из {STEPS.length} · {STEPS[step].label}
          </h2>
        </div>
        <span className="hidden text-xs font-medium text-muted-foreground sm:block">
          {STEPS.map((s) => (
            <span
              key={s.id}
              className={cn(
                'mr-1.5 inline-flex size-5 items-center justify-center rounded-full text-[10px] font-semibold transition-colors',
                s.id < step && 'bg-emerald-500 text-white',
                s.id === step && 'bg-emerald-600 text-white ring-4 ring-emerald-500/15',
                s.id > step && 'bg-muted text-muted-foreground',
              )}
            >
              {s.id < step ? <Check className="size-3" /> : s.id + 1}
            </span>
          ))}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer (nav buttons + submit error)
// ---------------------------------------------------------------------------

function Footer({
  step,
  submitState,
  submitError,
  onBack,
  onNext,
}: {
  step: number;
  submitState: 'idle' | 'submitting' | 'success' | 'error';
  submitError: string | null;
  onBack: () => void;
  onNext: () => void;
}) {
  const isLast = step === STEPS.length - 1;
  const isSubmitting = submitState === 'submitting';
  return (
    <div className="border-t bg-background/95 px-5 py-4 sm:px-7">
      {submitError && (
        <div
          role="alert"
          className="mb-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          disabled={step === 0 || isSubmitting}
          className="text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Назад
        </Button>

        {isLast ? (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Отправляем…
              </>
            ) : (
              <>
                <Send className="size-4" />
                Отправить на модерацию
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onNext}
            disabled={isSubmitting}
            className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Далее
            <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reusable bits
// ---------------------------------------------------------------------------

function FieldError({ id, message }: { id?: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400"
    >
      <CircleAlert className="size-3 shrink-0" />
      {message}
    </p>
  );
}

function CharCounter({ value, max }: { value: string; max: number }) {
  const len = (value ?? '').length;
  const danger = len > max;
  const warn = len > max * 0.9;
  return (
    <span
      className={cn(
        'ml-auto text-[11px] tabular-nums',
        danger
          ? 'text-red-600 dark:text-red-400'
          : warn
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-muted-foreground',
      )}
    >
      {len}/{max}
    </span>
  );
}

/** Subscribes to a single text field and shows a live char counter. */
function CharCounterFor({
  control,
  name,
  max,
}: {
  control: Control<FormValues>;
  name: keyof FormValues;
  max: number;
}) {
  const value = useWatch({ control, name: name as never }) as unknown as string;
  return <CharCounter value={value ?? ''} max={max} />;
}

function SectionHeading({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function LabelRow({
  htmlFor,
  label,
  children,
}: {
  htmlFor: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <Label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </Label>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Basics
// ---------------------------------------------------------------------------

function StepBasics({ form }: { form: UseFormReturn<FormValues> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Основы паттерна"
        hint="Кратко: что это, где встречается и насколько серьёзно."
      />

      {/* Title */}
      <div>
        <LabelRow htmlFor="sp-title" label="Название паттерна">
          <CharCounterFor control={control} name="title" max={100} />
        </LabelRow>
        <Input
          id="sp-title"
          placeholder="Напр. Value-first onboarding carousel"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'sp-title-err' : undefined}
          {...register('title')}
        />
        <FieldError id="sp-title-err" message={errors.title?.message} />
      </div>

      {/* Summary */}
      <div>
        <LabelRow htmlFor="sp-summary" label="Краткое описание">
          <CharCounterFor control={control} name="summary" max={200} />
        </LabelRow>
        <Textarea
          id="sp-summary"
          rows={3}
          placeholder="1–2 предложения о том, что делает паттерн."
          aria-invalid={!!errors.summary}
          aria-describedby={errors.summary ? 'sp-summary-err' : undefined}
          {...register('summary')}
        />
        <FieldError id="sp-summary-err" message={errors.summary?.message} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Category */}
        <div>
          <LabelRow htmlFor="sp-category" label="Категория" />
          <Controller
            control={control}
            name="categorySlug"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="sp-category"
                  className="w-full"
                  aria-invalid={!!errors.categorySlug}
                  aria-describedby={errors.categorySlug ? 'sp-category-err' : undefined}
                >
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError id="sp-category-err" message={errors.categorySlug?.message} />
        </div>

        {/* Author */}
        <div>
          <LabelRow htmlFor="sp-author" label="Имя автора">
            <CharCounterFor control={control} name="authorName" max={60} />
          </LabelRow>
          <Input
            id="sp-author"
            placeholder="Community"
            aria-invalid={!!errors.authorName}
            aria-describedby={errors.authorName ? 'sp-author-err' : undefined}
            {...register('authorName')}
          />
          <FieldError id="sp-author-err" message={errors.authorName?.message} />
        </div>
      </div>

      {/* Severity */}
      <div>
        <Label className="mb-1.5 text-sm font-medium">Severity</Label>
        <Controller
          control={control}
          name="severity"
          render={({ field }) => (
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="grid gap-2 sm:grid-cols-3"
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`sev-${opt.value}`}
                  className={cn(
                    'flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition-colors',
                    'hover:bg-muted/50',
                    field.value === opt.value
                      ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                      : 'border-input',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      id={`sev-${opt.value}`}
                      value={opt.value}
                      className="data-[state=checked]:border-emerald-500 data-[state=checked]:text-emerald-500"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {opt.label}
                    </span>
                  </div>
                  <span className="pl-6 text-xs text-muted-foreground">{opt.hint}</span>
                </label>
              ))}
            </RadioGroup>
          )}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Problem & Solution
// ---------------------------------------------------------------------------

function StepProblemSolution({ form }: { form: UseFormReturn<FormValues> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Проблема и решение"
        hint="Где пользователи отваливаются и как паттерн это исправляет."
      />

      <div>
        <LabelRow htmlFor="sp-problem" label="Описание проблемы">
          <CharCounterFor control={control} name="problemStatement" max={500} />
        </LabelRow>
        <Textarea
          id="sp-problem"
          rows={5}
          placeholder="Например: 40–60% пользователей уходят в первые 30 секунд, если сразу просят зарегистрироваться."
          aria-invalid={!!errors.problemStatement}
          aria-describedby={errors.problemStatement ? 'sp-problem-err' : undefined}
          {...register('problemStatement')}
        />
        <FieldError id="sp-problem-err" message={errors.problemStatement?.message} />
      </div>

      <div>
        <LabelRow htmlFor="sp-solution" label="Решение">
          <CharCounterFor control={control} name="solution" max={1000} />
        </LabelRow>
        <Textarea
          id="sp-solution"
          rows={6}
          placeholder="Как паттерн решает проблему? Какие принципы использует?"
          aria-invalid={!!errors.solution}
          aria-describedby={errors.solution ? 'sp-solution-err' : undefined}
          {...register('solution')}
        />
        <FieldError id="sp-solution-err" message={errors.solution?.message} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Description & mockup
// ---------------------------------------------------------------------------

function StepDescriptionMockup({ form }: { form: UseFormReturn<FormValues> }) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Описание и интерактивный мокап"
        hint="Полное описание паттерна + JSON-конфиг для живого превью в PhoneFrame."
      />

      <div>
        <LabelRow htmlFor="sp-desc" label="Подробное описание">
          <CharCounterFor control={control} name="description" max={2000} />
        </LabelRow>
        <Textarea
          id="sp-desc"
          rows={6}
          placeholder="Как паттерн устроен? Какие элементы UI участвуют? Что пользователь видит на каждом шаге?"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'sp-desc-err' : undefined}
          {...register('description')}
        />
        <FieldError id="sp-desc-err" message={errors.description?.message} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Mockup type + config editor */}
        <div className="space-y-3">
          <div>
            <Label className="mb-1.5 text-sm font-medium" htmlFor="sp-mockup-type">
              Тип мокапа
            </Label>
            <Controller
              control={control}
              name="mockupType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="sp-mockup-type"
                    className="w-full"
                    aria-invalid={!!errors.mockupType}
                    aria-describedby={errors.mockupType ? 'sp-mockup-type-err' : undefined}
                  >
                    <SelectValue placeholder="Выберите тип мокапа" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCKUP_TYPES.map((m) => (
                      <SelectItem key={m.slug} value={m.slug}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError id="sp-mockup-type-err" message={errors.mockupType?.message} />
          </div>

          <Controller
            control={control}
            name="mockupConfigRaw"
            render={({ field }) => (
              <MockupConfigEditor
                value={field.value}
                onChange={field.onChange}
                invalid={!!errors.mockupConfigRaw}
                errorMessage={errors.mockupConfigRaw?.message}
              />
            )}
          />
        </div>

        {/* Live preview */}
        <div>
          <Label className="mb-1.5 text-sm font-medium">Живое превью</Label>
          <div className="rounded-lg border bg-muted/30 p-4">
            <LivePreview control={control} />
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div>
        <Label className="mb-2 text-sm font-medium">Платформы</Label>
        <Controller
          control={control}
          name="platforms"
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {(['ios', 'android'] as const).map((p) => {
                const checked = field.value.includes(p);
                return (
                  <label
                    key={p}
                    htmlFor={`plat-${p}`}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors',
                      checked
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300'
                        : 'border-input hover:bg-muted/50',
                    )}
                  >
                    <Checkbox
                      id={`plat-${p}`}
                      checked={checked}
                      onCheckedChange={(c) => {
                        const next = c
                          ? [...field.value, p]
                          : field.value.filter((v) => v !== p);
                        field.onChange(next);
                      }}
                      className="data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white"
                    />
                    <span className="font-medium capitalize">{p}</span>
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.platforms && (
          <FieldError message={errors.platforms.message as string} />
        )}
      </div>
    </div>
  );
}

function MockupConfigEditor({
  value,
  onChange,
  invalid,
  errorMessage,
}: {
  value: string;
  onChange: (v: string) => void;
  invalid: boolean;
  errorMessage?: string;
}) {
  const [draft, setDraft] = React.useState(value);
  const [parseError, setParseError] = React.useState<boolean>(false);

  // Sync external -> draft when value changes externally (e.g. dialog reset).
  React.useEffect(() => {
    setDraft(value);
  }, [value]);

  // Debounce parse + propagate up.
  React.useEffect(() => {
    const t = setTimeout(() => {
      try {
        JSON.parse(draft);
        setParseError(false);
      } catch {
        setParseError(true);
      }
      onChange(draft);
    }, 200);
    return () => clearTimeout(t);
  }, [draft, onChange]);

  return (
    <div>
      <Label htmlFor="sp-mockup-config" className="mb-1.5 text-sm font-medium">
        Конфиг мокапа (JSON)
      </Label>
      <Textarea
        id="sp-mockup-config"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={10}
        spellCheck={false}
        className={cn(
          'resize-y font-mono text-xs leading-relaxed',
          (parseError || invalid) && 'border-red-400 focus-visible:ring-red-400/30',
        )}
        placeholder='{ "title": "Пример", "emoji": "✨" }'
        aria-invalid={invalid}
        aria-describedby={invalid ? 'sp-mockup-config-err' : undefined}
      />
      {parseError ? (
        <p
          role="alert"
          className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400"
        >
          <AlertCircle className="size-3" />
          Invalid JSON — превью не обновится
        </p>
      ) : (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Объект конфигурации, который получит мокап-компонент.
        </p>
      )}
      {errorMessage && (
        <p
          id="sp-mockup-config-err"
          role="alert"
          className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400"
        >
          <AlertCircle className="size-3" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function LivePreview({ control }: { control: Control<FormValues> }) {
  const typeVal = useWatch({ control, name: 'mockupType' }) as string;
  const rawVal = useWatch({ control, name: 'mockupConfigRaw' }) as string;

  let config: Record<string, unknown> = {};
  let valid = true;
  try {
    const parsed = rawVal ? JSON.parse(rawVal) : null;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      config = parsed as Record<string, unknown>;
    } else {
      valid = false;
    }
  } catch {
    valid = false;
  }

  if (!typeVal) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <Sparkles className="size-6 text-muted-foreground/50" />
        <p className="text-xs">Выберите тип мокапа, чтобы увидеть превью</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <AlertCircle className="size-6 text-amber-500/70" />
        <p className="text-xs">JSON некорректен — превью недоступно</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <MockupRenderer type={typeVal} config={config} className="max-w-[240px]" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Extras (pros / cons / useCases / tags / guidelines)
// ---------------------------------------------------------------------------

function StepExtras({ form }: { form: UseFormReturn<FormValues> }) {
  const { control } = form;
  const prosArr = useFieldArray({ control, name: 'pros' });
  const consArr = useFieldArray({ control, name: 'cons' });
  const useCasesArr = useFieldArray({ control, name: 'useCases' });
  const guidelinesArr = useFieldArray({ control, name: 'guidelines' });

  return (
    <div className="space-y-6">
      <SectionHeading
        title="Дополнительные детали"
        hint="Необязательные поля — помогут модератору быстрее понять паттерн."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DynamicList
          title="Плюсы (pros)"
          fields={prosArr}
          placeholder="Напр. Снижает churn на старте"
          emptyHint="Добавьте 2–4 плюса"
          register={form.register}
        />
        <DynamicList
          title="Минусы (cons)"
          fields={consArr}
          placeholder="Напр. Может раздражать опытных"
          emptyHint="Добавьте 1–2 минуса"
          register={form.register}
        />
      </div>

      <DynamicList
        title="Use cases"
        fields={useCasesArr}
        placeholder="Напр. Новое приложение без узнаваемого бренда"
        emptyHint="Когда паттерн особенно полезен?"
        register={form.register}
      />

      <Separator />

      <TagPicker control={control} />

      <Separator />

      <GuidelinesEditor form={form} fields={guidelinesArr} />
    </div>
  );
}

function DynamicList({
  title,
  fields,
  placeholder,
  emptyHint,
  register,
}: {
  title: string;
  fields: ReturnType<typeof useFieldArray<FormValues>>;
  placeholder: string;
  emptyHint: string;
  register: UseFormRegister<FormValues>;
}) {
  return (
    <div>
      <Label className="mb-2 text-sm font-medium">{title}</Label>
      <div className="space-y-2">
        {fields.fields.length === 0 && (
          <p className="rounded-md border border-dashed bg-muted/30 px-3 py-3 text-xs text-muted-foreground">
            {emptyHint}
          </p>
        )}
        {fields.fields.map((item, i) => (
          <div key={item.id} className="flex items-center gap-2">
            <Input
              placeholder={placeholder}
              className="h-8 text-sm"
              {...register(`${fields.name}.${i}` as const)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground hover:text-red-600"
              onClick={() => fields.remove(i)}
              aria-label={`Удалить ${title.toLowerCase()} #${i + 1}`}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fields.append('')}
        className="mt-2 h-8 border-dashed text-xs text-muted-foreground"
      >
        <Plus className="size-3.5" />
        Добавить
      </Button>
    </div>
  );
}

function TagPicker({ control }: { control: Control<FormValues> }) {
  const [tags, setTags] = React.useState<TagDTO[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    fetch('/api/tags')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: TagDTO[]) => {
        if (!cancelled) setTags(data);
      })
      .catch(() => {
        // graceful — keep empty list
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <Label className="mb-2 text-sm font-medium">Теги</Label>
      <Controller
        control={control}
        name="tagSlugs"
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {loading && (
              <span className="text-xs text-muted-foreground">Загружаем теги…</span>
            )}
            {!loading && tags.length === 0 && (
              <span className="text-xs text-muted-foreground">Теги пока недоступны.</span>
            )}
            {tags.map((t) => {
              const selected = field.value.includes(t.slug);
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() =>
                    field.onChange(
                      selected
                        ? field.value.filter((s: string) => s !== t.slug)
                        : [...field.value, t.slug],
                    )
                  }
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs transition-colors',
                    selected
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-input bg-background hover:bg-muted/50',
                  )}
                  aria-pressed={selected}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        )}
      />
    </div>
  );
}

function GuidelinesEditor({
  form,
  fields,
}: {
  form: UseFormReturn<FormValues>;
  fields: ReturnType<typeof useFieldArray<FormValues>>;
}) {
  const { register, control, formState } = form;
  const errors = formState.errors;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label className="text-sm font-medium">Гайдлайны / источники</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fields.append({ title: '', body: '', source: 'custom' })}
          className="h-8 border-dashed text-xs"
        >
          <Plus className="size-3.5" />
          Добавить гайдлайн
        </Button>
      </div>

      {fields.fields.length === 0 && (
        <p className="rounded-md border border-dashed bg-muted/30 px-3 py-3 text-xs text-muted-foreground">
          Сошлитесь на Material Design / Apple HIG / Nielsen Norman — добавьте заголовок, текст и источник.
        </p>
      )}

      <div className="space-y-3">
        {fields.fields.map((item, i) => {
          const err = errors.guidelines?.[i];
          return (
            <div
              key={item.id}
              className="space-y-2 rounded-lg border bg-card/50 p-3"
            >
              <div className="flex items-start gap-2">
                <Input
                  placeholder="Заголовок гайдлайна"
                  className="h-8 text-sm"
                  aria-invalid={!!err?.title}
                  aria-label={`Заголовок гайдлайна ${i + 1}`}
                  {...register(`guidelines.${i}.title` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 text-muted-foreground hover:text-red-600"
                  onClick={() => fields.remove(i)}
                  aria-label={`Удалить гайдлайн #${i + 1}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <Textarea
                rows={2}
                placeholder="Цитата или пересказ принципа"
                className="text-sm"
                aria-invalid={!!err?.body}
                aria-label={`Текст гайдлайна ${i + 1}`}
                {...register(`guidelines.${i}.body` as const)}
              />
              <Controller
                control={control}
                name={`guidelines.${i}.source` as const}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 w-full text-xs" size="sm">
                      <SelectValue placeholder="Источник" />
                    </SelectTrigger>
                    <SelectContent>
                      {GUIDELINE_SOURCES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {err && (
                <p role="alert" className="text-xs text-red-600 dark:text-red-400">
                  {err.title?.message || err.body?.message || err.source?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5 — Review & submit
// ---------------------------------------------------------------------------

function StepReview({
  getValues,
}: {
  getValues: UseFormGetValues<FormValues>;
}) {
  const v = getValues();
  const category = CATEGORIES.find((c) => c.slug === v.categorySlug);
  const mockup = MOCKUP_TYPES.find((m) => m.slug === v.mockupType);
  const pros = v.pros.filter((s) => s.trim());
  const cons = v.cons.filter((s) => s.trim());
  const useCases = v.useCases.filter((s) => s.trim());
  const tags = v.tagSlugs;

  return (
    <div className="space-y-5">
      <SectionHeading
        title="Проверьте перед отправкой"
        hint="Заявка попадёт в очередь модерации. Вы сможете отредактировать её, вернувшись назад."
      />

      <ReviewBlock title="Основы">
        <ReviewRow label="Название" value={v.title} />
        <ReviewRow label="Краткое описание" value={v.summary} multiline />
        <ReviewRow label="Категория" value={category?.name ?? v.categorySlug} />
        <ReviewRow label="Severity" value={v.severity} />
        <ReviewRow label="Автор" value={v.authorName} />
      </ReviewBlock>

      <ReviewBlock title="Проблема и решение">
        <ReviewRow label="Проблема" value={v.problemStatement} multiline />
        <ReviewRow label="Решение" value={v.solution} multiline />
      </ReviewBlock>

      <ReviewBlock title="Описание и мокап">
        <ReviewRow label="Описание" value={v.description} multiline />
        <ReviewRow label="Тип мокапа" value={mockup?.name ?? v.mockupType} />
        <ReviewRow label="Платформы" value={v.platforms.join(', ')} />
      </ReviewBlock>

      <ReviewBlock title="Дополнительно">
        <ReviewRow label="Плюсы" value={pros.length ? pros.join(' · ') : '—'} multiline />
        <ReviewRow label="Минусы" value={cons.length ? cons.join(' · ') : '—'} multiline />
        <ReviewRow label="Use cases" value={useCases.length ? useCases.join(' · ') : '—'} multiline />
        <ReviewRow label="Теги" value={tags.length ? tags.join(', ') : '—'} />
        <ReviewRow
          label="Гайдлайны"
          value={
            v.guidelines.length
              ? v.guidelines.map((g) => `${g.title} (${g.source})`).join(' · ')
              : '—'
          }
          multiline
        />
      </ReviewBlock>

      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
        После отправки заявка получит статус{' '}
        <Badge className="mx-1 bg-amber-400 text-amber-950">pending</Badge>
        и <Badge className="mx-1 bg-slate-400 text-white">published=false</Badge>. Модератор
        увидит её в очереди.
      </div>
    </div>
  );
}

function ReviewBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card/30">
      <header className="border-b px-4 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </header>
      <dl className="divide-y">{children}</dl>
    </section>
  );
}

function ReviewRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 px-4 py-2.5">
      <dt className="col-span-1 text-xs font-medium text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          'col-span-2 text-sm text-foreground',
          multiline ? 'whitespace-pre-wrap break-words' : 'truncate',
        )}
        title={multiline ? undefined : value}
      >
        {value || '—'}
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success screen
// ---------------------------------------------------------------------------

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 ring-8 ring-emerald-500/10 dark:bg-emerald-900/40 dark:ring-emerald-500/10">
        <Check className="size-8 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground sm:text-xl">
        Заявка отправлена на модерацию!
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Спасибо за вклад. Ваш паттерн получил статус{' '}
        <Badge className="mx-0.5 bg-amber-400 text-amber-950">pending</Badge> и теперь
        ждёт проверки модератором. Как только заявку одобрят, паттерн появится в каталоге.
      </p>
      <Button
        type="button"
        onClick={onClose}
        className="mt-6 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        Готово
      </Button>
    </div>
  );
}
