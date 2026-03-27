'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SeriesCard from '@/components/SeriesCard';

export default function SeriesContent({ allSeries }) {
  const [query, setQuery] = useState('');

  const filtered = allSeries
    .filter((s) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.author.toLowerCase().includes(q);
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <div className="mb-8 max-w-xl">
        <SearchBar value={query} onChange={setQuery} />
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
