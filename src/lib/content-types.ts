// Re-export the types so the generated file doesn't need to import them
// from content.ts (which has runtime code that uses node:fs).
// These types are shared between the generated data file and the runtime
// content reader.

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  order: number;
};

export type Tag = { slug: string; name: string };

export type Severity = 'high' | 'medium' | 'low';
export type GuidelineSource = 'material' | 'hig' | 'nielsen' | 'custom';

export type Guideline = {
  title: string;
  body: string;
  source: GuidelineSource;
};

export type Pattern = {
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
  published: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  categorySlug: string;
  tagSlugs: string[];
  guidelines: Guideline[];
  createdAt: string;
};
