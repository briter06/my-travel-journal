import React, { useEffect, useState } from 'react';
import './PaginatedTable.css';

type PaginatedTableProps<T> = {
  items: T[];
  header: React.ReactNode; // header node (e.g. a .trips-row.header element)
  renderRow: (item: T, index: number) => React.ReactNode;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  maxPageButtons?: number;
};

function PaginatedTable<T>({
  items,
  header,
  renderRow,
  defaultPageSize = 5,
  pageSizeOptions = [5, 10, 20, 50, 100],
  maxPageButtons = 2,
}: PaginatedTableProps<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  useEffect(() => {
    setPage(1);
  }, [items.length, pageSize]);

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * pageSize;
  const visible = items.slice(start, start + pageSize);

  const pages: number[] = [];
  const startPage = Math.max(1, current - maxPageButtons);
  const endPage = Math.min(pageCount, current + maxPageButtons);
  for (let p = startPage; p <= endPage; p++) pages.push(p);

  return (
    <div className="paginated-table">
      <div className="trips-controls" style={{ padding: '8px 12px' }}>
        <div className="trips-page-size">
          <label>Show</label>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>
      </div>

      <div className="trips-table" role="table">
        {header}

        {visible.map((item, i) => renderRow(item, start + i))}

        <div className="pagination">
          <button
            className="page-button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={current <= 1}
          >
            Prev
          </button>

          {/* <div className="page-numbers" role="navigation" aria-label="Page numbers">
            {pages.map(p => (
              <button key={p} className={`page-num-button ${p === current ? 'active' : ''}`} onClick={() => setPage(p)}>
                {p}
              </button>
            ))}
          </div> */}

          <div className="page-info">
            Page {current} of {pageCount}
          </div>

          <button
            className="page-button"
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            disabled={current >= pageCount}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaginatedTable;
