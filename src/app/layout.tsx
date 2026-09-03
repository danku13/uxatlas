import type { ReactNode } from 'react';

/**
 * Root layout — minimal pass-through for the [locale] segment.
 *
 * The actual <html>/<body> tags are rendered in [locale]/layout.tsx
 * because Next.js requires the locale to be known before rendering <html lang>.
 *
 * This file just imports globals.css so it's available everywhere.
 */
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
