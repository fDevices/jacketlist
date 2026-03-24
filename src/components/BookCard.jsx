// src/components/BookCard.jsx
import Link from 'next/link';
import SourceBadge from './SourceBadge';
import { scoreBadge } from '@/utils/scoring';

export default function BookCard({ book, seriesMap = {} }) {
  const badge = scoreBadge(book.score);
  const hasValidSeries = book.series_id && seriesMap[book.series_id];

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
      {/* Cover */}
      <div className="w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={book.title}
            className="w-full h-full flex items-center justify-center bg-surface-container-low"
          />
        )}
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Score badge */}
        <span className="text-xs font-label font-medium text-secondary">
          {badge.emoji} {badge.label}
        </span>

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
        <p className="text-sm text-on-surface-variant font-body flex-1">
          {book.description}
        </p>

        {/* CTA */}
        <a
          href={book.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block text-center bg-primary text-on-primary text-sm font-label font-medium px-4 py-2 rounded-lg transition-opacity duration-300 hover:opacity-80"
        >
          Buy on Amazon
        </a>
      </div>
    </article>
  );
}
