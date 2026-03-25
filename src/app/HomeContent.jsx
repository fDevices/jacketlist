'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import SeriesCard from '@/components/SeriesCard';

function matchesQuery(query, ...fields) {
  const q = query.toLowerCase();
  return fields.some((f) => f?.toLowerCase().includes(q));
}

export default function HomeContent({ books, series, seriesMap, updatedDate }) {
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
          <div className="flex items-baseline gap-4 mb-8">
            <h2 className="font-headline text-[1.75rem] font-medium text-on-surface">
              Weekly Bestsellers
            </h2>
            <span className="text-sm text-on-surface-variant font-label">
              Updated {updatedDate}
            </span>
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
