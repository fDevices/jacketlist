import Link from 'next/link';

export default function Nav() {
  return (
    <header className="bg-surface/80 backdrop-blur-[20px]">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-2xl font-semibold font-headline text-on-surface"
        >
          JacketList
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/lists" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
            Lists
          </Link>
          <Link href="/series" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
            Series
          </Link>
          <Link href="/adaptations" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
            Adaptations
          </Link>
          <Link href="/read-next" className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors duration-200">
            Read Next
          </Link>
        </div>
      </nav>
    </header>
  );
}
