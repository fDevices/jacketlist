'use client';
import { useState } from 'react';
import Link from 'next/link';

const TYPE_BADGE = {
  movie: '🎬 Movie',
  tv: '📺 TV Series',
};

export default function AdaptationCard({ adaptation }) {
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
      {/* Cover */}
      <div className="relative w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low flex items-center justify-center">
        {adaptation.cover_url && !coverFailed ? (
          <img
            src={adaptation.cover_url}
            alt={adaptation.book_title}
            className="w-full h-full object-cover"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <span className="text-center text-on-surface-variant text-sm font-body px-4">
            {adaptation.book_title}
          </span>
        )}
        {/* Type badge overlay */}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-label">
          {TYPE_BADGE[adaptation.type]}
        </span>
      </div>

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {adaptation.book_title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{adaptation.author}</p>
          <p className="text-xs text-on-surface-variant mt-0.5 italic">
            {adaptation.adaptation_title}
          </p>
        </div>

        <p className="text-sm text-on-surface-variant font-body italic flex-1">
          {adaptation.hook}
        </p>

        {adaptation.series_id && (
          <Link
            href={`/series/${adaptation.series_id}`}
            className="text-xs text-secondary font-label hover:underline"
          >
            📚 Full series →
          </Link>
        )}

        <a
          href={adaptation.amazon_url}
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
