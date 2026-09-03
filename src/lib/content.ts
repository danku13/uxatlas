/**
 * lib/content.ts — Content reader.
 *
 * Reads from the auto-generated `content-data.generated.ts` module (which is
 * bundled into the serverless deployment — no `node:fs` calls at runtime).
 *
 * To regenerate the data after editing /content/ Markdown files:
 *   bun run content:generate
 *
 * Used by:
 *   - API routes (/api/categories, /api/tags, /api/patterns, /api/patterns/[slug])
 *   - Server components (HeroSection, CategoriesSection, PatternCatalogSection)
 */
import {
  CATEGORIES,
  TAGS,
  PATTERNS,
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
// Readers (use the pre-generated data — no fs.readFileSync at runtime)
// ---------------------------------------------------------------------------

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getTags(): Tag[] {
  return TAGS;
}

export function getPatterns(): Pattern[] {
  return PATTERNS;
}

export function getPatternBySlug(slug: string): Pattern | null {
  return PATTERNS.find((p) => p.slug === slug) ?? null;
}

export function getPatternsByCategory(categorySlug: string): Pattern[] {
  return PATTERNS.filter((p) => p.categorySlug === categorySlug);
}

// ---------------------------------------------------------------------------
// DTO builders
// ---------------------------------------------------------------------------

export function getCategoriesDTO(): CategoryDTO[] {
  return CATEGORIES.map((c) => ({
    id: slugId(c.slug, 'cat'),
    slug: c.slug,
    name: c.name,
    description: c.description || null,
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

export function toPatternDTO(p: Pattern): PatternDTO {
  const cat = CATEGORIES.find((c) => c.slug === p.categorySlug);
  return {
    id: slugId(p.slug, 'pat'),
    slug: p.slug,
    title: p.title,
    summary: p.summary,
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
      name: cat?.name ?? p.categorySlug,
      icon: cat?.icon ? cat.icon : null,
      accent: cat?.accent ? cat.accent : null,
    },
    tags: p.tagSlugs
      .map((slug) => TAGS.find((t) => t.slug === slug))
      .filter((t): t is Tag => Boolean(t))
      .map((t) => ({ id: slugId(t.slug, 'tag'), slug: t.slug, name: t.name })),
  };
}

export function toPatternDetailDTO(p: Pattern): PatternDetailDTO {
  return {
    ...toPatternDTO(p),
    guidelines: p.guidelines.map((g, i) => ({
      id: slugId(`${p.slug}-${i}`, 'guide'),
      title: g.title,
      body: g.body,
      source: g.source,
      createdAt: p.createdAt,
    })),
  };
}
