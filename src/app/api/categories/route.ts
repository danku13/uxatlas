import { NextResponse } from "next/server";
import { getCategoriesDTO, type Locale } from "@/lib/content";

// GET /api/categories?locale=ru|en
// Returns all categories ordered by `order`, each with the count of
// published + approved patterns. Reads directly from /content/ Markdown files.
// Locale param translates category names + descriptions.
export async function GET(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const localeParam = url.searchParams.get("locale") as Locale | null;
    const locale: Locale = localeParam === "en" ? "en" : "ru";
    return NextResponse.json(getCategoriesDTO(locale));
  } catch (err) {
    console.error("[GET /api/categories] failed:", err);
    return NextResponse.json(
      { error: "Failed to load categories" },
      { status: 500 },
    );
  }
}
