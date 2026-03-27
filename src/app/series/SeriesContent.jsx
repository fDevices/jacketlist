'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SeriesCard from '@/components/SeriesCard';

const GENRE_ORDER = [
  'Crime', 'Fantasy', 'Historical Fiction', 'Mystery',
  'Romance', 'Sci-Fi', 'Thriller', 'Young Adult',
];

function sortGenres(genres) {
  return [...genres].sort((a, b) => {
    const ai = GENRE_ORDER.indexOf(a);
    const bi = GENRE_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

export default function SeriesContent({ allSeries }) {
  const [query, setQuery] = useState('');
  const [activeGenres, setActiveGenres] = useState(new Set());

  const allGenres = sortGenres([...new Set(allSeries.flatMap((s) => s.genres))]);

  function toggleGenre(genre) {
    setActiveGenres((prev) => {
      const next = new Set(prev);
      next.has(genre) ? next.delete(genre) : next.add(genre);
      return next;
    });
  }

  const filtered = allSeries
    .filter((s) => {
      if (query) {
        const q = query.toLowerCase();
        if (!s.title.toLowerCase().includes(q) && !s.author.toLowerCase().includes(q)) return false;
      }
      if (activeGenres.size > 0) {
        if (!s.genres.some((g) => activeGenres.has(g))) return false;
      }
      return true;
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div className="mb-6 max-w-xl">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Genre pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveGenres(new Set())}
          className={`px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300 ${
            activeGenres.size === 0
              ? 'bg-secondary text-on-secondary'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          All
        </button>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300 ${
              activeGenres.has(genre)
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-on-surface-variant">No series match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((series) => (
            <SeriesCard key={series.id} series={series} />
          ))}
        </div>
      )}
    </>
  );
}
