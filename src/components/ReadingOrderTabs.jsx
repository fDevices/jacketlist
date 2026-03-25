// src/components/ReadingOrderTabs.jsx
'use client';

import { useState } from 'react';

function ordersAreIdentical(a, b) {
  if (a.length !== b.length) return false;
  return a.every((item, i) => item.title === b[i].title);
}

function BookList({ books }) {
  return (
    <ol className="flex flex-col gap-4">
      {books.map((book) => (
        <li key={book.position} className="flex items-start gap-4">
          <span className="text-sm font-label font-medium text-on-surface-variant w-6 shrink-0 pt-0.5">
            {book.position}.
          </span>
          <div className="flex-1">
            <p className="font-body font-semibold text-on-surface text-base">{book.title}</p>
            {book.note && (
              <p className="text-xs text-on-surface-variant mt-0.5 italic">{book.note}</p>
            )}
          </div>
          <a
            href={book.amazon_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-label font-medium bg-primary text-on-primary px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity duration-300 shrink-0"
          >
            Buy
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function ReadingOrderTabs({ orders }) {
  const [activeTab, setActiveTab] = useState('authors_recommended');
  const identical = ordersAreIdentical(orders.chronological, orders.authors_recommended);

  if (identical) {
    return <BookList books={orders.chronological} />;
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-8">
        {[
          { key: 'authors_recommended', label: "✍️ Author's Recommended" },
          { key: 'chronological', label: '📖 Chronological' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-label font-medium transition-colors duration-300 ${
              activeTab === tab.key
                ? 'bg-secondary text-on-secondary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <BookList books={orders[activeTab]} />
    </div>
  );
}
