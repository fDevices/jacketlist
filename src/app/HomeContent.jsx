'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import SeriesCard from '@/components/SeriesCard';
import { scoreBadge } from '@/utils/scoring';

const SOURCE_PILLS = [
  { label: 'NYT', href: '/lists/nyt' },
  { label: 'Guardian', href: '/lists/guardian' },
  { label: 'Goodreads', href: '/lists/goodreads' },
  { label: 'Amazon', href: '/lists/amazon' },
  { label: 'USA Today', href: '/lists/usatoday' },
  { label: 'Publishers Weekly', href: '/lists/publishersweekly' },
  { label: 'Audible', href: '/lists/audible' },
];

function matchesQuery(query, ...fields) {
  const q = query.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

export default function HomeContent({ books, alsoTrending = [], series, seriesMap, updatedDate }) {
  const [query, setQuery] = useState('');

  const filteredBooks = query
    ? books.filter((b) => matchesQuery(query, b.title, b.author))
    : books;

  const filteredSeries = query
    ? series.filter((s) => matchesQuery(query, s.title, s.author))
    : series;

  const allGenres = [...new Set(series.flatMap((s) => s.genres))].sort();
  const [activeGenre, setActiveGenre] = useState(null);

  const displayedSeries = activeGenre
    ? filteredSeries.filter((s) => s.genres.includes(activeGenre))
    : filteredSeries;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-container py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-[3.5rem] font-semibold text-on-primary leading-tight tracking-[-0.02em] mb-4">
            JacketList
          </h1>
          <p className="text-on-primary/80 text-lg font-body mb-8">
            The list worth reading. In the right order.
          </p>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {/* Weekly Bestsellers */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-baseline gap-4 mb-6">
            <h2 className="font-headline text-[1.75rem] font-medium text-on-surface">
              Weekly Bestsellers
            </h2>
            <span className="text-sm text-on-surface-variant font-label">
              Updated {updatedDate}
            </span>
          </div>

          {/* Source pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {SOURCE_PILLS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-full text-sm font-label bg-surface-container-high text-on-surface-variant hover:bg-surface-container transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
          </div>
          {filteredBooks.length === 0 ? (
            <p className="text-on-surface-variant">No books match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} seriesMap={seriesMap} />
              ))}
            </div>
          )}

          {/* Also trending — hidden when search is active */}
          {!query && alsoTrending.length > 0 && (
            <div className="mt-12">
              <h3 className="font-headline text-lg font-medium text-on-surface mb-4">
                Also trending this week
              </h3>
              <ol className="space-y-2">
                {alsoTrending.map((book) => {
                  const badge = scoreBadge(book.score);
                  return (
                    <li key={book.id} className="flex items-center gap-3 text-sm font-body">
                      <span className="w-6 text-right text-on-surface-variant font-label shrink-0">
                        {book.rank}.
                      </span>
                      <span className="font-medium text-on-surface">{book.title}</span>
                      <span className="text-on-surface-variant">—</span>
                      <span className="text-on-surface-variant">{book.author}</span>
                      <span className="shrink-0">{badge.emoji}</span>
                      <a
                        href={book.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto shrink-0 text-secondary font-label hover:underline"
                      >
                        Buy →
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>
      </section>

      {/* Popular Series */}
      <section className="bg-surface-container-low py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-[1.75rem] font-medium text-on-surface mb-6">
            Popular Series
          </h2>

          {/* Genre filter chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveGenre(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300 ${
                activeGenre === null
                  ? 'bg-secondary text-on-secondary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              All
            </button>
            {allGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre === activeGenre ? null : genre)}
                className={`px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300 ${
                  activeGenre === genre
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {displayedSeries.length === 0 ? (
            <p className="text-on-surface-variant">No series match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedSeries.map((s) => (
                <SeriesCard key={s.id} series={s} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
