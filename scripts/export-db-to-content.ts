/**
 * Export database content to Markdown files for version control.
 *
 * Reads all categories, tags, patterns, and guidelines from the database
 * and writes them to /content/ as:
 *   - content/categories.json
 *   - content/tags.json
 *   - content/patterns/{slug}.md (one Markdown file per pattern with YAML frontmatter)
 *
 * Run with: bun scripts/export-db-to-content.ts
 *
 * After running, this script makes `prisma/seed.ts` the *consumer* of
 * `content/` rather than the source of truth. The Markdown files become
 * the canonical, human-editable, Git-versioned representation.
 */
import { db } from '../src/lib/db';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');
const PATTERNS_DIR = join(CONTENT_DIR, 'patterns');

interface PatternRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  problemStatement: string;
  solution: string;
  pros: string; // JSON string
  cons: string; // JSON string
  useCases: string; // JSON string
  mockupType: string;
  mockupConfig: string; // JSON string
  platforms: string; // JSON string
  severity: string;
  authorName: string;
  published: boolean;
  moderationStatus: string;
  categoryId: string;
  createdAt: Date;
}

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  accent: string | null;
  order: number;
}

interface TagRow {
  id: string;
  slug: string;
  name: string;
}

interface PatternTagRow {
  patternId: string;
  tagId: string;
}

interface GuidelineRow {
  id: string;
  title: string;
  body: string;
  source: string;
  patternId: string;
  createdAt: Date;
}

function safeParseArray<T>(raw: string | null | undefined, fallback: T[] = []): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeParseObject<T>(raw: string | null | undefined, fallback: T = {} as T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** YAML-safe string escaping (quotes only when needed). */
function yamlString(value: string): string {
  if (value === '') return '""';
  // Quote if contains special chars: : # { } [ ] , & * ? | > ' " ! %
  if (/[:#{}[\],&*?|>'"!%@\n]/.test(value) || value.startsWith(' ') || value.endsWith(' ')) {
    return JSON.stringify(value);
  }
  return value;
}

/** Generate Markdown body for a pattern. */
function patternToMarkdown(p: PatternRow, guidelines: GuidelineRow[]): string {
  const pros = safeParseArray<string>(p.pros);
  const cons = safeParseArray<string>(p.cons);
  const useCases = safeParseArray<string>(p.useCases);
  const mockupConfig = safeParseObject<Record<string, unknown>>(p.mockupConfig);

  const lines: string[] = [];

  // Summary as blockquote (lead paragraph)
  lines.push(`> ${p.summary}`, '');

  // Description
  lines.push('## Описание', '');
  lines.push(p.description, '');

  // Problem
  lines.push('## Проблема', '');
  lines.push(p.problemStatement, '');

  // Solution
  lines.push('## Решение', '');
  lines.push(p.solution, '');

  // Pros
  if (pros.length > 0) {
    lines.push('## Плюсы', '');
    pros.forEach((pro) => lines.push(`- ${pro}`));
    lines.push('');
  }

  // Cons
  if (cons.length > 0) {
    lines.push('## Минусы', '');
    cons.forEach((con) => lines.push(`- ${con}`));
    lines.push('');
  }

  // Use cases
  if (useCases.length > 0) {
    lines.push('## Когда использовать', '');
    useCases.forEach((uc) => lines.push(`- ${uc}`));
    lines.push('');
  }

  // Guidelines
  if (guidelines.length > 0) {
    lines.push('## Принципы и гайдлайны', '');
    guidelines.forEach((g) => {
      lines.push(`### ${g.title}`);
      lines.push('');
      lines.push(`**Источник:** \`${g.source}\``);
      lines.push('');
      lines.push(g.body, '');
    });
  }

  // Mockup config (as code block for clarity)
  lines.push('## Конфигурация мокапа', '');
  lines.push('```json');
  lines.push(JSON.stringify(mockupConfig, null, 2));
  lines.push('```', '');

  return lines.join('\n');
}

async function main() {
  console.log('📤 Exporting database to content/ ...');

  mkdirSync(PATTERNS_DIR, { recursive: true });

  // 1. Categories
  const categories: CategoryRow[] = await db.category.findMany({
    orderBy: { order: 'asc' },
  });
  const categoriesJson = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? '',
    icon: c.icon ?? '',
    accent: c.accent ?? 'slate',
    order: c.order,
  }));
  writeFileSync(
    join(CONTENT_DIR, 'categories.json'),
    JSON.stringify(categoriesJson, null, 2) + '\n',
  );
  console.log(`✓ categories.json (${categories.length} categories)`);

  // 2. Tags
  const tags: TagRow[] = await db.tag.findMany({ orderBy: { name: 'asc' } });
  const tagsJson = tags.map((t) => ({ slug: t.slug, name: t.name }));
  writeFileSync(
    join(CONTENT_DIR, 'tags.json'),
    JSON.stringify(tagsJson, null, 2) + '\n',
  );
  console.log(`✓ tags.json (${tags.length} tags)`);

  // 3. Patterns + their guidelines + tags
  const patterns: PatternRow[] = await db.pattern.findMany({
    orderBy: { createdAt: 'asc' },
  });
  const allGuidelines: GuidelineRow[] = await db.guideline.findMany({
    orderBy: { createdAt: 'asc' },
  });
  const allPatternTags: PatternTagRow[] = await db.patternTag.findMany();

  let written = 0;
  for (const p of patterns) {
    const pGuidelines = allGuidelines
      .filter((g) => g.patternId === p.id)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const pTags = allPatternTags
      .filter((pt) => pt.patternId === p.id)
      .map((pt) => tags.find((t) => t.id === pt.tagId)?.slug)
      .filter((s): s is string => Boolean(s));
    const category = categories.find((c) => c.id === p.categoryId);

    const platforms = safeParseArray<string>(p.platforms);
    const mockupConfig = safeParseObject<Record<string, unknown>>(p.mockupConfig);

    // YAML frontmatter
    const frontmatter: string[] = ['---'];
    frontmatter.push(`slug: ${p.slug}`);
    frontmatter.push(`title: ${yamlString(p.title)}`);
    frontmatter.push(`category: ${category?.slug ?? 'uncategorized'}`);
    frontmatter.push(`mockupType: ${p.mockupType}`);
    frontmatter.push(`severity: ${p.severity}`);
    frontmatter.push(`author: ${yamlString(p.authorName)}`);
    if (pTags.length > 0) {
      frontmatter.push(`tags:`);
      pTags.forEach((t) => frontmatter.push(`  - ${t}`));
    }
    if (platforms.length > 0) {
      frontmatter.push(`platforms:`);
      platforms.forEach((pl) => frontmatter.push(`  - ${pl}`));
    }
    frontmatter.push(`published: ${p.published}`);
    frontmatter.push(`moderationStatus: ${p.moderationStatus}`);
    frontmatter.push(`mockupConfig:`);
    // Indent JSON for YAML nested object
    const configLines = JSON.stringify(mockupConfig, null, 2).split('\n');
    configLines.forEach((line) => frontmatter.push(`  ${line}`));
    frontmatter.push('---', '');

    const body = patternToMarkdown(p, pGuidelines);
    const fullContent = frontmatter.join('\n') + '\n' + body;

    writeFileSync(join(PATTERNS_DIR, `${p.slug}.md`), fullContent);
    written++;
  }
  console.log(`✓ patterns/ (${written} Markdown files)`);

  console.log('');
  console.log('🎉 Export complete. Content is now in /content/');
  console.log('   Next step: rewrite prisma/seed.ts to read from /content/');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
