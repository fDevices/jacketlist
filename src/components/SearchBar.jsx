'use client';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full max-w-xl">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search books and series…"
        className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-secondary outline-none px-3 py-2 text-on-surface placeholder-on-surface-variant text-base font-body transition-colors duration-300"
      />
    </div>
  );
}
