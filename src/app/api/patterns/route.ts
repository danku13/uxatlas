import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getPatterns,
  toPatternDTO,
  type Locale,
  type Severity,
} from "@/lib/content";
import { sendTelegramNotification, checkRateLimit, getClientIp } from "@/lib/telegram";
import type { Paginated, PatternDTO } from "@/lib/types";

// ---------------------------------------------------------------------------
// GET /api/patterns?locale=ru|en — list with filter / search / pagination / sort
// Reads from /content/ Markdown files. No database needed — works on Vercel.
// ---------------------------------------------------------------------------

const SEVERITIES = ["high", "medium", "low"] as const;
const PLATFORMS = ["ios", "android"] as const;
const SORTS = ["newest", "severity"] as const;

const SEVERITY_RANK: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

type ListQuery = {
  q?: string;
  categorySlug?: string;
  severity?: string[];
  platform?: (typeof PLATFORMS)[number];
  tag?: string;
  page: number;
  pageSize: number;
  sort: (typeof SORTS)[number];
  locale: Locale;
};

function parseListQuery(url: URL): ListQuery {
  const sp = url.searchParams;
  const pageRaw = Number(sp.get("page") ?? "1");
  const pageSizeRaw = Number(sp.get("pageSize") ?? "12");
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const pageSize =
    Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
      ? Math.min(Math.floor(pageSizeRaw), 50)
      : 12;

  const severityRaw = sp.get("severity");
  const severity = severityRaw
    ? severityRaw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter((s): s is (typeof SEVERITIES)[number] =>
          (SEVERITIES as readonly string[]).includes(s),
        )
    : undefined;

  const platformRaw = sp.get("platform")?.toLowerCase();
  const platform = platformRaw
    ? (PLATFORMS as readonly string[]).includes(platformRaw)
      ? (platformRaw as (typeof PLATFORMS)[number])
      : undefined
    : undefined;

  const sortRaw = sp.get("sort")?.toLowerCase();
  const sort =
    sortRaw && (SORTS as readonly string[]).includes(sortRaw)
      ? (sortRaw as (typeof SORTS)[number])
      : "newest";

  const localeParam = sp.get("locale");
  const locale: Locale = localeParam === "en" ? "en" : "ru";

  return {
    q: sp.get("q")?.trim() || undefined,
    categorySlug: sp.get("categorySlug")?.trim() || undefined,
    severity: severity && severity.length > 0 ? severity : undefined,
    platform,
    tag: sp.get("tag")?.trim() || undefined,
    page,
    pageSize,
    sort,
    locale,
  };
}

