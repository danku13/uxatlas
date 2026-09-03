'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import {
  AlertTriangle,
  Check,
  X,
  Lightbulb,
  Sparkles,
  Calendar,
  User,
  Share2,
  BookOpen,
  CircleCheck,
  CircleX,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MockupRenderer } from '@/components/phone/mockup-registry';
import { LucideIcon } from '@/components/lucide-icon';
import { SeverityBadge } from './severity-badge';
import { useToast } from '@/hooks/use-toast';
import type {
  PatternDTO,
  PatternDetailDTO,
  GuidelineSource,
} from '@/lib/types';

/**
 * PatternDetailDialog — модалка с интерактивным phone-превью и описанием паттерна.
 *
 * Десктоп (md+): 2 колонки — phone слева (sticky), контент справа со своим ScrollArea.
 * Мобайл: 1 колонка, dialog целиком скроллится нативно — сначала компактный phone,
 *         затем весь контент. Никакого overflow-hidden на dialog!
 */

const ACCENT_ICON: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-400',
  emerald:
    'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
  teal: 'bg-teal-500/10 text-teal-600 ring-teal-500/20 dark:text-teal-400',
  orange:
    'bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-400',
  red: 'bg-red-500/10 text-red-600 ring-red-500/20 dark:text-red-400',
  violet:
    'bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-400',
  sky: 'bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-400',
  pink: 'bg-pink-500/10 text-pink-600 ring-pink-500/20 dark:text-pink-400',
  slate: 'bg-slate-500/10 text-slate-600 ring-slate-500/20 dark:text-slate-300',
};

function accentIconClass(accent: string | null): string {
  if (accent && ACCENT_ICON[accent]) return ACCENT_ICON[accent];
  return ACCENT_ICON.slate;
}

const GUIDELINE_SOURCE_META: Record<
  GuidelineSource,
  { label: string; className: string }
