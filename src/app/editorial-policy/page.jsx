export const metadata = {
  title: 'Editorial Policy | JacketList',
  description: "How JacketList determines series reading orders.",
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="font-headline text-[2.5rem] font-semibold text-on-surface leading-tight tracking-[-0.02em] mb-8">
        Editorial Policy
      </h1>

      <div className="space-y-8 font-body text-on-surface">
        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">How reading orders are determined</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            JacketList maintains two reading orders for every series: a{' '}
            <strong className="text-on-surface">Chronological</strong> order and an{' '}
            <strong className="text-on-surface">Author&apos;s Recommended</strong> order. These are
            researched from author interviews, official series websites, and publishing notes.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">
            What &quot;Author&apos;s Recommended&quot; means
          </h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            The Author&apos;s Recommended order reflects the sequence the author has publicly stated
            is the best way to experience the series for the first time. This is often — but not
            always — the publication order. Where an author has given conflicting advice over time,
            we use the most recent authoritative statement.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">How we resolve conflicts</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            When the chronological order and the author&apos;s recommended order are identical, we
            display a single reading list without the tab toggle. When they differ, we default to
            showing the Author&apos;s Recommended order and allow readers to switch to Chronological
            if they prefer.
          </p>
        </section>

        <section>
          <h2 className="font-headline text-[1.75rem] font-medium mb-4">Affiliate disclosure</h2>
          <p className="text-base leading-relaxed text-on-surface-variant">
            All book links on JacketList are Amazon Associates affiliate links. JacketList earns a
            small commission on qualifying purchases at no extra cost to you. This does not influence
            which books or series appear on the site — our rankings and reading orders are editorially
            independent.
          </p>
        </section>
      </div>
    </div>
  );
}
