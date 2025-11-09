import './AccountTrip.css';
import { useQuery } from '@tanstack/react-query';
import { getTrip } from '../../../../../api/trips';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../../store/hooks';
import { startLoading, stopLoading } from '../../../../../store/slices/loading';
import { useNavigate, useParams } from 'react-router';
import { Journey, Place, Trip } from '@my-travel-journal/common';

const LOADING_PROCESSES = {
  GETTING_TRIP: 'accountGettingTrip',
};

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
  const [currentTripMonth, setCurrentTripMonth] = useState<string>('');
  const [currentTripPlaces, setCurrentTripPlaces] = useState<
    Record<number, Place>
  >({});
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
          console.log(typeof tripResult.trip.info.date);
          setOriginalTrip(tripResult.trip);
          setCurrentTripId(tripResult.trip.info.id);
          setCurrentTripName(tripResult.trip.info.name || '');
          setCurrentTripYear(
            tripResult.trip.info.date != null
              ? new Date(tripResult.trip.info.date).getFullYear().toString()
              : '',
          );
          setCurrentTripMonth(
            tripResult.trip.info.date != null
              ? (new Date(tripResult.trip.info.date).getMonth() + 1).toString()
              : '',
          );
          setCurrentTripPlaces(tripResult.trip.places);
          setCurrentTripJourneys(tripResult.trip.journeys);
        }
        setShouldWait(false);
        dispatch(stopLoading(LOADING_PROCESSES.GETTING_TRIP));
      }
    }, [tripResult, isLoading]);
  }

  // month / year helpers for the date selector
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const years: number[] = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1900; y--) {
    years.push(y);
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
            value={currentTripMonth}
            onChange={e => {
              setCurrentTripMonth(e.target.value);
            }}
            aria-label="Month"
          >
            <option value="">—</option>
            {months.map((m, i) => (
              <option key={i + 1} value={(i + 1).toString()}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="trip-date-select"
            value={currentTripYear}
            onChange={e => {
              setCurrentTripYear(e.target.value);
            }}
            aria-label="Year"
          >
            <option value="">—</option>
            {years.map(y => (
              <option key={y} value={y.toString()}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="trip-editor-actions">
        {create ? null : (
          <button type="button" className="btn cancel">
            Cancel
          </button>
        )}
        <button type="button" className="btn primary">
          {create ? 'Create' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default AccountTrip;
