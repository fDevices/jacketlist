import Link from 'next/link';

const TYPE_BADGE = {
  movie: '🎬 Movie',
  tv: '📺 TV Series',
};

export default function AdaptationCard({ adaptation }) {
  return (
    <article className="bg-surface-container-lowest rounded-xl flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {TYPE_BADGE[adaptation.type] && (
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-label">
                {TYPE_BADGE[adaptation.type]}
              </span>
            )}
            {adaptation.oscars?.status === 'winner' && (
              <span
                className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-label"
                title={adaptation.oscars.note}
              >
                🏆 Oscar Winner
              </span>
            )}
          </div>
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