> = {
  material: {
    label: 'Material Design',
    className:
      'bg-neutral-700 text-white dark:bg-neutral-700 dark:text-neutral-100',
  },
  hig: {
    label: 'Apple HIG',
    className:
      'bg-neutral-800 text-neutral-100 dark:bg-neutral-300 dark:text-neutral-900',
  },
  nielsen: {
    label: 'Nielsen Norman',
    className: 'bg-teal-600 text-white dark:bg-teal-500 dark:text-white',
  },
  custom: {
    label: 'Best practice',
    className:
      'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white',
  },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function PatternDetailDialog({
  pattern,
  open,
  onOpenChange,
}: {
  pattern: PatternDTO;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const t = useTranslations('PatternDetail');
  const cat = pattern.category;
  const iconName = cat?.icon ?? 'Circle';

  // Fetch full detail (with guidelines) only while the dialog is open.
  const { data, isLoading: detailLoading } = useQuery<PatternDetailDTO>({
    queryKey: ['pattern-detail', pattern.slug],
    queryFn: async () => {
      const res = await fetch(`/api/patterns/${pattern.slug}`);
      if (!res.ok) throw new Error('failed to load pattern');
      return (await res.json()) as PatternDetailDTO;
    },
    enabled: open,
    staleTime: 60 * 1000,
  });

  const guidelines = data?.guidelines ?? [];
  const pros = pattern.pros ?? [];
  const cons = pattern.cons ?? [];
  const useCases = pattern.useCases ?? [];
  const platforms = pattern.platforms ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Mobile: full-screen dialog that scrolls natively from top to bottom
        //   (phone preview first, then all content below — no overflow-hidden!)
        // Desktop: centered modal with internal grid (left = sticky phone,
        //   right = scrollable content), capped at 92vh.
        className="inset-0 h-[100dvh] max-h-none max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none p-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:translate-x-[-50%] sm:translate-y-[-50%] sm:overflow-hidden sm:rounded-lg"
        aria-describedby="pattern-detail-desc"
      >
        {/* Hidden accessible title/description */}
        <DialogTitle className="sr-only">{pattern.title}</DialogTitle>
        <DialogDescription id="pattern-detail-desc" className="sr-only">
          {t('demoHint')}
        </DialogDescription>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:max-h-[92vh]">
          {/* LEFT COLUMN — phone demo */}
          <div className="flex flex-col items-center gap-4 border-b bg-muted/30 p-6 md:border-b-0 md:border-r">
            <div className="w-full text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('interactiveDemo')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('demoHint')}
              </p>
            </div>

            {/* On mobile: compact phone (~240px wide). On desktop: full size (~300px). */}
            <div className="flex w-full items-center justify-center md:max-w-[300px]">
              <MockupRenderer
                type={pattern.mockupType}
                config={pattern.mockupConfig}
                className="!max-w-[240px] md:!max-w-[300px]"
              />
            </div>

            {platforms.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {platforms.map((p) => (
                  <Badge
                    key={p}
                    variant="secondary"
                    className="font-medium uppercase tracking-wide"
                  >
                    {p}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          {/* RIGHT COLUMN — content (scrollable on desktop, normal flow on mobile) */}
          <div className="flex flex-col md:max-h-[92vh] md:overflow-y-auto">
            {/* Top bar: badges + share button */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b bg-background p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${accentIconClass(
                    cat?.accent,
                  )}`}
                >
                  <LucideIcon name={iconName} className="size-3.5" />
                  {cat?.name}
                </span>
                <SeverityBadge severity={pattern.severity} />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="shrink-0 text-muted-foreground"
                onClick={() => toast({ title: t('shareToast'), description: t('shareToastDesc') })}
              >
                <Share2 className="size-4" />
                <span className="hidden sm:inline">{t('share')}</span>
              </Button>
            </div>

            <div className="flex flex-col gap-5 p-5">
              {/* Author + date */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <User className="size-3.5" />
                  {pattern.authorName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formatDate(pattern.createdAt)}
                </span>
              </div>

              {/* H1 title */}
              <h2 className="text-2xl font-bold leading-tight tracking-tight">
                {pattern.title}
              </h2>

              {/* Summary — lead paragraph */}
              <p className="text-base leading-relaxed text-muted-foreground">
                {pattern.summary}
              </p>

              <Separator />

              {/* Проблема */}
              <section className="flex flex-col gap-2">
                <SectionHeading
                  icon={<AlertTriangle className="size-4 text-red-500" />}
                  title={t('problem')}
                />
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm leading-relaxed text-foreground dark:bg-red-500/10">
                  {pattern.problemStatement}
                </div>
              </section>

              {/* Решение */}
              <section className="flex flex-col gap-2">
                <SectionHeading
                  icon={<Lightbulb className="size-4 text-emerald-500" />}
                  title={t('solution')}
                />
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-relaxed text-foreground dark:bg-emerald-500/10">
                  {pattern.solution}
                </div>
              </section>

              {/* Плюсы */}
              {pros.length > 0 ? (
                <section className="flex flex-col gap-2">
                  <SectionHeading
                    icon={<CircleCheck className="size-4 text-emerald-500" />}
                    title={t('pros')}
                  />
                  <ul className="flex flex-col gap-1.5">
                    {pros.map((p, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Минусы */}
              {cons.length > 0 ? (
                <section className="flex flex-col gap-2">
                  <SectionHeading
                    icon={<CircleX className="size-4 text-red-500" />}
                    title={t('cons')}
                  />
                  <ul className="flex flex-col gap-1.5">
                    {cons.map((c, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                      >
                        <X className="mt-0.5 size-4 shrink-0 text-red-500" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Когда использовать */}
              {useCases.length > 0 ? (
                <section className="flex flex-col gap-2">
                  <SectionHeading
                    icon={<Sparkles className="size-4 text-amber-500" />}
                    title={t('whenToUse')}
                  />
                  <ul className="flex flex-col gap-1.5">
                    {useCases.map((u, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm leading-relaxed"
                      >
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        <span>{u}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Гайдлайны */}
              <section className="flex flex-col gap-2">
                <SectionHeading
                  icon={<BookOpen className="size-4 text-teal-500" />}
                  title={t('guidelines')}
                />
                {detailLoading ? (
                  <div className="flex flex-col gap-2">
                    {[0, 1].map((i) => (
                      <div
                        key={i}
                        className="h-20 animate-pulse rounded-lg bg-muted"
                      />
                    ))}
                  </div>
                ) : guidelines.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t('noGuidelines')}
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {guidelines.map((g) => {
                      const meta =
                        GUIDELINE_SOURCE_META[g.source] ??
                        GUIDELINE_SOURCE_META.custom;
                      return (
                        <div
                          key={g.id}
                          className="rounded-lg border bg-card p-4"
                        >
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}
                            >
                              {meta.label}
                            </span>
                            <span className="text-sm font-semibold">
                              {g.title}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {g.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Tags */}
              {pattern.tags.length > 0 ? (
                <section className="flex flex-col gap-2">
                  <SectionHeading
                    icon={<Sparkles className="size-4 text-teal-500" />}
                    title={t('tags')}
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {pattern.tags.map((t) => (
                      <Badge
                        key={t.slug}
                        variant="secondary"
                        className="font-medium"
                      >
                        {t.name}
                      </Badge>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionHeading({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
      {icon}
      {title}
    </h3>
  );
}
