// src/components/SourceBadge.jsx
const SOURCE_LABELS = {
  nyt: 'NYT',
  guardian: 'Guardian',
  goodreads: 'Goodreads',
};

export default function SourceBadge({ source }) {
  return (
    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-label uppercase tracking-wide">
      {SOURCE_LABELS[source] ?? source}
    </span>
  );
}
