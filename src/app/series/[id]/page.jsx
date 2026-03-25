// src/app/series/[id]/page.jsx
import { notFound } from 'next/navigation';
import seriesData from '@/data/series.json';
import adsData from '@/data/ads.json';
import ReadingOrderTabs from '@/components/ReadingOrderTabs';
import FooterAdZone from '@/components/FooterAdZone';

export function generateStaticParams() {
  return seriesData.series.map((s) => ({ id: s.id }));
}

export function generateMetadata({ params }) {
  const series = seriesData.series.find((s) => s.id === params.id);
  if (!series) return {};
  return {
    title: `${series.title} Reading Order | JacketList`,
    description: series.description,
  };
}

export default function SeriesPage({ params }) {
  const series = seriesData.series.find((s) => s.id === params.id);
  if (!series) notFound();

  return (
    <>
      {/* Series header */}
      <section className="py-16 px-8">
        <div className="max-w-3xl mx-auto">
          {/* Genre tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {series.genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-label"
              >
                {genre}
              </span>
            ))}
          </div>

          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface leading-tight tracking-[-0.02em] mb-2">
            {series.title}
          </h1>
          <p className="text-on-surface-variant text-base font-body mb-1">{series.author}</p>
          <p className="text-sm text-on-surface-variant font-label mb-6">
            {series.total_books} {series.total_books === 1 ? 'book' : 'books'}
          </p>
          <p className="text-base font-body text-on-surface leading-relaxed">{series.description}</p>
        </div>
      </section>

      {/* Bestseller banner */}
      {series.currently_on_bestseller_list && (
        <section className="px-8 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-secondary-container text-on-secondary-container rounded-xl px-5 py-3 text-sm font-label font-medium">
              🔥 Currently on the bestseller list
            </div>
          </div>
        </section>
      )}

      {/* Reading order */}
      <section className="bg-surface-container-low py-16 px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline text-[1.75rem] font-medium text-on-surface mb-8">
            Reading Order
          </h2>
          <ReadingOrderTabs orders={series.orders} />
        </div>
      </section>

      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
