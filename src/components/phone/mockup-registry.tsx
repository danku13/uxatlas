'use client';

import { PhoneFrame } from './phone-frame';
import { cn } from '@/lib/utils';

/**
 * MockupRegistry — единая точка входа для рендера интерактивного мокапа паттерна.
 *
 * Принимает mockupType (ключ из БД) и mockupConfig (JSON из БД),
 * рендерит PhoneFrame + нужный интерактивный компонент внутри.
 *
 * Если тип неизвестен — показывает fallback "Preview coming soon".
 */

// Импортируем все мокапы — они будут созданы по группам
import { OnboardingCarouselMockup } from './mockups/onboarding-carousel';
import { PermissionPrimingMockup } from './mockups/permission-priming';
import { PasswordlessAuthMockup } from './mockups/passwordless-auth';
import { InlineValidationFormMockup } from './mockups/inline-validation-form';
import { StickySearchMockup } from './mockups/sticky-search';
import { EmptySearchMockup } from './mockups/empty-search';
import { MultiStepFormMockup } from './mockups/multi-step-form';
import { AutofillFormMockup } from './mockups/autofill-form';
import { ExpressCheckoutMockup } from './mockups/express-checkout';
import { InlinePaymentErrorMockup } from './mockups/inline-payment-error';
import { InlineErrorMockup } from './mockups/inline-error';
import { ActionableEmptyMockup } from './mockups/actionable-empty';
import { SkeletonScreenMockup } from './mockups/skeleton-screen';
import { OptimisticUiMockup } from './mockups/optimistic-ui';
import { SnackbarActionMockup } from './mockups/snackbar-action';
import { PullToRefreshMockup } from './mockups/pull-to-refresh';
import { GroupedSettingsMockup } from './mockups/grouped-settings';
import { PermissionRerequestMockup } from './mockups/permission-rerequest';
// New mockups (Task 3-a-new + 3-b-new)
import { ProgressiveOnboardingMockup } from './mockups/progressive-onboarding';
import { SkipOnboardingRestoreMockup } from './mockups/skip-onboarding-restore';
import { BiometricAuthMockup } from './mockups/biometric-auth';
import { SearchFiltersSheetMockup } from './mockups/search-filters-sheet';
import { SmartInputMasksMockup } from './mockups/smart-input-masks';
import { OrderSummaryDeliveryMockup } from './mockups/order-summary-delivery';
import { OfflineModeCachedMockup } from './mockups/offline-mode-cached';
import { RetryWithStatusMockup } from './mockups/retry-with-status';
import { FirstTimeEmptyTutorialMockup } from './mockups/first-time-empty-tutorial';
import { ErrorEmptyStateMockup } from './mockups/error-empty-state';
import { InlineProgressPercentageMockup } from './mockups/inline-progress-percentage';
import { InAppNotificationCenterMockup } from './mockups/in-app-notification-center';
import { PermissionStatusDashboardMockup } from './mockups/permission-status-dashboard';

type MockupProps = {
  config: Record<string, unknown>;
};

type MockupEntry = {
  component: React.ComponentType<MockupProps>;
  variant?: 'light' | 'dark';
  /** compact mode suppresses the phone chrome (used inside small cards) */
};

const REGISTRY: Record<string, MockupEntry> = {
  'onboarding-carousel': { component: OnboardingCarouselMockup },
  'permission-priming': { component: PermissionPrimingMockup },
  'passwordless-auth': { component: PasswordlessAuthMockup },
  'inline-validation-form': { component: InlineValidationFormMockup },
  'sticky-search': { component: StickySearchMockup },
  'empty-search': { component: EmptySearchMockup },
  'multi-step-form': { component: MultiStepFormMockup },
  'autofill-form': { component: AutofillFormMockup },
  'express-checkout': { component: ExpressCheckoutMockup },
  'inline-payment-error': { component: InlinePaymentErrorMockup },
  'inline-error': { component: InlineErrorMockup },
  'actionable-empty': { component: ActionableEmptyMockup },
  'skeleton-screen': { component: SkeletonScreenMockup },
  'optimistic-ui': { component: OptimisticUiMockup },
  'snackbar-action': { component: SnackbarActionMockup },
  'pull-to-refresh': { component: PullToRefreshMockup },
  'grouped-settings': { component: GroupedSettingsMockup },
  'permission-rerequest': { component: PermissionRerequestMockup },
  // New mockups (Task 3-a-new + 3-b-new)
  'progressive-onboarding': { component: ProgressiveOnboardingMockup },
  'skip-onboarding-restore': { component: SkipOnboardingRestoreMockup },
  'biometric-auth': { component: BiometricAuthMockup },
  'search-filters-sheet': { component: SearchFiltersSheetMockup },
  'smart-input-masks': { component: SmartInputMasksMockup },
  'order-summary-delivery': { component: OrderSummaryDeliveryMockup },
  'offline-mode-cached': { component: OfflineModeCachedMockup },
  'retry-with-status': { component: RetryWithStatusMockup },
  'first-time-empty-tutorial': { component: FirstTimeEmptyTutorialMockup },
  'error-empty-state': { component: ErrorEmptyStateMockup },
  'inline-progress-percentage': { component: InlineProgressPercentageMockup },
  'in-app-notification-center': { component: InAppNotificationCenterMockup },
  'permission-status-dashboard': { component: PermissionStatusDashboardMockup },
};

export function MockupRenderer({
  type,
  config,
  className,
}: {
  type: string;
  config: Record<string, unknown> | string | null | undefined;
  className?: string;
}) {
  // config может прийти строкой (если API не распарсил) — парсим на всякий случай
  const parsedConfig: Record<string, unknown> =
    typeof config === 'string' && config.trim().startsWith('{')
      ? safeParse(config)
      : (config as Record<string, unknown>) ?? {};

  const entry = REGISTRY[type];
  if (!entry) {
    return (
      <PhoneFrame className={className}>
        <div className="flex h-full items-center justify-center bg-neutral-50 p-6 text-center dark:bg-neutral-950">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              {type}
            </div>
            <div className="mt-2 text-sm font-medium text-foreground">
              Interactive preview coming soon
            </div>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  const MockupComponent = entry.component;
  return (
    <PhoneFrame variant={entry.variant} className={cn(className)}>
      <MockupComponent config={parsedConfig} />
    </PhoneFrame>
  );
}

function safeParse(s: string): Record<string, unknown> {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
