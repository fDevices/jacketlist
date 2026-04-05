'use client';

import { useState } from 'react';
import AdaptationCard from '@/components/AdaptationCard';

export default function AdaptationsContent({ allAdaptations }) {
  const [activeType, setActiveType] = useState('all');
  const [activeGenres, setActiveGenres] = useState(new Set());

  const allGenres = [...new Set(allAdaptations.flatMap((a) => a.genres))].sort();

  function toggleGenre(genre) {
    setActiveGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) { next.delete(genre); } else { next.add(genre); }
      return next;
    });
  }

  const filtered = allAdaptations.filter((a) => {
    if (activeType !== 'all' && a.type !== activeType) return false;
    if (activeGenres.size > 0 && !a.genres.some((g) => activeGenres.has(g))) return false;
    return true;
  });

  const pillBase = 'px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300';
  const pillActive = 'bg-secondary text-on-secondary';
  const pillInactive = 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container';

  return (
    <>
      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: 'All', value: 'all' },
          { label: 'Movie', value: 'movie' },
          { label: 'TV Series', value: 'tv' },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveType(value)}
            className={`${pillBase} ${activeType === value ? pillActive : pillInactive}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Genre filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveGenres(new Set())}
          className={`${pillBase} ${activeGenres.size === 0 ? pillActive : pillInactive}`}
        >
          All
        </button>
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`${pillBase} ${activeGenres.has(genre) ? pillActive : pillInactive}`}
          >
            {genre}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-on-surface-variant">No results for these filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((adaptation) => (
            <AdaptationCard key={adaptation.id} adaptation={adaptation} />
          ))}
        </div>
      )}
    </>
  );
}
