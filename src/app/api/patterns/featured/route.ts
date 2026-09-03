import { NextResponse } from "next/server";
import { getPatterns, toPatternDTO, type Locale, type Severity } from "@/lib/content";
import type { PatternDTO } from "@/lib/types";

// GET /api/patterns/featured?locale=ru|en
// Returns up to 6 high-severity patterns for the homepage hero.
export async function GET(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const localeParam = url.searchParams.get("locale") as Locale | null;
    const locale: Locale = localeParam === "en" ? "en" : "ru";

    const SEVERITY_RANK: Record<Severity, number> = {
      high: 0,
      medium: 1,
      low: 2,
    };

    const all = getPatterns(locale).filter(
      (p) =>
        p.published &&
        p.moderationStatus === "approved" &&
        (p.severity === "high" || p.severity === "medium"),
    );

    const sorted = [...all].sort((a, b) => {
      const sa = SEVERITY_RANK[a.severity] ?? 99;
      const sb = SEVERITY_RANK[b.severity] ?? 99;
      if (sa !== sb) return sa - sb;
      return a.slug.localeCompare(b.slug);
    });

    const items: PatternDTO[] = sorted.slice(0, 6).map((p) => toPatternDTO(p, locale));
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[GET /api/patterns/featured] failed:", err);
    return NextResponse.json(
      { error: "Failed to load featured patterns" },
      { status: 500 },
    );
  }
}
