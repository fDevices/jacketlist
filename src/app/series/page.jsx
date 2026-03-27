import FooterAdZone from '@/components/FooterAdZone';
import SeriesContent from './SeriesContent';
import seriesData from '@/data/series.json';
import adsData from '@/data/ads.json';

export default function SeriesPage() {
  const allSeries = seriesData.series;

  return (
    <>
      <main className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface mb-4">
            Book Series Guide
          </h1>
          <p className="text-on-surface-variant font-body mb-12 max-w-2xl">
            Reading order for {allSeries.length} popular series — chronological and author&apos;s recommended, side by side.
          </p>
          <SeriesContent allSeries={allSeries} />
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
