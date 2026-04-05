import bestsellersData from '@/data/bestsellers.json';
import seriesData from '@/data/series.json';
import readNextData from '@/data/read-next.json';
import adsData from '@/data/ads.json';
import HomeContent from './HomeContent';
import FooterAdZone from '@/components/FooterAdZone';
import { computeTiebreaker } from '@/utils/scoring';

export default function HomePage() {
  const seriesMap = Object.fromEntries(
    seriesData.series.map((s) => [s.id, s])
  );

  const books = [...bestsellersData.books].sort(
    (a, b) =>
      b.score - a.score ||
      computeTiebreaker(b) - computeTiebreaker(a)
  );

  const topBooks = books.slice(0, 10);
  const alsoTrending = books.slice(10, 25);

  const readNext = [...readNextData.books]
    .sort((a, b) => b.score - a.score || new Date(b.added_date) - new Date(a.added_date))
    .slice(0, 4);

  return (
    <>
      <HomeContent
        books={topBooks}
        alsoTrending={alsoTrending}
        series={seriesData.series}
        seriesMap={seriesMap}
        updatedDate={bestsellersData.updated}
        readNext={readNext}
      />
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
