import SeriesCard from '@/components/SeriesCard';
import FooterAdZone from '@/components/FooterAdZone';
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allSeries.map((series) => (
              <SeriesCard key={series.id} series={series} />
            ))}
          </div>
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
