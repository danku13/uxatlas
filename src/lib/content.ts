/**
 * lib/content.ts — Content reader with locale support.
 *
 * Reads from the auto-generated `content-data.generated.ts` module (which is
 * bundled into the serverless deployment — no `node:fs` calls at runtime).
 *
 * All functions accept an optional `locale` parameter ('ru' | 'en').
 * When locale='en', pattern titles/summaries and category names/descriptions
 * are replaced with English translations (from content/translations/*.en.json).
 * Falls back to Russian (original) if translation is missing.
 *
 * To regenerate the data after editing /content/ Markdown files:
 *   bun run content:generate
 */
import {
  CATEGORIES,
  TAGS,
  PATTERNS,
  CATEGORIES_EN,
  PATTERNS_EN,
} from './content-data.generated';
import type {
  Category,
  Tag,
  Pattern,
  Severity,
  GuidelineSource,
  Guideline,
} from './content-types';

// Re-export types so consumers can import them from '@/lib/content'
export type { Category, Tag, Pattern, Severity, GuidelineSource, Guideline };
export type Locale = 'ru' | 'en';

// ---------------------------------------------------------------------------
// DTOs (matching the old Prisma-based API contract — kept for compatibility)
// ---------------------------------------------------------------------------

export type CategoryDTO = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  accent: string | null;
  order: number;
  patternCount: number;
};

export type TagDTO = {
  id: string;
  slug: string;
  name: string;
  patternCount: number;
};

export type PatternDTO = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  problemStatement: string;
  solution: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  mockupType: string;
  mockupConfig: Record<string, unknown>;
  platforms: string[];
  severity: Severity;
  authorName: string;
  createdAt: string;
  category: { id: string; slug: string; name: string; icon: string | null; accent: string | null };
  tags: { id: string; slug: string; name: string }[];
};

export type PatternDetailDTO = PatternDTO & {
  guidelines: { id: string; title: string; body: string; source: GuidelineSource; createdAt: string }[];
};

// Stable ID generator (deterministic per slug — same content = same ID)
function slugId(slug: string, prefix = 'cnt'): string {
  return `${prefix}_${slug.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
}

// ---------------------------------------------------------------------------
// Translation helpers
// ---------------------------------------------------------------------------

/** Get localized category name (fallback to Russian if EN missing). */
function localizedCategoryName(c: Category, locale: Locale): string {
  if (locale === 'en') {
    return CATEGORIES_EN[c.slug]?.name ?? c.name;
  }
  return c.name;
}

/** Get localized category description (fallback to Russian if EN missing). */
function localizedCategoryDescription(c: Category, locale: Locale): string {
  if (locale === 'en') {
    return CATEGORIES_EN[c.slug]?.description ?? c.description;
  }
  return c.description;
}

/** Get localized pattern (title + summary translated if EN). */
function localizedPattern(p: Pattern, locale: Locale): Pattern {
  if (locale === 'en') {
    const en = PATTERNS_EN.find((e) => e.slug === p.slug);
    if (en) {
      return { ...p, title: en.title, summary: en.summary };
    }
  }
  return p;
}

// ---------------------------------------------------------------------------
// Readers (use the pre-generated data — no fs at runtime)
// ---------------------------------------------------------------------------

export function getCategories(locale: Locale = 'ru'): Category[] {
  if (locale === 'en') {
    return CATEGORIES.map((c) => ({
      ...c,
      name: CATEGORIES_EN[c.slug]?.name ?? c.name,
      description: CATEGORIES_EN[c.slug]?.description ?? c.description,
    }));
  }
  return CATEGORIES;
}

export function getTags(): Tag[] {
  return TAGS;
}

export function getPatterns(locale: Locale = 'ru'): Pattern[] {
  if (locale === 'en') {
    return PATTERNS.map((p) => {
      const en = PATTERNS_EN.find((e) => e.slug === p.slug);
      return en ? { ...p, title: en.title, summary: en.summary } : p;
    });
  }
  return PATTERNS;
}

export function getPatternBySlug(slug: string, locale: Locale = 'ru'): Pattern | null {
  const p = PATTERNS.find((p) => p.slug === slug);
  if (!p) return null;
  return localizedPattern(p, locale);
}

export function getPatternsByCategory(categorySlug: string, locale: Locale = 'ru'): Pattern[] {
  return getPatterns(locale).filter((p) => p.categorySlug === categorySlug);
}

// ---------------------------------------------------------------------------
// DTO builders
// ---------------------------------------------------------------------------

export function getCategoriesDTO(locale: Locale = 'ru'): CategoryDTO[] {
  return CATEGORIES.map((c) => ({
    id: slugId(c.slug, 'cat'),
    slug: c.slug,
    name: localizedCategoryName(c, locale),
    description: localizedCategoryDescription(c, locale) || null,
    icon: c.icon || null,
    accent: c.accent || null,
    order: c.order,
    patternCount: PATTERNS.filter(
      (p) =>
        p.categorySlug === c.slug &&
        p.published &&
        p.moderationStatus === 'approved',
    ).length,
  })).sort((a, b) => a.order - b.order);
}

export function getTagsDTO(): TagDTO[] {
  return TAGS.map((t) => ({
    id: slugId(t.slug, 'tag'),
    slug: t.slug,
    name: t.name,
    patternCount: PATTERNS.filter(
      (p) =>
        p.published &&
        p.moderationStatus === 'approved' &&
        p.tagSlugs.includes(t.slug),
    ).length,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export function toPatternDTO(p: Pattern, locale: Locale = 'ru'): PatternDTO {
  const cat = CATEGORIES.find((c) => c.slug === p.categorySlug);
  const localized = localizedPattern(p, locale);
  return {
    id: slugId(p.slug, 'pat'),
    slug: p.slug,
    title: localized.title,
    summary: localized.summary,
    description: p.description,
    problemStatement: p.problemStatement,
    solution: p.solution,
    pros: p.pros,
    cons: p.cons,
    useCases: p.useCases,
    mockupType: p.mockupType,
    mockupConfig: p.mockupConfig,
    platforms: p.platforms,
    severity: p.severity,
    authorName: p.authorName,
    createdAt: p.createdAt,
    category: {
      id: cat ? slugId(cat.slug, 'cat') : '',
      slug: p.categorySlug,
      name: cat ? localizedCategoryName(cat, locale) : p.categorySlug,
      icon: cat?.icon ? cat.icon : null,
      accent: cat?.accent ? cat.accent : null,
    },
    tags: p.tagSlugs
      .map((slug) => TAGS.find((t) => t.slug === slug))
      .filter((t): t is Tag => Boolean(t))
      .map((t) => ({ id: slugId(t.slug, 'tag'), slug: t.slug, name: t.name })),
  };
}

export function toPatternDetailDTO(p: Pattern, locale: Locale = 'ru'): PatternDetailDTO {
  return {
    ...toPatternDTO(p, locale),
    guidelines: p.guidelines.map((g, i) => ({
      id: slugId(`${p.slug}-${i}`, 'guide'),
      title: g.title,
      body: g.body,
      source: g.source,
      createdAt: p.createdAt,
    })),
  };
}
