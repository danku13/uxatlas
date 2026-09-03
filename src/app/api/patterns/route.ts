import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  type Paginated,
  type PatternDTO,
  type Severity,
  type GuidelineSource,
  SEVERITY_RANK,
  ensureUniqueSlug,
  toPatternDTO,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// GET /api/patterns — list with filter / search / pagination / sort
// ---------------------------------------------------------------------------

const SEVERITIES = ["high", "medium", "low"] as const;
const PLATFORMS = ["ios", "android"] as const;
const SORTS = ["newest", "severity"] as const;

type ListQuery = {
  q?: string;
  categoryId?: string;
  categorySlug?: string;
  severity?: string[];
  platform?: (typeof PLATFORMS)[number];
  tag?: string;
  page: number;
  pageSize: number;
  sort: (typeof SORTS)[number];
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
  const sort = sortRaw && (SORTS as readonly string[]).includes(sortRaw)
    ? (sortRaw as (typeof SORTS)[number])
    : "newest";

  return {
    q: sp.get("q")?.trim() || undefined,
    categoryId: sp.get("categoryId")?.trim() || undefined,
    categorySlug: sp.get("categorySlug")?.trim() || undefined,
    severity: severity && severity.length > 0 ? severity : undefined,
    platform,
    tag: sp.get("tag")?.trim() || undefined,
    page,
    pageSize,
    sort,
  };
}

export async function GET(req: Request): Promise<Response> {
  try {
    const q = parseListQuery(new URL(req.url));

    // Resolve categorySlug → categoryId so we can filter by id directly.
    let categoryIdFilter: string | undefined = q.categoryId;
    if (!categoryIdFilter && q.categorySlug) {
      const cat = await db.category.findUnique({
        where: { slug: q.categorySlug },
        select: { id: true },
      });
      if (!cat) {
        return NextResponse.json(
          {
            items: [],
            total: 0,
            page: q.page,
            pageSize: q.pageSize,
            totalPages: 0,
          },
          { status: 200 },
        );
      }
      categoryIdFilter = cat.id;
    }

    // Resolve tag slug → tag id for the relation filter.
    let tagIdFilter: string | undefined;
    if (q.tag) {
      const tag = await db.tag.findUnique({
        where: { slug: q.tag },
        select: { id: true },
      });
      if (!tag) {
        return NextResponse.json(
          {
            items: [],
            total: 0,
            page: q.page,
            pageSize: q.pageSize,
            totalPages: 0,
          },
          { status: 200 },
        );
      }
      tagIdFilter = tag.id;
    }

    const where = {
      published: true,
      moderationStatus: "approved" as const,
      ...(categoryIdFilter ? { categoryId: categoryIdFilter } : {}),
      ...(q.severity ? { severity: { in: q.severity } } : {}),
      ...(q.platform
        ? // SQLite stores platforms as a JSON-encoded string like '["ios","android"]'.
          // A substring search for '"ios"' / '"android"' matches safely.
          { platforms: { contains: `"${q.platform}"` } }
        : {}),
      ...(q.q
        ? {
            OR: [
              { title: { contains: q.q } },
              { summary: { contains: q.q } },
              { description: { contains: q.q } },
              { problemStatement: { contains: q.q } },
            ],
          }
        : {}),
      ...(tagIdFilter
        ? { tags: { some: { tagId: tagIdFilter } } }
        : {}),
    };

    const total = await db.pattern.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / q.pageSize));

    let items: PatternDTO[];

    if (q.sort === "severity") {
      // Fetch everything that matches (catalog is small), sort in JS by
      // severity rank (high → medium → low), then by createdAt desc as a
      // stable tiebreaker, then paginate the slice.
      const all = await db.pattern.findMany({
        where,
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      const sorted = all.sort((a, b) => {
        const sa = SEVERITY_RANK[a.severity] ?? 99;
        const sb = SEVERITY_RANK[b.severity] ?? 99;
        if (sa !== sb) return sa - sb;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
      const start = (q.page - 1) * q.pageSize;
      const slice = sorted.slice(start, start + q.pageSize);
      items = slice.map(toPatternDTO);
    } else {
      const rows = await db.pattern.findMany({
        where,
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      });
      items = rows.map(toPatternDTO);
    }

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
// ---------------------------------------------------------------------------

const guidelineInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(5).max(2000),
  source: z.enum(["material", "hig", "nielsen", "custom"]),
});

const createPatternSchema = z.object({
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
    // Resolve category by slug — must exist.
    const category = await db.category.findUnique({
      where: { slug: parsed.categorySlug },
      select: { id: true },
    });
    if (!category) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: [
            {
              path: "categorySlug",
              message: `Category '${parsed.categorySlug}' does not exist`,
            },
          ],
        },
        { status: 400 },
      );
    }

    // Resolve any provided tag slugs — all must exist.
    const tagSlugs = parsed.tagSlugs ?? [];
    const tags: { id: string }[] =
      tagSlugs.length > 0
        ? await db.tag.findMany({
            where: { slug: { in: tagSlugs } },
            select: { id: true },
          })
        : [];
    if (tagSlugs.length > 0 && tags.length !== tagSlugs.length) {
      const foundSlugs = await db.tag.findMany({
        where: { slug: { in: tagSlugs } },
        select: { slug: true },
      });
      const foundSet = new Set(foundSlugs.map((t) => t.slug));
      const missing = tagSlugs.filter((s) => !foundSet.has(s));
      return NextResponse.json(
        {
          error: "Validation failed",
          details: [
            {
              path: "tagSlugs",
              message: `Unknown tag slug(s): ${missing.join(", ")}`,
            },
          ],
        },
        { status: 400 },
      );
    }

    // Generate a unique slug from the title.
    const slug = await ensureUniqueSlug(parsed.title, async (candidate) => {
      const existing = await db.pattern.findUnique({
        where: { slug: candidate },
        select: { id: true },
      });
      return Boolean(existing);
    });

    const created = await db.$transaction(async (tx) => {
      const pattern = await tx.pattern.create({
        data: {
          slug,
          title: parsed.title,
          summary: parsed.summary,
          description: parsed.description,
          problemStatement: parsed.problemStatement,
          solution: parsed.solution,
          pros: JSON.stringify(parsed.pros ?? []),
          cons: JSON.stringify(parsed.cons ?? []),
          useCases: JSON.stringify(parsed.useCases ?? []),
          mockupType: parsed.mockupType,
          mockupConfig: JSON.stringify(parsed.mockupConfig ?? {}),
          platforms: JSON.stringify(parsed.platforms),
          severity: parsed.severity as Severity,
          authorName: parsed.authorName,
          // New community submissions start pending + unpublished.
          published: false,
          moderationStatus: "pending",
          categoryId: category.id,
          tags: tags.length
            ? {
                create: tags.map((t) => ({ tagId: t.id })),
              }
            : undefined,
          guidelines: parsed.guidelines?.length
            ? {
                create: parsed.guidelines.map((g) => ({
                  title: g.title,
                  body: g.body,
                  source: g.source as GuidelineSource,
                })),
              }
            : undefined,
        },
        include: {
          category: true,
          tags: { include: { tag: true } },
          guidelines: true,
        },
      });
      return pattern;
    });

    // Return the full DTO of the created pattern (201 Created).
    const dto = toPatternDTO(created);
    return NextResponse.json(dto, { status: 201 });
  } catch (err) {
    console.error("[POST /api/patterns] failed:", err);
    return NextResponse.json(
      { error: "Failed to create pattern" },
      { status: 500 },
    );
  }
}
