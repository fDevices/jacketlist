// __tests__/components/ReadingOrderTabs.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ReadingOrderTabs from '@/components/ReadingOrderTabs';

const differentOrders = {
  chronological: [
    { position: 1, title: 'New Spring', amazon_url: '#' },
    { position: 2, title: 'Eye of the World', amazon_url: '#' },
  ],
  authors_recommended: [
    { position: 1, title: 'Eye of the World', amazon_url: '#' },
    { position: 2, title: 'New Spring', amazon_url: '#' },
  ],
};

const identicalOrders = {
  chronological: [
    { position: 1, title: 'Killing Floor', amazon_url: '#' },
    { position: 2, title: 'Die Trying', amazon_url: '#' },
  ],
  authors_recommended: [
    { position: 1, title: 'Killing Floor', amazon_url: '#' },
    { position: 2, title: 'Die Trying', amazon_url: '#' },
  ],
};

describe('ReadingOrderTabs', () => {
  it('shows tab toggle when orders differ', () => {
    render(<ReadingOrderTabs orders={differentOrders} />);
    expect(screen.getByText(/Chronological/)).toBeInTheDocument();
    expect(screen.getByText(/Author's Recommended/)).toBeInTheDocument();
  });

  it("defaults to Author's Recommended tab", () => {
    render(<ReadingOrderTabs orders={differentOrders} />);
    expect(screen.getByText('Eye of the World')).toBeInTheDocument();
  });

  it('switches to Chronological list on tab click', () => {
    render(<ReadingOrderTabs orders={differentOrders} />);
    fireEvent.click(screen.getByText(/Chronological/));
    expect(screen.getByText('New Spring')).toBeInTheDocument();
  });

  it('hides tab toggle and shows single list when orders are identical', () => {
    render(<ReadingOrderTabs orders={identicalOrders} />);
    expect(screen.queryByText(/Chronological/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Author's Recommended/)).not.toBeInTheDocument();
    expect(screen.getByText('Killing Floor')).toBeInTheDocument();
  });
});
