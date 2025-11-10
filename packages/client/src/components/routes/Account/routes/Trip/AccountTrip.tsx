import './AccountTrip.css';
import { useQuery } from '@tanstack/react-query';
import { getAllPlaces, getTrip } from '../../../../../api/trips';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../../store/hooks';
import {
  isLoading,
  startLoading,
  stopLoading,
} from '../../../../../store/slices/loading';
import { useNavigate, useParams } from 'react-router';
import { Journey, Places } from '@my-travel-journal/common';
import PaginatedTable from '../../../../utils/PaginatedTable/PaginatedTable';
import SelectAutoComplete from '../../../../utils/SelectAutoComplete/SelectAutoComplete';

const LOADING_PROCESSES = {
  GETTING_TRIP: 'accountGettingTrip',
};

const YEARS: number[] = [];
for (let y = new Date().getFullYear(); y >= 1900; y--) {
  YEARS.push(y);
}

type AccountTripProps = {
  create?: boolean;
};

function AccountTrip({ create }: AccountTripProps) {
  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [allPlaces, setAllPlaces] = useState<Places>({});

  const [currentTripName, setCurrentTripName] = useState<string>('');
  const [currentTripYear, setCurrentTripYear] = useState<string>('');
  const [currentTripJourneys, setCurrentTripJourneys] = useState<Journey[]>([]);

  if (create !== true) {
    const { data: tripResult, isLoading: isLoadingTrip } = useQuery({
      queryKey: ['trips', `trip_${tripId}`],
      queryFn: async () => {
        const trip = await getTrip(tripId!);
        const allPlaces = await getAllPlaces();
        return trip != null ? { ...trip, ...allPlaces } : null;
      },
    });

    useEffect(() => {
      if (isLoadingTrip) {
        dispatch(startLoading(LOADING_PROCESSES.GETTING_TRIP));
      } else {
        if (tripResult != null) {
          setAllPlaces(tripResult.places);
          setCurrentTripName(tripResult.trip.info.name || '');
          setCurrentTripYear(tripResult.trip.info.year ?? '');
          // sort journeys once on load (ascending by date) so mounted order is stable
          const sortedJourneys = tripResult.trip.journeys
            .slice()
            .sort((a: Journey, b: Journey) => {
              const da = new Date(a.date);
              const db = new Date(b.date);
              return da.getTime() - db.getTime();
            });
          setCurrentTripJourneys(sortedJourneys);
        }
        dispatch(stopLoading(LOADING_PROCESSES.GETTING_TRIP));
      }
    }, [tripResult, isLoadingTrip]);
  }

  const getPlaceOptions = () =>
    Object.entries(allPlaces).map(([id, place]) => (
      <option key={id} value={id}>
        {place.country}, {place.city}
        {place.name != null ? `, ${place.name}` : ''}
      </option>
    ));

  const placeOptionsArray = Object.entries(allPlaces).map(([id, place]) => ({
    id,
    label: `${place.country}, ${place.city}${place.name != null ? `, ${place.name}` : ''}`,
  }));

  return isLoading() ? null : (
    <div className="account-trip-editor">
      <div className="trip-field-row">
        <label className="trip-field-label">Name</label>
        <input
          className="trip-field-input"
          type="text"
          value={currentTripName}
          onChange={e => setCurrentTripName(e.target.value)}
        />
      </div>

      <div className="trip-field-row">
        <label className="trip-field-label">Date</label>
        <div className="trip-date-selects">
          <select
            className="trip-date-select"
            value={currentTripYear}
            onChange={e => {
              setCurrentTripYear(e.target.value);
            }}
            aria-label="Year"
          >
            <option value="">—</option>
            {YEARS.map(y => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Journeys table: paginated editable rows bound to currentTripJourneys */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0 }}>Journeys</h3>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setCurrentTripJourneys(prev => [
                ...prev,
                { from: NaN, to: null, date: '' },
              ]);
            }}
          >
            Add journey
          </button>
        </div>

        <PaginatedTable
          items={currentTripJourneys}
          defaultPageSize={10}
          header={
            <div className="journeys-row header">
              <div className="journey-col">From</div>
              <div className="journey-col">To</div>
              <div className="journey-col">Date</div>
              <div className="journey-col">Actions</div>
            </div>
          }
          renderRow={(journey: Journey, idx: number) => (
            <div key={idx} className="journeys-row">
              <div className="journey-col">
                <select
                  className="journey-select"
                  value={journey.from.toString()}
                  onChange={e => {
                    const v =
                      e.target.value === '' ? NaN : Number(e.target.value);
                    setCurrentTripJourneys(prev =>
                      prev.map((j, i) => (i === idx ? { ...j, from: v } : j)),
                    );
                  }}
                >
                  <option value="">--</option>
                  {getPlaceOptions()}
                </select>
              </div>

              <div className="journey-col">
                <SelectAutoComplete
                  options={placeOptionsArray}
                  value={journey.to}
                  onChange={(id: string | number | null) =>
                    setCurrentTripJourneys(prev =>
                      prev.map((j, i) =>
                        i === idx
                          ? { ...j, to: id == null ? null : Number(id) }
                          : j,
                      ),
                    )
                  }
                  noMatchNode={{
                    node: query => <span>Create place "{query}"</span>,
                    callback: query => {
                      console.log('WEnas', query);
                    },
                  }}
                />
              </div>

              <div className="journey-col">
                <input
                  className="journey-date"
                  type="date"
                  value={(journey.date || '').split('T')[0]}
                  onChange={e => {
                    const v = e.target.value;
                    setCurrentTripJourneys(prev =>
                      prev.map((j, i) => (i === idx ? { ...j, date: v } : j)),
                    );
                  }}
                />
              </div>

              <div className="journey-col">
                <button
                  type="button"
                  className="btn cancel"
                  onClick={() =>
                    setCurrentTripJourneys(prev =>
                      prev.filter((_, i) => i !== idx),
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        />
      </div>

      <div className="trip-editor-actions">
        <button
          type="button"
          className="btn cancel"
          onClick={() => {
            void navigate('..');
          }}
        >
          Cancel
        </button>
        <button type="button" className="btn primary">
          {create ? 'Create' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default AccountTrip;
