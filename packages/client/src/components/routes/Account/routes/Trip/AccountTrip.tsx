import './AccountTrip.css';
import { useQuery } from '@tanstack/react-query';
import { getTrip } from '../../../../../api/trips';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../../store/hooks';
import { startLoading, stopLoading } from '../../../../../store/slices/loading';
import { useNavigate, useParams } from 'react-router';
import { Journey, Trip } from '@my-travel-journal/common';

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

  const [shouldWait, setShouldWait] = useState<boolean>(create !== true);
  const [originalTrip, setOriginalTrip] = useState<Trip | null>(null);
  const [currentTripId, setCurrentTripId] = useState<number | null>(null);
  const [currentTripName, setCurrentTripName] = useState<string>('');
  const [currentTripYear, setCurrentTripYear] = useState<string>('');
  const [currentTripJourneys, setCurrentTripJourneys] = useState<Journey[]>([]);

  if (create !== true) {
    const { data: tripResult, isLoading } = useQuery({
      queryKey: ['trips', `trip_${tripId}`],
      queryFn: () => getTrip(tripId!),
    });

    useEffect(() => {
      if (isLoading) {
        dispatch(startLoading(LOADING_PROCESSES.GETTING_TRIP));
        setShouldWait(true);
      } else {
        if (tripResult != null) {
          setOriginalTrip(tripResult.trip);
          setCurrentTripId(tripResult.trip.info.id);
          setCurrentTripName(tripResult.trip.info.name || '');
          setCurrentTripYear(tripResult.trip.info.year ?? '');
          setCurrentTripJourneys(tripResult.trip.journeys);
        }
        setShouldWait(false);
        dispatch(stopLoading(LOADING_PROCESSES.GETTING_TRIP));
      }
    }, [tripResult, isLoading]);
  }

  return shouldWait ? null : (
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
