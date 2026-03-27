import Link from 'next/link';
import FooterAdZone from '@/components/FooterAdZone';
import adsData from '@/data/ads.json';

const SOURCES = [
  { slug: 'nyt', label: 'NYT Best Sellers', description: 'The New York Times Combined Print & E-Book Fiction and Nonfiction lists.' },
  { slug: 'guardian', label: 'The Guardian Best Sellers', description: 'Weekly fiction and non-fiction bestsellers from The Guardian.' },
  { slug: 'goodreads', label: 'Goodreads Most Read', description: 'The most-read books on Goodreads this week across all genres.' },
  { slug: 'amazon', label: 'Amazon Best Sellers', description: 'The most-sold books on Amazon updated weekly.' },
  { slug: 'usatoday', label: 'USA Today Best-Selling Books', description: 'A single cross-format list of the 150 top-selling books in the US.' },
  { slug: 'publishersweekly', label: 'Publishers Weekly Best Sellers', description: 'Fiction and non-fiction bestsellers from Publishers Weekly.' },
  { slug: 'audible', label: 'Audible Best Sellers', description: 'The most-downloaded audiobooks on Audible this week.' },
];

export default function ListsPage() {
  return (
    <>
      <main className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface mb-4">
            Bestseller Lists
          </h1>
          <p className="text-on-surface-variant font-body mb-12 max-w-2xl">
            JacketList tracks seven major bestseller lists each week and merges them into a single ranked view. Browse any individual list below — all links are Amazon affiliate links.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOURCES.map((source) => (
              <Link
                key={source.slug}
                href={`/lists/${source.slug}`}
                className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-3 hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300"
              >
                <h2 className="font-headline text-lg font-medium text-on-surface">
                  {source.label}
                </h2>
                <p className="text-sm text-on-surface-variant font-body flex-1">
                  {source.description}
                </p>
                <span className="text-sm text-secondary font-label">
                  See list →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
