export const metadata = {
  title: 'Methodology | JacketList',
  description: 'How JacketList compiles its weekly bestseller rankings.',
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface leading-tight tracking-[-0.02em] mb-8">
        Methodology
      </h1>

      <div className="prose-like space-y-8 font-body text-on-surface">
        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">How we compile the list</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            Every week, JacketList aggregates bestseller data from three authoritative sources: the{' '}
            <strong className="text-on-surface">New York Times</strong> bestseller list, the{' '}
            <strong className="text-on-surface">Guardian</strong> books chart, and{' '}
            <strong className="text-on-surface">Goodreads</strong> trending titles. We look at
            current rankings across all three sources and compile a unified list.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">Scoring</h2>
          <p className="text-base leading-relaxed text-on-surface-variant mb-4">
            Each book earns a score based on how many of the three sources it appears in:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="text-xl">🔥</span>
              <div>
                <strong className="text-on-surface">Top Pick (score 3)</strong>
                <p className="text-sm text-on-surface-variant">Appears on all three lists simultaneously.</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">⬆️</span>
              <div>
                <strong className="text-on-surface">Trending (score 2)</strong>
                <p className="text-sm text-on-surface-variant">Appears on two of the three lists.</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">👀</span>
              <div>
                <strong className="text-on-surface">Worth Watching (score 1)</strong>
                <p className="text-sm text-on-surface-variant">Appears on one list — newly charting or niche breakout.</p>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">Update frequency</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            The list is refreshed every <strong className="text-on-surface">Monday</strong> using
            publicly available bestseller data. The date shown on the homepage reflects the most
            recent update.
          </p>
        </section>
      </div>
    </div>
  );
}
