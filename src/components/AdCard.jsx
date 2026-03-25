// src/components/AdCard.jsx
export default function AdCard({ ad }) {
  if (!ad.active) return null;

  return (
    <article className="bg-surface-container-lowest rounded-xl p-0 flex flex-col hover:[box-shadow:0_12px_40px_rgba(27,28,26,0.05)] transition-shadow duration-300 relative">
      {/* Sponsored label */}
      <span className="absolute top-3 right-3 text-xs text-on-surface-variant font-label">
        Sponsored
      </span>

      {/* Image area — mutually exclusive: adsense shows ins, others show image if available */}
      {ad.type === 'adsense' ? (
        <div className="w-full aspect-[2/3] rounded-t-xl bg-surface-container-low flex items-center justify-center overflow-hidden">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-5836194435861990"
            data-ad-slot={ad.slot_id}
            data-ad-format="auto"
          />
        </div>
      ) : ad.image_url ? (
        <div className="w-full aspect-[2/3] rounded-t-xl overflow-hidden bg-surface-container-low">
          <img src={ad.image_url} alt={ad.title ?? ''} className="w-full h-full object-cover" />
        </div>
      ) : null}

      {/* Metadata */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {ad.title && (
          <h3 className="font-body font-semibold text-on-surface text-base leading-snug">
            {ad.title}
          </h3>
        )}
        {ad.description && (
          <p className="text-sm text-on-surface-variant font-body flex-1">{ad.description}</p>
        )}
        {ad.url && ad.cta_text && (
          <a
            href={ad.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-auto block text-center bg-primary text-on-primary text-sm font-label font-medium px-4 py-2 rounded-lg transition-opacity duration-300 hover:opacity-80"
          >
            {ad.cta_text}
          </a>
        )}
      </div>
    </article>
  );
}
