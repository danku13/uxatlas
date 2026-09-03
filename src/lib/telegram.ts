/**
 * Telegram notifier — sends a notification to a Telegram chat when a new
 * pattern is submitted via the public form.
 *
 * Security:
 *   - Bot token + chat_id are read from environment variables (never in code)
 *   - Rate limited per-IP (in-memory store, resets every 10 minutes)
 *   - Honeypot field checked server-side
 *   - All input validated with Zod before sending
 *   - Telegram API errors are swallowed (don't leak to client)
 *
 * Required env vars (set in Vercel):
 *   TELEGRAM_BOT_TOKEN  — bot token from @BotFather
 *   TELEGRAM_CHAT_ID    — your personal chat ID (or channel ID)
 *
 * If env vars are not set, the function returns success=false but doesn't
 * throw — submissions still get a friendly "saved" response so users aren't
 * blocked (and spammers don't learn whether the bot is configured).
 */

interface TelegramMessage {
  text: string;
  parseMode?: 'HTML' | 'Markdown';
}

interface SubmissionPayload {
  title: string;
  summary: string;
  category: string;
  severity: string;
  author: string;
  problemStatement: string;
  solution: string;
  description: string;
  platforms: string[];
  pros?: string[];
  cons?: string[];
  useCases?: string[];
  tags?: string[];
  guidelines?: { title: string; body: string; source: string }[];
}

// In-memory rate limiting (per server instance — works for Vercel serverless)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // max 3 submissions per 10 min per IP
const rateLimitStore = new Map<string, { count: number; firstRequest: number }>();

/**
 * Check rate limit for an IP. Returns true if allowed, false if rate-limited.
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return true;
  }

  // Reset if window expired
  if (now - entry.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * Format a submission as a Telegram message (HTML parse mode).
 */
function formatMessage(p: SubmissionPayload): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lines: string[] = [
    '📝 <b>New UX Pattern Submission</b>',
    '',
    `<b>Title:</b> ${escapeHtml(p.title)}`,
    `<b>Category:</b> ${escapeHtml(p.category)}`,
    `<b>Severity:</b> ${escapeHtml(p.severity)}`,
    `<b>Author:</b> ${escapeHtml(p.author)}`,
    `<b>Platforms:</b> ${p.platforms.join(', ')}`,
    '',
    `<b>Summary:</b>`,
    escapeHtml(p.summary),
    '',
    `<b>Problem:</b>`,
    escapeHtml(p.problemStatement),
    '',
    `<b>Solution:</b>`,
    escapeHtml(p.solution),
    '',
    `<b>Description:</b>`,
    escapeHtml(p.description.substring(0, 500)) + (p.description.length > 500 ? '...' : ''),
  ];

  if (p.pros && p.pros.length > 0) {
    lines.push('', '<b>Pros:</b>', p.pros.map((x) => `+ ${escapeHtml(x)}`).join('\n'));
  }
  if (p.cons && p.cons.length > 0) {
    lines.push('', '<b>Cons:</b>', p.cons.map((x) => `− ${escapeHtml(x)}`).join('\n'));
  }
  if (p.useCases && p.useCases.length > 0) {
    lines.push('', '<b>Use cases:</b>', p.useCases.map((x) => `• ${escapeHtml(x)}`).join('\n'));
  }
  if (p.tags && p.tags.length > 0) {
    lines.push('', `<b>Tags:</b> ${p.tags.map(escapeHtml).join(', ')}`);
  }
  if (p.guidelines && p.guidelines.length > 0) {
    lines.push('', '<b>Guidelines:</b>');
    p.guidelines.forEach((g) => {
      lines.push(`  <i>${escapeHtml(g.title)}</i> [${escapeHtml(g.source)}]`);
      lines.push(`  ${escapeHtml(g.body.substring(0, 200))}`);
    });
  }

  lines.push('', `🕒 ${new Date().toISOString()}`);

  return lines.join('\n');
}

/**
 * Send a submission notification to Telegram.
 * Returns true on success, false on failure (missing config or API error).
 */
export async function sendTelegramNotification(
  payload: SubmissionPayload,
): Promise<{ success: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // If not configured, return success: false but don't throw.
  // The /api/patterns POST handler will still return 201 to the user
  // (so they don't know whether Telegram is set up or not — security by obscurity).
  if (!botToken || !chatId) {
    return {
      success: false,
      error: 'Telegram not configured (missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars)',
    };
  }

  try {
    const text = formatMessage(payload);

    // Telegram message limit is 4096 chars — truncate if needed
    const truncatedText = text.length > 4000
      ? text.substring(0, 4000) + '\n\n... [truncated]'
      : text;

    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: truncatedText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      // Don't let Telegram API hang the request
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[telegram] API error:', response.status, errorText);
      return { success: false, error: `Telegram API error: ${response.status}` };
    }

    return { success: true };
  } catch (err) {
    console.error('[telegram] failed to send notification:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Get client IP from request headers (works behind Vercel proxy).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // Take first IP from comma-separated list
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