function matchesFilters(p: ReturnType<typeof getPatterns>[number], q: ListQuery): boolean {
  if (!p.published || p.moderationStatus !== "approved") return false;
  if (q.categorySlug && p.categorySlug !== q.categorySlug) return false;
  if (q.severity && !q.severity.includes(p.severity)) return false;
  if (q.platform && !p.platforms.includes(q.platform)) return false;
  if (q.tag && !p.tagSlugs.includes(q.tag)) return false;
  if (q.q) {
    const needle = q.q.toLowerCase();
    const haystack = [p.title, p.summary, p.description, p.problemStatement]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

export async function GET(req: Request): Promise<Response> {
  try {
    const q = parseListQuery(new URL(req.url));
    const all = getPatterns(q.locale);

    const filtered = all.filter((p) => matchesFilters(p, q));
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / q.pageSize));

    const sorted = [...filtered].sort((a, b) => {
      if (q.sort === "severity") {
        const sa = SEVERITY_RANK[a.severity] ?? 99;
        const sb = SEVERITY_RANK[b.severity] ?? 99;
        if (sa !== sb) return sa - sb;
      }
      return a.slug.localeCompare(b.slug);
    });

    const start = (q.page - 1) * q.pageSize;
    const slice = sorted.slice(start, start + q.pageSize);
    const items: PatternDTO[] = slice.map((p) => toPatternDTO(p, q.locale));

    const body: Paginated<PatternDTO> = {
      items,
      total,
      page: q.page,
      pageSize: q.pageSize,
      totalPages,
    };
    return NextResponse.json(body);
  } catch (err) {
    console.error("[GET /api/patterns] failed:", err);
    return NextResponse.json(
      { error: "Failed to load patterns" },
      { status: 500 },
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/patterns — public submission (pending moderation)
// On Vercel/serverless without DB, sends Telegram notification instead.
// ---------------------------------------------------------------------------

const guidelineInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(5).max(2000),
  source: z.enum(["material", "hig", "nielsen", "custom"]),
});

const createPatternSchema = z.object({
  // Honeypot field — bots fill this in, humans don't (it's visually hidden).
  website: z.string().optional(),
  title: z.string().trim().min(3).max(100),
  summary: z.string().trim().min(10).max(200),
  description: z.string().trim().min(20).max(2000),
  problemStatement: z.string().trim().min(10).max(500),
  solution: z.string().trim().min(10).max(1000),
  categorySlug: z.string().trim().min(1),
  mockupType: z.string().trim().min(1).max(80),
  mockupConfig: z.record(z.string(), z.unknown()),
  platforms: z
    .array(z.string())
    .min(1, "At least one platform is required")
    .refine(
      (arr) => arr.some((p) => p === "ios" || p === "android"),
      "platforms must contain at least one of 'ios' or 'android'",
    ),
  severity: z.enum(["high", "medium", "low"]).default("medium"),
  authorName: z.string().trim().min(1).max(60).default("Community"),
  pros: z.array(z.string()).optional().default([]),
  cons: z.array(z.string()).optional().default([]),
  useCases: z.array(z.string()).optional().default([]),
  tagSlugs: z.array(z.string()).optional().default([]),
  guidelines: z.array(guidelineInputSchema).optional().default([]),
});

type CreatePatternInput = z.infer<typeof createPatternSchema>;

export async function POST(req: Request): Promise<Response> {
  let parsed: CreatePatternInput;
  try {
    const json = (await req.json()) as unknown;
    parsed = createPatternSchema.parse(json);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: err.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  try {
    // ── Honeypot check ──
    if (parsed.website && parsed.website.trim().length > 0) {
      return NextResponse.json(
        { id: "spam_honeypot", slug: "spam", title: parsed.title },
        { status: 201 },
      );
    }

    // ── Rate limit check ──
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions from your IP. Please try again in 10 minutes." },
        { status: 429 },
      );
    }

    // ── Validate category ──
    const { getCategories } = await import("@/lib/content");
    const categories = getCategories();
    const category = categories.find((c) => c.slug === parsed.categorySlug);
    if (!category) {
      return NextResponse.json(
        { error: "Validation failed", details: [{ path: "categorySlug", message: `Category '${parsed.categorySlug}' does not exist` }] },
        { status: 400 },
      );
    }

    // ── Validate tag slugs ──
    const { getTags } = await import("@/lib/content");
    const tags = getTags();
    const unknownTags = (parsed.tagSlugs ?? []).filter((slug) => !tags.some((t) => t.slug === slug));
    if (unknownTags.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: [{ path: "tagSlugs", message: `Unknown tag slug(s): ${unknownTags.join(", ")}` }] },
        { status: 400 },
      );
    }

    // ── Send Telegram notification ──
    const telegramResult = await sendTelegramNotification({
      title: parsed.title,
      summary: parsed.summary,
      category: category.name,
      severity: parsed.severity,
      author: parsed.authorName,
      problemStatement: parsed.problemStatement,
      solution: parsed.solution,
      description: parsed.description,
      platforms: parsed.platforms,
      pros: parsed.pros,
      cons: parsed.cons,
      useCases: parsed.useCases,
      tags: parsed.tagSlugs,
      guidelines: parsed.guidelines,
    });

    if (!telegramResult.success) {
      console.warn("[POST /api/patterns] Telegram notification not sent:", telegramResult.error);
    }

    return NextResponse.json(
      {
        id: `submission_${Date.now()}`,
        slug: parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        title: parsed.title,
        summary: parsed.summary,
        description: parsed.description,
        problemStatement: parsed.problemStatement,
        solution: parsed.solution,
        pros: parsed.pros ?? [],
        cons: parsed.cons ?? [],
        useCases: parsed.useCases ?? [],
        mockupType: parsed.mockupType,
        mockupConfig: parsed.mockupConfig,
        platforms: parsed.platforms,
        severity: parsed.severity,
        authorName: parsed.authorName,
        createdAt: new Date().toISOString(),
        category: { id: `cat_${category.slug}`, slug: category.slug, name: category.name, icon: category.icon, accent: category.accent },
        tags: (parsed.tagSlugs ?? []).map((slug) => {
          const t = tags.find((x) => x.slug === slug);
          return { id: `tag_${slug}`, slug, name: t?.name ?? slug };
        }),
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("[POST /api/patterns] failed:", err);
    return NextResponse.json({ error: "Failed to create pattern" }, { status: 500 });
  }
}
