// src/components/FooterAdZone.jsx
import AdCard from './AdCard';

export default function FooterAdZone({ ads }) {
  const activeAds = ads.filter((ad) => ad.active);
  if (activeAds.length === 0) return null;

  return (
    <section className="bg-surface-container-low py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-headline text-[1.75rem] font-medium text-on-surface mb-8">
          You might also enjoy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </section>
  );
}
