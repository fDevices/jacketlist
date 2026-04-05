import FooterAdZone from '@/components/FooterAdZone';
import AdaptationsContent from './AdaptationsContent';
import adaptationsData from '@/data/adaptations.json';
import adsData from '@/data/ads.json';

export default function AdaptationsPage() {
  const allAdaptations = adaptationsData.adaptations;

  return (
    <>
      <main className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface mb-4">
            Books Behind the Screen
          </h1>
          <p className="text-on-surface-variant font-body mb-12 max-w-2xl">
            Read the book before — or after — watching.
          </p>
          <AdaptationsContent allAdaptations={allAdaptations} />
        </div>
      </main>
      <FooterAdZone ads={adsData.footer_ads} />
    </>
  );
}
