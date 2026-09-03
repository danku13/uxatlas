'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Severity } from '@/lib/types';

/**
 * SeverityBadge — color-coded risk label for a UX pattern.
 *
 * high   → red    ("Высокий риск" / "High risk")
 * medium → amber  ("Средний риск" / "Medium risk")
 * low    → slate  ("Низкий риск" / "Low risk")
 *
 * Uses tinted backgrounds (not solid) so it reads well on both light and
 * dark cards.
 */

const SEVERITY_STYLES: Record<Severity, { className: string; key: string }> = {
  high: {
    className:
      'border-transparent bg-red-500/15 text-red-700 dark:bg-red-500/20 dark:text-red-300',
    key: 'high',
  },
  medium: {
    className:
      'border-transparent bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    key: 'medium',
  },
  low: {
    className:
      'border-transparent bg-slate-500/15 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
    key: 'low',
  },
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity | string;
  className?: string;
}) {
  const t = useTranslations('Severity');
  const s = (SEVERITY_STYLES[severity as Severity] ??
    SEVERITY_STYLES.low) as (typeof SEVERITY_STYLES)[Severity];
  return (
    <Badge variant="outline" className={cn('font-medium', s.className, className)}>
      {t(s.key as 'high' | 'medium' | 'low')}
    </Badge>
  );
}

export function severityDotClass(severity: Severity | string): string {
  switch (severity) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-amber-500';
    case 'low':
      return 'bg-slate-400';
    default:
      return 'bg-slate-400';
  }
}
