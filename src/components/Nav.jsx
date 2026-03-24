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
      </nav>
    </header>
  );
}
