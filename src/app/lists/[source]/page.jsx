import Link from 'next/link';
import BookCard from '@/components/BookCard';
import FooterAdZone from '@/components/FooterAdZone';
import adsData from '@/data/ads.json';
import nyt from '@/data/sources/nyt.json';
import guardian from '@/data/sources/guardian.json';
import goodreads from '@/data/sources/goodreads.json';
import amazon from '@/data/sources/amazon.json';
import usatoday from '@/data/sources/usatoday.json';
import publishersweekly from '@/data/sources/publishersweekly.json';
import audible from '@/data/sources/audible.json';

const ALL_SOURCES = [nyt, guardian, goodreads, amazon, usatoday, publishersweekly, audible];

export function generateStaticParams() {
  return ALL_SOURCES.map((s) => ({ source: s.source }));
}

export default function SourceListPage({ params }) {
  const sourceData = ALL_SOURCES.find((s) => s.source === params.source);

  if (!sourceData) return null;

  const books = sourceData.books.map((b) => ({
    id: `${sourceData.source}-${b.position}`,
    title: b.title,
    author: b.author,
    cover_url: b.cover_url,
    description: '',
    sources: [sourceData.source],
    score: null,
    rank: b.position,
    weeks_on_list: 0,
    amazon_url: b.amazon_url,
  }));

  return (
    <>
      <main className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-on-surface-variant font-label mb-2">
            As seen on
          </p>
          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface mb-2">
            {sourceData.label}
          </h1>
          <p className="text-sm text-on-surface-variant font-label mb-12">
            Updated {sourceData.updated}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} seriesMap={{}} showScore={false} />
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="text-sm text-secondary font-label hover:underline"
            >
              ← See our full merged Top 10
            </Link>
          </div>
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
