import './AccountTrip.css';
import { useQuery } from '@tanstack/react-query';
import { getTrip } from '../../../../../api/trips';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../../store/hooks';
import {
  isLoading,
  startLoading,
  stopLoading,
} from '../../../../../store/slices/loading';
import { useNavigate, useParams } from 'react-router';
import { Journey } from '@my-travel-journal/common';

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

  const [currentTripName, setCurrentTripName] = useState<string>('');
  const [currentTripYear, setCurrentTripYear] = useState<string>('');
  const [_currentTripJourneys, setCurrentTripJourneys] = useState<Journey[]>(
    [],
  );

  if (create !== true) {
    const { data: tripResult, isLoading: isLoadingTrip } = useQuery({
      queryKey: ['trips', `trip_${tripId}`],
      queryFn: () => getTrip(tripId!),
    });

    useEffect(() => {
      if (isLoadingTrip) {
        dispatch(startLoading(LOADING_PROCESSES.GETTING_TRIP));
      } else {
        if (tripResult != null) {
          setCurrentTripName(tripResult.trip.info.name || '');
          setCurrentTripYear(tripResult.trip.info.year ?? '');
          setCurrentTripJourneys(tripResult.trip.journeys);
        }
        dispatch(stopLoading(LOADING_PROCESSES.GETTING_TRIP));
      }
    }, [tripResult, isLoadingTrip]);
  }

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
