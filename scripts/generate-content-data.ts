/**
 * Prebuild script — generates src/lib/content-data.generated.ts from /content/
 *
 * This snapshots the Markdown content into a TypeScript module that gets
 * committed into the bundle. Vercel's serverless runtime then imports this
 * module directly — no `node:fs` calls at runtime, no edge compatibility issues.
 *
 * Run automatically via package.json `predev` and `prebuild` hooks.
 * The generated file is committed to git so Vercel doesn't need to run the
 * script itself.
 *
 * To regenerate after editing /content/ Markdown files:
 *   bun run content:generate
 */
import { writeFileSync, readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content');
const PATTERNS_DIR = join(CONTENT_DIR, 'patterns');
const TRANSLATIONS_DIR = join(CONTENT_DIR, 'translations');
const OUTPUT_FILE = join(ROOT, 'src', 'lib', 'content-data.generated.ts');

function safeParseArray<T>(raw: string | null | undefined, fallback: T[] = []): T[] {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function parsePatternBody(body: string) {
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
  const guidelines: { title: string; body: string; source: string }[] = [];
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
          source: currentSource || 'custom',
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

function main() {
  console.log('🔧 Generating src/lib/content-data.generated.ts ...');

  // Read categories + tags
  const categories = JSON.parse(readFileSync(join(CONTENT_DIR, 'categories.json'), 'utf8'));
  const tags = JSON.parse(readFileSync(join(CONTENT_DIR, 'tags.json'), 'utf8'));

  // Read all pattern Markdown files
  const files = readdirSync(PATTERNS_DIR).filter((f) => f.endsWith('.md'));
  const patterns = files.map((file) => {
    const raw = readFileSync(join(PATTERNS_DIR, file), 'utf8');
    const { data, content } = matter(raw);
    const body = parsePatternBody(content);
    return {
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
      mockupConfig: data.mockupConfig ?? {},
      platforms: data.platforms ?? [],
      severity: data.severity ?? 'medium',
      authorName: data.author ?? 'Community',
      published: data.published ?? true,
      moderationStatus: data.moderationStatus ?? 'approved',
      categorySlug: data.category,
      tagSlugs: data.tags ?? [],
      guidelines: body.guidelines,
      createdAt: '2025-01-01T00:00:00.000Z',
    };
  });

  // Sort categories by order, tags by name, patterns by slug (deterministic)
  categories.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
  tags.sort((a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name));
  patterns.sort((a: { slug: string }, b: { slug: string }) => a.slug.localeCompare(b.slug));

  // Load English translations (optional — fallback to Russian if missing)
  let categoriesEn: Record<string, { name: string; description: string }> = {};
  let patternsEn: { slug: string; title: string; summary: string }[] = [];
  try {
    categoriesEn = JSON.parse(readFileSync(join(TRANSLATIONS_DIR, 'categories.en.json'), 'utf8'));
    console.log(`  loaded ${Object.keys(categoriesEn).length} category EN translations`);
  } catch {
    console.log('  no categories.en.json — EN will use Russian fallback');
  }
  try {
    patternsEn = JSON.parse(readFileSync(join(TRANSLATIONS_DIR, 'patterns.en.json'), 'utf8'));
    console.log(`  loaded ${patternsEn.length} pattern EN translations`);
  } catch {
    console.log('  no patterns.en.json — EN will use Russian fallback');
  }

  // Generate TypeScript module
  const ts = `// AUTO-GENERATED by scripts/generate-content-data.ts
// Do not edit this file — edit /content/ Markdown files instead,
// then run \`bun run content:generate\` to regenerate.

import type { Category, Tag, Pattern } from './content-types';

export const CATEGORIES: Category[] = ${JSON.stringify(categories, null, 2)};

export const TAGS: Tag[] = ${JSON.stringify(tags, null, 2)};

export const PATTERNS: Pattern[] = ${JSON.stringify(patterns, null, 2)};

export const CATEGORIES_EN: Record<string, { name: string; description: string }> = ${JSON.stringify(categoriesEn, null, 2)};

export const PATTERNS_EN: { slug: string; title: string; summary: string }[] = ${JSON.stringify(patternsEn, null, 2)};
`;

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, ts);
  console.log(`✓ ${OUTPUT_FILE}`);
  console.log(`  ${categories.length} categories, ${tags.length} tags, ${patterns.length} patterns`);
}

main();
