/**
 * lib/content.ts — Content reader.
 *
 * Reads the canonical content directly from /content/ Markdown files.
 * This is the runtime source of truth — no database needed.
 *
 * Used by:
 *   - API routes (/api/categories, /api/tags, /api/patterns, /api/patterns/[slug])
 *   - Server components (HeroSection, CategoriesSection, PatternCatalogSection)
 *
 * The SQLite database (db/custom.db) is now only needed for pattern SUBMISSIONS
 * (POST /api/patterns) where we need to queue new patterns for moderation.
 * For reads, everything goes through this module.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', '..', 'content');
const PATTERNS_DIR = join(CONTENT_DIR, 'patterns');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  order: number;
};

export type Tag = { slug: string; name: string };

export type Severity = 'high' | 'medium' | 'low';
export type GuidelineSource = 'material' | 'hig' | 'nielsen' | 'custom';

export type Guideline = {
  title: string;
  body: string;
  source: GuidelineSource;
};

export type Pattern = {
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
  published: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  categorySlug: string;
  tagSlugs: string[];
  guidelines: Guideline[];
  /** ISO date string — uses file mtime for ordering */
  createdAt: string;
};

// ---------------------------------------------------------------------------
// Cache (modules are singletons in Next.js, so this caches per-process)
// ---------------------------------------------------------------------------

let _categoriesCache: Category[] | null = null;
let _tagsCache: Tag[] | null = null;
let _patternsCache: Pattern[] | null = null;

// ---------------------------------------------------------------------------
// Loaders
// ---------------------------------------------------------------------------

export function getCategories(): Category[] {
  if (_categoriesCache) return _categoriesCache;
  const raw = readFileSync(join(CONTENT_DIR, 'categories.json'), 'utf8');
  _categoriesCache = JSON.parse(raw) as Category[];
  return _categoriesCache;
}

export function getTags(): Tag[] {
  if (_tagsCache) return _tagsCache;
  const raw = readFileSync(join(CONTENT_DIR, 'tags.json'), 'utf8');
  _tagsCache = JSON.parse(raw) as Tag[];
  return _tagsCache;
}

