import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

/**
 * Numbered pagination. Renders nothing when there is only one page.
 *
 * Props:
 *   page        - current 1-based page
 *   total       - total item count
 *   perPage     - items per page
 *   onChange    - (nextPage) => void
 */
const Pagination = ({ page, total, perPage, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  // Build the page list with ellipses: 1 … 4 5 6 … 12
  const pages = [];
  const push = (p) => pages.includes(p) || pages.push(p);
  const around = 1; // pages shown on each side of current
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= around) {
      push(p);
    }
  }
  // Insert ellipsis markers
  const items = [];
  let prev = 0;
  for (const p of pages.sort((a, b) => a - b)) {
    if (p - prev > 1) items.push('…');
    items.push(p);
    prev = p;
  }

  const go = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    onChange(p);
  };

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="pagination-arrow"
        disabled={page === 1}
        onClick={() => go(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {items.map((item, i) =>
        item === '…' ? (
          <span key={`e-${i}`} className="pagination-ellipsis">…</span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination-page ${item === page ? 'active' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => go(item)}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        className="pagination-arrow"
        disabled={page === totalPages}
        onClick={() => go(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
