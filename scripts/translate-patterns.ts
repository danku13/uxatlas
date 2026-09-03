/**
 * Translate all pattern titles + summaries from Russian to English using LLM.
 *
 * Reads /tmp/patterns-to-translate.json (extracted from /content/ Markdown)
 * and writes /tmp/patterns-translated-en.json with English translations.
 *
 * Run: bun scripts/translate-patterns.ts
 */
import ZAI from 'z-ai-web-dev-sdk';
import { readFileSync, writeFileSync } from 'node:fs';

interface PatternToTranslate {
  slug: string;
  title: string;
  summary: string;
}

async function main() {
  const patterns: PatternToTranslate[] = JSON.parse(
    readFileSync('/tmp/patterns-to-translate.json', 'utf8'),
  );
  console.log(`📤 Translating ${patterns.length} patterns...`);

  const zai = await ZAI.create();

  // Batch in groups of 10 to keep prompt manageable
  const BATCH_SIZE = 10;
  const translated: { slug: string; title: string; summary: string }[] = [];

  for (let i = 0; i < patterns.length; i += BATCH_SIZE) {
    const batch = patterns.slice(i, i + BATCH_SIZE);
    console.log(`  batch ${i / BATCH_SIZE + 1}/${Math.ceil(patterns.length / BATCH_SIZE)}...`);

    const userContent = batch
      .map((p, idx) => `${idx + 1}. slug: ${p.slug}\n   title: ${p.title}\n   summary: ${p.summary}`)
      .join('\n');

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'You are a professional UX/UI translator. Translate the title and summary of mobile UX patterns from Russian to English. ' +
            'Keep technical terms (e.g. "empty state", "checkout", "Face ID") in English. ' +
            'Keep the tone professional and concise. ' +
            'Respond ONLY with valid JSON array, no markdown, no explanation. ' +
            'Format: [{"slug":"...","title":"...","summary":"..."}]',
        },
        {
          role: 'user',
          content: userContent,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    let batchTranslated: { slug: string; title: string; summary: string }[] = [];
    try {
      // Strip markdown code fences if present
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      batchTranslated = JSON.parse(cleaned);
    } catch (err) {
      console.error(`  ⚠ batch ${i / BATCH_SIZE + 1} failed to parse:`, err);
      console.error('  raw response:', raw.substring(0, 500));
      // Fallback: keep original Russian for this batch
      batchTranslated = batch.map((p) => ({ ...p }));
    }
    translated.push(...batchTranslated);
  }

  writeFileSync('/tmp/patterns-translated-en.json', JSON.stringify(translated, null, 2));
  console.log(`✓ Translated ${translated.length} patterns`);
  console.log('  saved to /tmp/patterns-translated-en.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
