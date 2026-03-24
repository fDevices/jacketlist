import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-10 px-8 max-w-7xl mx-auto">
      <p className="text-label text-on-surface-variant text-sm mb-4">
        As an Amazon Associate JacketList earns from qualifying purchases.
      </p>
      <div className="flex gap-6">
        <Link
          href="/methodology"
          className="text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-300"
        >
          Methodology
        </Link>
        <Link
          href="/editorial-policy"
          className="text-sm text-on-surface-variant hover:text-on-surface transition-colors duration-300"
        >
          Editorial Policy
        </Link>
      </div>
    </footer>
  );
}
