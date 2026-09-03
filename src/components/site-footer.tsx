import Link from 'next/link';
import { Github, Rss, Twitter, Send } from 'lucide-react';

const footerNav = [
  {
    title: 'About',
    links: [
      { label: 'Про проект', href: '#about' },
      { label: 'Как читать паттерны', href: '#how' },
      { label: 'Категории оттока', href: '#categories' },
      { label: 'Контакты', href: '#contacts' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Material Guidelines', href: '#material' },
      { label: 'Apple HIG', href: '#hig' },
      { label: 'Nielsen heuristics', href: '#nielsen' },
      { label: 'Глоссарий', href: '#glossary' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Условия использования', href: '#terms' },
      { label: 'Конфиденциальность', href: '#privacy' },
      { label: 'Лицензия контента', href: '#license' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container-px py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {/* Brand blurb */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-400">
                <span className="text-xs font-bold">UX</span>
              </span>
              <span className="text-sm font-semibold tracking-tight">
                UX Patterns Atlas
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Атлас мобильных UX-паттернов, сгруппированных по точкам оттока
              пользователей. Сделано для продуктовых команд.
            </p>
            <div className="mt-4 flex items-center gap-1">
              <Link
                href="#github"
                aria-label="GitHub"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Github className="size-4" />
              </Link>
              <Link
                href="#twitter"
                aria-label="Twitter"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Twitter className="size-4" />
              </Link>
              <Link
                href="#rss"
                aria-label="RSS"
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Rss className="size-4" />
              </Link>
            </div>
          </div>

          {/* Nav columns */}
          {footerNav.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="flex flex-col gap-2"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © 2025 UX Patterns Atlas · Curated for PMs &amp; UX designers
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Сервис разработал</span>
            <span className="font-medium text-foreground">Даниил Кузьмичёв</span>
            <span aria-hidden>·</span>
            <a
              href="https://t.me/danku13"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <Send className="size-3" />
              @danku13
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
