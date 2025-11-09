import { useQuery } from '@tanstack/react-query';
import './AccountMyTrips.css';
import { getTrips } from '../../../../../api/trips';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../../store/hooks';
import { startLoading, stopLoading } from '../../../../../store/slices/loading';
import { Trip } from '@my-travel-journal/common';
import { Link, useNavigate } from 'react-router';

const LOADING_PROCESSES = {
  GETTING_TRIPS: 'accountGettingTrips',
};

function AccountMyTrips() {
  const dispatch = useAppDispatch();
  const [sortedTrips, setSortedTrips] = useState<Trip[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');

  const { data: tripsResult, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      dispatch(startLoading(LOADING_PROCESSES.GETTING_TRIPS));
    } else {
      // Sort from oldest to newest. Trips without a date go to the end.
      setSortedTrips(
        Object.values(tripsResult!.trips).sort((a, b) => {
          const da = a.info.date ? new Date(a.info.date).getTime() : Infinity;
          const db = b.info.date ? new Date(b.info.date).getTime() : Infinity;
          return da - db; // ascending
        }),
      );
      setPage(1);
      dispatch(stopLoading(LOADING_PROCESSES.GETTING_TRIPS));
    }
  }, [tripsResult, isLoading]);

  return (
    <div className="mytrips-container">
      {isLoading ? null : sortedTrips.length === 0 ? (
        <div className="mytrips-empty">You don't have any trips yet.</div>
      ) : (
        <div>
          {/* Search + Pagination controls */}
          <div className="trips-search-row">
            <div className="trips-search">
              <input
                id="trips-search-input"
                type="text"
                placeholder="Search by year, country, city or landmark"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="trips-controls">
              <Link to="create" className="create-button">
                Create
              </Link>
              <div className="trips-page-size">
                <label>Show</label>
                <select
                  value={pageSize}
                  onChange={e => setPageSize(Number(e.target.value))}
                >
                  {[5, 10, 20, 50, 100].map(n => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <span>per page</span>
              </div>
            </div>
          </div>
          <div className="trips-table" role="table">
            {/* Header */}
            <div className="trips-row header" role="row">
              <div className="trips-cell" role="columnheader">
                Year
              </div>
              <div className="trips-cell" role="columnheader">
                Trip
              </div>
            </div>

            {(() => {
              // apply search filter (year or country)
              const q = search.trim().toLowerCase();
              const filtered = q
                ? sortedTrips.filter(t => {
                    // match year
                    const year = t.info.date
                      ? new Date(t.info.date).getFullYear().toString()
                      : '';
                    if (year.includes(q)) return true;
                    // match any place country
                    const countries = Object.values(t.places || {}).map(p =>
                      `${p.country} ${p.city} ${p.name ?? ''}`.toLowerCase(),
                    );
                    if (countries.some(c => c.includes(q))) return true;
                    // also match trip name
                    if ((t.info.name || '').toLowerCase().includes(q))
                      return true;
                    return false;
                  })
                : sortedTrips;

              const total = filtered.length;
              const pageCount = Math.max(1, Math.ceil(total / pageSize));
              const current = Math.min(page, pageCount);
              const start = (current - 1) * pageSize;
              const visible = filtered.slice(start, start + pageSize);

              return (
                <>
                  {visible.map(trip => {
                    const year = trip.info.date
                      ? new Date(trip.info.date).getFullYear()
                      : '—';
                    const id = String(trip.info.id);
                    return (
                      <div
                        className="trips-row clickable"
                        role="row"
                        key={trip.info.id}
                        tabIndex={0}
                        onClick={() => void navigate(id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            void navigate(id);
                          }
                        }}
                      >
                        <div className="trips-cell" role="cell">
                          {year}
                        </div>
                        <div className="trips-cell trip-name" role="cell">
                          {trip.info.name}
                        </div>
                      </div>
                    );
                  })}

                  <div className="pagination">
                    <button
                      className="page-button"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={current <= 1}
                    >
                      Prev
                    </button>
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
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountMyTrips;
