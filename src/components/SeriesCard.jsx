import Link from 'next/link';

export default function SeriesCard({ series }) {
  return (
    <Link href={`/series/${series.id}`} className="block">
      <article className="bg-surface-container-lowest rounded-xl p-4 flex flex-col gap-3 hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300">
        <div>
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {series.title}
          </h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{series.author}</p>
        </div>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-1">
          {series.genres.map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-label"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="text-xs text-on-surface-variant font-label">
          {series.total_books} {series.total_books === 1 ? 'book' : 'books'}
        </p>
      </article>
    </Link>
  );
}
