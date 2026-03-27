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
          <p className="text-base leading-relaxed text-on-surface-variant mb-4">
            Every week, JacketList aggregates bestseller data from seven authoritative sources:
          </p>
          <ul className="space-y-2 text-base text-on-surface-variant">
            <li><strong className="text-on-surface">New York Times</strong> — Combined Print &amp; E-Book Fiction and Nonfiction</li>
            <li><strong className="text-on-surface">The Guardian</strong> — Weekly fiction and non-fiction charts</li>
            <li><strong className="text-on-surface">Goodreads</strong> — Most-read books across all genres</li>
            <li><strong className="text-on-surface">Amazon</strong> — Most-sold books, updated weekly</li>
            <li><strong className="text-on-surface">USA Today</strong> — Single cross-format list of top-selling US books</li>
            <li><strong className="text-on-surface">Publishers Weekly</strong> — Fiction and non-fiction trade bestsellers</li>
            <li><strong className="text-on-surface">Audible</strong> — Most-downloaded audiobooks of the week</li>
          </ul>
          <p className="text-base leading-relaxed text-on-surface-variant mt-4">
            We look at current rankings across all seven sources and merge them into a single unified list of up to 25 books.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">Scoring</h2>
          <p className="text-base leading-relaxed text-on-surface-variant mb-4">
            Each book earns a score of 1–7 based on how many sources it appears in simultaneously:
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="text-xl">🔥</span>
              <div>
                <strong className="text-on-surface">Top Pick (score 5–7)</strong>
                <p className="text-sm text-on-surface-variant">Appears on five or more lists — consensus breakout.</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">⬆️</span>
              <div>
                <strong className="text-on-surface">Trending (score 3–4)</strong>
                <p className="text-sm text-on-surface-variant">Appears on three or four lists.</p>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">👀</span>
              <div>
                <strong className="text-on-surface">Worth Watching (score 1–2)</strong>
                <p className="text-sm text-on-surface-variant">Appears on one or two lists — newly charting or niche breakout.</p>
              </div>
            </li>
          </ul>
          <p className="text-base leading-relaxed text-on-surface-variant mt-4">
            When books share the same score, we break ties using a combination of average list position and weeks on the list.
          </p>
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
