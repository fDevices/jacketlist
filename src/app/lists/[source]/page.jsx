import Link from 'next/link';
import BookCard from '@/components/BookCard';
import FooterAdZone from '@/components/FooterAdZone';
import adsData from '@/data/ads.json';
import bestsellersData from '@/data/bestsellers.json';
import nyt from '@/data/sources/nyt.json';
import guardian from '@/data/sources/guardian.json';
import goodreads from '@/data/sources/goodreads.json';
import amazon from '@/data/sources/amazon.json';
import publishersweekly from '@/data/sources/publishersweekly.json';
import audible from '@/data/sources/audible.json';
import ark from '@/data/sources/ark.json';

const ALL_SOURCES = [nyt, guardian, goodreads, amazon, ark, publishersweekly, audible];

export function generateStaticParams() {
  return ALL_SOURCES.map((s) => ({ source: s.source }));
}

export default function SourceListPage({ params }) {
  const sourceData = ALL_SOURCES.find((s) => s.source === params.source);

  if (!sourceData) return null;

  const bestsellerCoverMap = Object.fromEntries(
    bestsellersData.books.map((b) => [b.title.toLowerCase(), b.cover_url])
  );

  const books = sourceData.books.map((b) => ({
    id: `${sourceData.source}-${b.position}`,
    title: b.title,
    author: b.author,
    cover_url: bestsellerCoverMap[b.title.toLowerCase()] || b.cover_url,
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
          <div className="flex items-center gap-3 mb-2">
            <p className="text-sm text-on-surface-variant font-label">
              Updated {sourceData.updated}
            </p>
            {params.source === 'nyt' && (
              <a
                href="https://developer.nytimes.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/poweredby_nytimes_30a.png"
                  alt="Data provided by The New York Times"
                  width={30}
                  height={30}
                />
              </a>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
