// Shared DTO types and helpers for the Mobile UX Patterns Portal API.
// SQLite stores arrays/objects as JSON-encoded strings, so we centralize
// parsing/serialization here to keep route handlers tidy and typed.

import type { Prisma } from "@prisma/client";

// ---------------------------------------------------------------------------
// DTO shapes (what the API returns to the client)
// ---------------------------------------------------------------------------

export type Severity = "high" | "medium" | "low";
export type ModerationStatus = "pending" | "approved" | "rejected";
export type GuidelineSource = "material" | "hig" | "nielsen" | "custom";

export interface CategoryDTO {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  accent: string | null;
  order: number;
  patternCount: number;
}

export interface TagDTO {
  id: string;
  slug: string;
  name: string;
  patternCount: number;
}

export interface PatternCategoryRefDTO {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  accent: string | null;
}

export interface PatternTagRefDTO {
  id: string;
  slug: string;
  name: string;
}

export interface GuidelineDTO {
  id: string;
  title: string;
  body: string;
  source: GuidelineSource;
  createdAt: string;
}

export interface PatternDTO {
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
  category: PatternCategoryRefDTO;
  tags: PatternTagRefDTO[];
}

export interface PatternDetailDTO extends PatternDTO {
  guidelines: GuidelineDTO[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// JSON helpers — SQLite stores arrays/objects as JSON-encoded strings.
// ---------------------------------------------------------------------------

export function parseJsonArray(raw: unknown): string[] {
  if (typeof raw !== "string" || raw.trim().length === 0) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function parseJsonObject(raw: unknown): Record<string, unknown> {
  if (typeof raw !== "string" || raw.trim().length === 0) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

// ---------------------------------------------------------------------------
// Pattern → DTO transformer
// ---------------------------------------------------------------------------

type PatternWithRelations = Prisma.PatternGetPayload<{
  include: {
    category: true;
    tags: { include: { tag: true } };
    guidelines?: true;
  };
}>;

export function toPatternDTO(p: PatternWithRelations): PatternDTO {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    description: p.description,
    problemStatement: p.problemStatement,
    solution: p.solution,
    pros: parseJsonArray(p.pros),
    cons: parseJsonArray(p.cons),
    useCases: parseJsonArray(p.useCases),
    mockupType: p.mockupType,
    mockupConfig: parseJsonObject(p.mockupConfig),
    platforms: parseJsonArray(p.platforms),
    severity: p.severity as Severity,
    authorName: p.authorName,
    createdAt: p.createdAt.toISOString(),
    category: {
      id: p.category.id,
      slug: p.category.slug,
      name: p.category.name,
      icon: p.category.icon,
      accent: p.category.accent,
    },
    tags: p.tags
      .map((pt) => pt.tag)
      .map((t) => ({ id: t.id, slug: t.slug, name: t.name })),
  };
}

export function toPatternDetailDTO(
  p: PatternWithRelations & { guidelines: NonNullable<PatternWithRelations["guidelines"]> },
): PatternDetailDTO {
  const base = toPatternDTO(p);
  return {
    ...base,
    guidelines: p.guidelines
      .slice()
      .sort(guidelineSorter)
      .map((g) => ({
        id: g.id,
        title: g.title,
        body: g.body,
        source: g.source as GuidelineSource,
        createdAt: g.createdAt.toISOString(),
      })),
  };
}

// Material → HIG → Nielsen → custom, then by createdAt asc as tiebreaker.
const SOURCE_ORDER: Record<string, number> = {
  material: 0,
  hig: 1,
  nielsen: 2,
  custom: 3,
};

function guidelineSorter(
  a: { source: string; createdAt: Date },
  b: { source: string; createdAt: Date },
): number {
  const sa = SOURCE_ORDER[a.source] ?? 99;
  const sb = SOURCE_ORDER[b.source] ?? 99;
  if (sa !== sb) return sa - sb;
  return a.createdAt.getTime() - b.createdAt.getTime();
}

// ---------------------------------------------------------------------------
// Slug generation — lowercase, hyphen-separated, ASCII-friendly.
// ---------------------------------------------------------------------------

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // strip non-alphanumerics (keep spaces & hyphens)
      .replace(/\s+/g, "-") // spaces -> hyphens
      .replace(/-+/g, "-") // collapse repeated hyphens
      .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
      .slice(0, 80) // cap length
  );
}

/**
 * Generate a unique slug given a base title. Appends `-2`, `-3`, ... if needed.
 */
export async function ensureUniqueSlug(
  baseTitle: string,
  isTaken: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(baseTitle) || "pattern";
  if (!(await isTaken(base))) return base;
  let n = 2;
  while (await isTaken(`${base}-${n}`)) {
    n += 1;
    if (n > 1000) break; // hard safety cap
  }
  return `${base}-${n}`;
}

// ---------------------------------------------------------------------------
// Severity ordering — used for the `severity` sort option.
// ---------------------------------------------------------------------------

export const SEVERITY_RANK: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};
