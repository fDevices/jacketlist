'use client';

import { useState } from 'react';
import BookCard from '@/components/BookCard';

function isNewThisMonth(dateStr) {
  if (!dateStr) return false;
  const added = new Date(dateStr);
  const now = new Date();
  return added.getMonth() === now.getMonth() && added.getFullYear() === now.getFullYear();
}

export default function ReadNextContent({ allBooks, seriesMap }) {
  const [activeGenres, setActiveGenres] = useState(new Set());
  const [newOnly, setNewOnly] = useState(false);

  const allGenres = [...new Set(allBooks.flatMap((b) => b.genres))].sort();

  function toggleGenre(genre) {
    setActiveGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) { next.delete(genre); } else { next.add(genre); }
      return next;
    });
  }

  const filtered = allBooks.filter((b) => {
    if (activeGenres.size > 0 && !b.genres.some((g) => activeGenres.has(g))) return false;
    if (newOnly && !isNewThisMonth(b.added_date)) return false;
    return true;
  });

  const pillBase = 'px-3 py-1.5 rounded-full text-sm font-label transition-colors duration-300';
  const pillActive = 'bg-secondary text-on-secondary';
  const pillInactive = 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container';

  return (
    <>
      {/* Genre filter */}
      <div className="flex flex-wrap gap-2 mb-4">
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

      {/* New this month toggle */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setNewOnly((v) => !v)}
          className={`${pillBase} ${newOnly ? pillActive : pillInactive}`}
        >
          ✨ New this month
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-on-surface-variant">No results for these filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} seriesMap={seriesMap} showScore={false} />
          ))}
        </div>
      )}
    </>
  );
}
