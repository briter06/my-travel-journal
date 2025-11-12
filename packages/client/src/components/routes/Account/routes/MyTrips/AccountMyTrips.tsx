import './AccountMyTrips.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../store/hooks';
import { isLoading } from '../../../../../store/slices/loading';
import { Trip } from '@my-travel-journal/common';
import { Link, useNavigate } from 'react-router';
import PaginatedTable from '../../../../utils/PaginatedTable/PaginatedTable';

function AccountMyTrips() {
  const [sortedTrips, setSortedTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const locations = useAppSelector(state => state.trips.locations);
  const trips = useAppSelector(state => state.trips.trips);

  const navigate = useNavigate();

  useEffect(() => {
    setSortedTrips(
      Object.values(trips).sort((a, b) => {
        const da = a.info.year ? parseInt(a.info.year, 10) : Infinity;
        const db = b.info.year ? parseInt(b.info.year, 10) : Infinity;
        return db - da; // descending
      }),
    );
  }, [trips]);

  return (
    <div className="mytrips-container">
      {isLoading() ? null : (
        <div>
          <div className="trips-search-row">
            <div className="trips-controls">
              <Link to="create" className="create-button">
                {t('trips.actions.create')}
              </Link>
            </div>
            {sortedTrips.length === 0 ? null : (
              /* Search + Pagination controls */
              <div className="trips-search">
                <input
                  id="trips-search-input"
                  type="text"
                  placeholder={t('trips.search.placeholder')}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            )}
          </div>

          {(() => {
            if (sortedTrips.length === 0)
              return (
                <div className="mytrips-empty">{t('trips.emptyMessage')}</div>
              );
            // apply search filter (year or country)
            const q = search.trim().toLowerCase();
            const filtered = q
              ? sortedTrips.filter(t => {
                  // match year
                  if ((t.info.year ?? '').includes(q)) return true;
                  // match any place country
                  const countries = t.locationIds.map(p =>
                    `${locations[p].country} ${locations[p].locality} ${locations[p].name ?? ''}`.toLowerCase(),
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
                      {t('trips.header.year')}
                    </div>
                    <div className="trips-cell" role="columnheader">
                      {t('trips.header.trip')}
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
