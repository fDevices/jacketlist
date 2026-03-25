import bestsellersData from '@/data/bestsellers.json';
import seriesData from '@/data/series.json';
import adsData from '@/data/ads.json';
import HomeContent from './HomeContent';
import FooterAdZone from '@/components/FooterAdZone';

export default function HomePage() {
  // Build seriesMap: { [series_id]: series_id } for BookCard validity checks
  const seriesMap = Object.fromEntries(
    seriesData.series.map((s) => [s.id, s.id])
  );

  // Sort books: score desc, rank asc
  const books = [...bestsellersData.books].sort(
    (a, b) => b.score - a.score || a.rank - b.rank
  );

  return (
    <>
      <HomeContent
        books={books}
        series={seriesData.series}
        seriesMap={seriesMap}
        updatedDate={bestsellersData.updated}
      />
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
