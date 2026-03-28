'use client';
// src/components/BookCard.jsx
import { useState } from 'react';
import Link from 'next/link';
import SourceBadge from './SourceBadge';
import { scoreBadge, editorialLabels } from '@/utils/scoring';

export default function BookCard({ book, seriesMap = {}, showScore = true }) {
  const badge = book.score !== null ? scoreBadge(book.score) : null;
  const hasValidSeries = book.series_id && seriesMap[book.series_id];
  const [coverFailed, setCoverFailed] = useState(false);
  const labels = showScore ? editorialLabels(book) : [];

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
      {/* Cover */}
      <a
        href={book.amazon_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low flex items-center justify-center"
      >
        {book.cover_url && !coverFailed ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className="text-center text-on-surface-variant text-sm font-body px-4">
            {book.title}
          </span>
        )}
      </a>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Score badge */}
        {showScore && badge && (
          <span className="text-xs font-label font-medium text-secondary">
            {badge.emoji} {badge.label} · {book.score}/7 lists
          </span>
        )}

        <div>
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {book.title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{book.author}</p>
        </div>

        {/* Source badges */}
        <div className="flex flex-wrap gap-1">
          {book.sources.map((s) => (
            <SourceBadge key={s} source={s} />
          ))}
        </div>

        {/* Editorial label chips */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {labels.map((label) => (
              <span
                key={label}
                className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-xs font-label"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Weeks on list */}
        {book.weeks_on_list > 1 && (
          <p className="text-xs text-on-surface-variant font-label">
            {book.weeks_on_list} weeks on list
          </p>
        )}

        {/* Series badge */}
        {hasValidSeries && (
          <Link
            href={`/series/${book.series_id}`}
            className="text-xs text-secondary font-label hover:underline"
          >
            📚 Part of a series
          </Link>
        )}

        {/* Description */}
        {book.description && (
          <p className="text-sm text-on-surface-variant font-body flex-1">
            {book.description}
          </p>
        )}

        {/* CTA */}
        <a
          href={book.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block text-center bg-secondary-fixed hover:bg-secondary-fixed-dim text-on-secondary-fixed text-sm font-label font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Buy on Amazon
        </a>
      </div>
    </article>
  );
}
