import { NextResponse } from "next/server";
import { getPatternBySlug, toPatternDetailDTO, type Locale } from "@/lib/content";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

// GET /api/patterns/[slug]?locale=ru|en
// Returns a single published + approved pattern by slug, including its
// category, tags, and guidelines. Reads from /content/ — no DB needed.
export async function GET(req: Request, ctx: RouteContext): Promise<Response> {
  try {
    const { slug } = await ctx.params;
    const url = new URL(req.url);
    const localeParam = url.searchParams.get("locale") as Locale | null;
    const locale: Locale = localeParam === "en" ? "en" : "ru";

    const pattern = getPatternBySlug(slug, locale);
    if (!pattern || !pattern.published || pattern.moderationStatus !== "approved") {
      return NextResponse.json(
        { error: "Pattern not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(toPatternDetailDTO(pattern, locale));
  } catch (err) {
    console.error("[GET /api/patterns/[slug]] failed:", err);
    return NextResponse.json(
      { error: "Failed to load pattern" },
      { status: 500 },
    );
  }
}
