import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LucideIcon } from '@/components/lucide-icon';

/* -------------------------------------------------------------------------- */
/*  Types — match the API contract documented in the task brief              */
/* -------------------------------------------------------------------------- */
type PatternCategory = {
  slug: string;
  name: string;
  icon: string | null;
  accent: string | null;
};

type Pattern = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  severity: 'high' | 'medium' | 'low' | string;
  mockupType: string;
  mockupConfig: string | null;
  platforms: string[];
  category: PatternCategory;
  tags?: { slug: string; name: string }[];
};

type PatternsResponse = {
  items: Pattern[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/* -------------------------------------------------------------------------- */
/*  Accent color mapping (top stripe on the phone preview)                    */
/* -------------------------------------------------------------------------- */
const STRIPE_MAP: Record<string, string> = {
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  violet: 'bg-violet-500',
  sky: 'bg-sky-500',
  pink: 'bg-pink-500',
  slate: 'bg-slate-500',
};

function stripeFor(accent: string | null): string {
  if (accent && STRIPE_MAP[accent]) return STRIPE_MAP[accent];
  return STRIPE_MAP.slate;
}

/* -------------------------------------------------------------------------- */
/*  Severity badge styling                                                     */
/* -------------------------------------------------------------------------- */
const SEVERITY_MAP: Record<string, string> = {
  high: 'border-transparent bg-rose-500/15 text-rose-700 dark:text-rose-300 dark:bg-rose-500/15',
  medium:
    'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-300 dark:bg-amber-500/15',
  low: 'border-transparent bg-slate-500/15 text-slate-700 dark:text-slate-300 dark:bg-slate-500/15',
};

function severityClass(severity: string): string {
  return SEVERITY_MAP[severity] ?? SEVERITY_MAP.low;
}

function severityLabel(severity: string): string {
  switch (severity) {
    case 'high':
      return 'High drop-off';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return severity;
  }
}

/* -------------------------------------------------------------------------- */
/*  Data fetching                                                             */
/* -------------------------------------------------------------------------- */
async function fetchFeaturedPatterns(): Promise<Pattern[]> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    'http://localhost:3000';
  try {
    const res = await fetch(
      `${base}/api/patterns?pageSize=6&sort=severity`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as PatternsResponse | Pattern[];
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.items)) return data.items;
    return [];
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/*  UI                                                                        */
/* -------------------------------------------------------------------------- */
function PatternCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-[16/9] w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-full animate-pulse rounded bg-muted" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

function PatternCard({ pattern }: { pattern: Pattern }) {
  const cat = pattern.category;
  const stripe = stripeFor(cat?.accent ?? null);
  const iconName = cat?.icon ?? 'Circle';

  return (
    <button
      type="button"
      aria-label={`Open pattern: ${pattern.title}`}
      className="group block w-full text-left focus:outline-none"
    >
      <Card className="gap-0 overflow-hidden rounded-xl py-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring">
        {/* Phone preview placeholder (16:9) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b bg-gradient-to-br from-muted/60 to-muted/20">
          {/* accent top stripe */}
          <div className={`absolute inset-x-0 top-0 h-1 ${stripe}`} />
          {/* mock phone silhouette */}
          <div className="absolute left-1/2 top-1/2 h-[78%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-[0.75rem] border bg-card/80 shadow-md">
            <div className="flex h-3 items-center justify-center">
              <div className="h-1 w-6 rounded-full bg-foreground/15" />
            </div>
            <div className="flex flex-col gap-1 p-1.5">
              <div className="h-1.5 w-2/3 rounded-full bg-foreground/10" />
              <div className="mt-1 h-6 w-full rounded bg-foreground/5" />
              <div className="h-1.5 w-3/4 rounded-full bg-foreground/10" />
              <div className="h-1.5 w-1/2 rounded-full bg-foreground/10" />
            </div>
          </div>
          {/* category corner badge */}
          <span className="absolute right-2 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
            <LucideIcon name={iconName} className="size-3" />
            <span className="max-w-[6rem] truncate">{cat?.name}</span>
          </span>
        </div>

        <div className="flex flex-col gap-2 p-4">
          <h3 className="line-clamp-1 text-sm font-semibold tracking-tight">
            {pattern.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {pattern.summary}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className={`font-medium ${severityClass(pattern.severity)}`}
            >
              {severityLabel(pattern.severity)}
            </Badge>
            {pattern.platforms?.map((p) => (
              <Badge key={p} variant="secondary" className="font-medium uppercase">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </button>
  );
}

export async function FeaturedPatternsSection() {
  const patterns = await fetchFeaturedPatterns();

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {patterns.length === 0
        ? Array.from({ length: 6 }).map((_, i) => (
            <PatternCardSkeleton key={i} />
          ))
        : patterns.map((p) => <PatternCard key={p.id} pattern={p} />)}
    </div>
  );
}
