import './AccountMyTrips.css';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../store/hooks';
import { isLoading } from '../../../../../store/slices/loading';
import { Trip } from '@my-travel-journal/common';
import { Link, useNavigate } from 'react-router';
import PaginatedTable from '../../../../utils/PaginatedTable/PaginatedTable';

function AccountMyTrips() {
  const [sortedTrips, setSortedTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState('');

  const places = useAppSelector(state => state.trips.places);
  const trips = useAppSelector(state => state.trips.trips);

  const navigate = useNavigate();

  useEffect(() => {
    setSortedTrips(
      Object.values(trips).sort((a, b) => {
        const da = a.info.year ? parseInt(a.info.year, 10) : Infinity;
        const db = b.info.year ? parseInt(b.info.year, 10) : Infinity;
        return da - db; // ascending
      }),
    );
  }, [trips]);

  return (
    <div className="mytrips-container">
      {isLoading() ? null : sortedTrips.length === 0 ? (
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
            </div>
          </div>
          {(() => {
            // apply search filter (year or country)
            const q = search.trim().toLowerCase();
            const filtered = q
              ? sortedTrips.filter(t => {
                  // match year
                  if ((t.info.year ?? '').includes(q)) return true;
                  // match any place country
                  const countries = t.placeIds.map(p =>
                    `${places[p].country} ${places[p].city} ${places[p].name ?? ''}`.toLowerCase(),
                  );
                  if (countries.some(c => c.includes(q))) return true;
                  // also match trip name
                  if ((t.info.name || '').toLowerCase().includes(q))
                    return true;
                  return false;
                })
              : sortedTrips;

            return (
              <PaginatedTable
                items={filtered}
                header={
                  <div className="trips-row header" role="row">
                    <div className="trips-cell" role="columnheader">
                      Year
                    </div>
                    <div className="trips-cell" role="columnheader">
                      Trip
                    </div>
                  </div>
                }
                defaultPageSize={10}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                maxPageButtons={2}
                renderRow={(trip: Trip) => {
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
                        {trip.info.year ?? '—'}
                      </div>
                      <div className="trips-cell trip-name" role="cell">
                        {trip.info.name}
                      </div>
                    </div>
                  );
                }}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default AccountMyTrips;
