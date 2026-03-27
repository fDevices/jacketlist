// src/components/SourceBadge.jsx
import Link from 'next/link';

const SOURCE_LABELS = {
  nyt: 'NYT',
  guardian: 'Guardian',
  goodreads: 'Goodreads',
};

export default function SourceBadge({ source }) {
  return (
    <Link
      href={`/lists/${source}`}
      className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-label uppercase tracking-wide hover:bg-surface-container-highest transition-colors duration-200"
    >
      {SOURCE_LABELS[source] ?? source}
    </Link>
  );
}
