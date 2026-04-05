import FooterAdZone from '@/components/FooterAdZone';
import ReadNextContent from './ReadNextContent';
import readNextData from '@/data/read-next.json';
import adsData from '@/data/ads.json';
import seriesData from '@/data/series.json';

export default function ReadNextPage() {
  const seriesMap = Object.fromEntries(seriesData.series.map((s) => [s.id, s]));

  const sorted = [...readNextData.books].sort(
    (a, b) => b.score - a.score || new Date(b.added_date) - new Date(a.added_date)
  );

  return (
    <>
      <main className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface mb-4">
            Read Next
          </h1>
          <p className="text-on-surface-variant font-body mb-12 max-w-2xl">
            Editorially curated picks, updated monthly.
          </p>
          <ReadNextContent allBooks={sorted} seriesMap={seriesMap} />
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