/** Parse Markdown body into structured fields. */
function parsePatternBody(body: string): {
  summary: string;
  description: string;
  problemStatement: string;
  solution: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  guidelines: Guideline[];
} {
  const sections: { heading: string; content: string }[] = [];
  const lines = body.split('\n');
  let currentHeading = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      if (currentHeading || currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join('\n').trim(),
        });
      }
      currentHeading = headingMatch[1];
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }
  if (currentHeading || currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join('\n').trim(),
    });
  }

  // Summary: first blockquote line (before any ##)
  const preSection = sections.find((s) => !s.heading);
  let summary = '';
  if (preSection) {
    const bqMatch = preSection.content.match(/^>\s*(.+)$/m);
    summary = bqMatch ? bqMatch[1].trim() : preSection.content.split('\n')[0].trim();
  }

  const getSection = (name: string): string => {
    const s = sections.find((s) => s.heading.toLowerCase().includes(name.toLowerCase()));
    return s?.content ?? '';
  };

  const getList = (name: string): string[] => {
    const content = getSection(name);
    return content
      .split('\n')
      .map((l) => l.match(/^-\s+(.+)$/)?.[1]?.trim())
      .filter((s): s is string => Boolean(s));
  };

  // Guidelines: ### subsections under "Принципы и гайдлайны"
  const guidelinesSection = sections.find((s) =>
    s.heading.toLowerCase().includes('гайдлайн'),
  );
  const guidelines: Guideline[] = [];
  if (guidelinesSection) {
    const subLines = guidelinesSection.content.split('\n');
    let currentTitle = '';
    let currentBody: string[] = [];
    let currentSource = '';
    const flush = () => {
      if (currentTitle) {
        const bodyText = currentBody
          .join('\n')
          .replace(/\*\*Источник:\*\*\s*`?([^`]+)`?/i, (_m, src) => {
            currentSource = src.trim();
            return '';
          })
          .trim();
        guidelines.push({
          title: currentTitle,
          body: bodyText,
          source: (currentSource || 'custom') as GuidelineSource,
        });
      }
      currentTitle = '';
      currentBody = [];
      currentSource = '';
    };
    for (const line of subLines) {
      const subMatch = line.match(/^###\s+(.+)$/);
      if (subMatch) {
        flush();
        currentTitle = subMatch[1].trim();
      } else if (currentTitle) {
        currentBody.push(line);
      }
    }
    flush();
  }

  return {
    summary,
    description: getSection('описание'),
    problemStatement: getSection('проблем'),
    solution: getSection('решен'),
    pros: getList('плюс'),
    cons: getList('минус'),
    useCases: getList('использовать'),
    guidelines,
  };
}

export function getPatterns(): Pattern[] {
  if (_patternsCache) return _patternsCache;

  const files = readdirSync(PATTERNS_DIR).filter((f) => f.endsWith('.md'));
  const patterns: Pattern[] = [];

  for (const file of files) {
    const filePath = join(PATTERNS_DIR, file);
    const raw = readFileSync(filePath, 'utf8');
    const { data, content } = matter(raw);
    const body = parsePatternBody(content);

    patterns.push({
      slug: data.slug,
      title: data.title,
      summary: body.summary,
      description: body.description,
      problemStatement: body.problemStatement,
      solution: body.solution,
      pros: body.pros,
      cons: body.cons,
      useCases: body.useCases,
      mockupType: data.mockupType,
      mockupConfig: (data.mockupConfig ?? {}) as Record<string, unknown>,
      platforms: data.platforms ?? [],
      severity: (data.severity ?? 'medium') as Severity,
      authorName: data.author ?? 'Community',
      published: data.published ?? true,
      moderationStatus: (data.moderationStatus ?? 'approved') as
        | 'pending'
        | 'approved'
        | 'rejected',
      categorySlug: data.category,
      tagSlugs: data.tags ?? [],
      guidelines: body.guidelines,
      // Use file slug as deterministic "createdAt" — patterns sort by slug
      // (override: we keep insertion order from readdir; sort in consumers)
      createdAt: data.createdAt ?? '2025-01-01T00:00:00.000Z',
    });
  }

  _patternsCache = patterns;
  return patterns;
}

export function getPatternBySlug(slug: string): Pattern | null {
  return getPatterns().find((p) => p.slug === slug) ?? null;
}

export function getPatternsByCategory(categorySlug: string): Pattern[] {
  return getPatterns().filter((p) => p.categorySlug === categorySlug);
}

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

export function getCategoriesDTO(): CategoryDTO[] {
  const cats = getCategories();
  const patterns = getPatterns();
  return cats
    .map((c) => ({
      id: slugId(c.slug, 'cat'),
      slug: c.slug,
      name: c.name,
      description: c.description || null,
      icon: c.icon || null,
      accent: c.accent || null,
      order: c.order,
      patternCount: patterns.filter((p) => p.categorySlug === c.slug && p.published && p.moderationStatus === 'approved').length,
    }))
    .sort((a, b) => a.order - b.order);
}

export function getTagsDTO(): TagDTO[] {
  const tags = getTags();
  const patterns = getPatterns();
  return tags
    .map((t) => ({
      id: slugId(t.slug, 'tag'),
      slug: t.slug,
      name: t.name,
      patternCount: patterns.filter(
        (p) => p.published && p.moderationStatus === 'approved' && p.tagSlugs.includes(t.slug),
      ).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function toPatternDTO(p: Pattern): PatternDTO {
  const cats = getCategories();
  const tags = getTags();
  const cat = cats.find((c) => c.slug === p.categorySlug);
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
      .map((slug) => tags.find((t) => t.slug === slug))
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
