import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { HeroSection } from '@/components/home/hero-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { PatternCatalogSection } from '@/components/patterns/pattern-catalog-section';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <PatternCatalogSection />
      </main>
      <SiteFooter />
    </>
  );
}
