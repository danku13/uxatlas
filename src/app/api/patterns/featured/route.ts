import { NextResponse } from "next/server";
import { getPatterns, toPatternDTO, type Severity } from "@/lib/content";
import type { PatternDTO } from "@/lib/types";

// GET /api/patterns/featured
// Returns up to 6 high-severity patterns for the homepage hero.
// Reads from /content/ — no DB needed.
export const dynamic = "force-static";

const SEVERITY_RANK: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export async function GET(): Promise<Response> {
  try {
    const all = getPatterns().filter(
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

    const items: PatternDTO[] = sorted.slice(0, 6).map(toPatternDTO);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[GET /api/patterns/featured] failed:", err);
    return NextResponse.json(
      { error: "Failed to load featured patterns" },
      { status: 500 },
    );
  }
}
