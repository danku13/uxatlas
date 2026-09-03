import Link from 'next/link';
import { Github, Rss, Twitter, Send } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function SiteFooter() {
  const t = await getTranslations('Footer');

  const footerNav = [
    {
      title: t('about'),
      links: [
        { label: t('aboutLinks.about'), href: '#about' },
        { label: t('aboutLinks.howToRead'), href: '#how' },
        { label: t('aboutLinks.categories'), href: '#categories' },
        { label: t('aboutLinks.contacts'), href: '#contacts' },
      ],
    },
    {
      title: t('resources'),
      links: [
        { label: t('resourcesLinks.material'), href: '#material' },
        { label: t('resourcesLinks.hig'), href: '#hig' },
        { label: t('resourcesLinks.nielsen'), href: '#nielsen' },
        { label: t('resourcesLinks.glossary'), href: '#glossary' },
      ],
    },
    {
      title: t('legal'),
      links: [
        { label: t('legalLinks.terms'), href: '#terms' },
        { label: t('legalLinks.privacy'), href: '#privacy' },
        { label: t('legalLinks.license'), href: '#license' },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container-px py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {/* Brand blurb — text only, no icon */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-base font-bold tracking-tight text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-amber-400">
              UX Atlas
            </span>
            <p className="mt-3 text-sm text-muted-foreground">
              {t('description')}
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
            {t('copyright')}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{t('developedBy')}</span>
            <span className="font-medium text-foreground">{t('authorName')}</span>
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
