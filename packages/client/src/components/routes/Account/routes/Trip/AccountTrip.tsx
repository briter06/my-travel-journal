import './AccountTrip.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTrip,
  getTrip,
  TripAPIData,
  updateTrip,
} from '../../../../../api/trips';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../../store/hooks';
import {
  isLoading,
  startLoading,
  stopLoading,
} from '../../../../../store/slices/loading';
import { useNavigate, useParams } from 'react-router';
import { Journey, Locations } from '@my-travel-journal/common';
import PaginatedTable from '../../../../utils/PaginatedTable/PaginatedTable';
import SelectAutoComplete from '../../../../utils/SelectAutoComplete/SelectAutoComplete';
import CreatePlacePopup from './Popup/CreatePlacePopup/CreatePlacePopup';
import { getMyLocations } from '../../../../../api/locations';
import Disclamer from '../../../../utils/Disclamer/Disclamer';
import DeleteTripPopup from './Popup/DeleteTripPopup/DeleteTripPopup';

const LOADING_PROCESSES = {
  GETTING_TRIP: 'accountGettingTrip',
  GETTING_LOCATIONS: 'accountGettingLocations',
  MUTATING_TRIP: 'accountMutatingTrip',
};

const YEARS: number[] = [];
for (let y = new Date().getFullYear(); y >= 1900; y--) {
  YEARS.push(y);
}

type AccountTripProps = {
  create?: boolean;
};

const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TripAPIData) => createTrip(payload),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['trips'],
        exact: false,
      });
    },
  });
};

const useUpdateTrip = (tripId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TripAPIData) => updateTrip(tripId, payload),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['trips'],
        exact: false,
      });
    },
  });
};

function AccountTrip({ create }: AccountTripProps) {
  const { tripId } = useParams();
  if (!create && (tripId == null || Number.isInteger(tripId))) return null;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [allLocations, setAllLocations] = useState<Locations>({});

  const [currentTripName, setCurrentTripName] = useState<string>('');
  const [currentTripYear, setCurrentTripYear] = useState<string>('');
  const [currentTripJourneys, setCurrentTripJourneys] = useState<Journey[]>([]);

  const [createDeleteModal, setCreateDeleteModal] = useState<boolean>(false);
  const [createLocationModalJourney, setCreateLocationModalJourney] = useState<{
    idx: number;
    key: 'from' | 'to';
  } | null>(null);

  const [message, setMessage] = useState<{
    error: boolean;
    message: string;
  } | null>(null);

  const tripMutator = create ? useCreateTrip() : useUpdateTrip(Number(tripId));

  const mutateTrip = async (data: TripAPIData) => {
    dispatch(startLoading(LOADING_PROCESSES.MUTATING_TRIP));
    const result = await tripMutator.mutateAsync(data);
    if (result != null) {
      void navigate(`..`);
    } else {
      setMessage({
        error: true,
        message: `An error occurred while ${create ? 'creating' : 'updating'} the trip. Please try again!`,
      });
    }
    dispatch(stopLoading(LOADING_PROCESSES.MUTATING_TRIP));
  };

  const isValid = () => {
    if (currentTripName.trim() === '') return false;
    for (const j of currentTripJourneys) {
      if (j.from.trim() === '') return false;
      if (j.to != null && j.to.trim() === '') return false;
      if (j.date.trim() === '') return false;
    }
    return true;
  };

  const { data: tripResult, isLoading: isLoadingTrip } = useQuery({
    queryKey: [
      'trips',
      'trip_individual',
      `trip_individual_${create ? 'new' : tripId}`,
    ],
    queryFn: () => getTrip(tripId!, false),
    enabled: !create,
  });

  const { data: locationsResult, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['my_locations'],
    queryFn: () => getMyLocations(),
  });

  useEffect(() => {
    if (isLoadingTrip) {
      dispatch(startLoading(LOADING_PROCESSES.GETTING_TRIP));
    } else {
      if (tripResult != null) {
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

  useEffect(() => {
    if (isLoadingLocations) {
      dispatch(startLoading(LOADING_PROCESSES.GETTING_LOCATIONS));
    } else {
      if (locationsResult != null) {
        setAllLocations(locationsResult.locations);
      }
      dispatch(stopLoading(LOADING_PROCESSES.GETTING_LOCATIONS));
    }
  }, [locationsResult, isLoadingLocations]);

  const locationOptions = Object.entries(allLocations).map(([id, place]) => ({
    id,
    label: `${place.country}, ${place.locality}${place.name != null ? `, ${place.name}` : ''}`,
  }));

  return isLoading() ? null : (
    <div className="account-trip-editor">
      <Disclamer message={message} />
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
                { from: '', to: '', date: '' },
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
                <SelectAutoComplete<string>
                  options={locationOptions}
                  value={journey.from}
                  onChange={id =>
                    setCurrentTripJourneys(prev =>
                      prev.map((j, i) =>
                        i === idx ? { ...j, from: id == null ? '' : id } : j,
                      ),
                    )
                  }
                  noMatch={{
                    node: () => (
                      <div>
                        <div className="sac-no-match">Create location</div>
                      </div>
                    ),
                    callback: () => {
                      setCreateLocationModalJourney({ idx, key: 'from' });
                    },
                  }}
                />
              </div>
              <div className="journey-col">
                <SelectAutoComplete<string>
                  options={locationOptions}
                  value={journey.to}
                  generateCustomId={() => ''}
                  onChange={locationId =>
                    setCurrentTripJourneys(prev =>
                      prev.map((j, i) =>
                        i === idx ? { ...j, to: locationId } : j,
                      ),
                    )
                  }
                  noMatch={{
                    node: () => (
                      <div>
                        <div className="sac-no-match">Create location</div>
                      </div>
                    ),
                    callback: () => {
                      setCreateLocationModalJourney({ idx, key: 'to' });
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
                      prev.map((j, i) =>
                        i === idx
                          ? { ...j, date: new Date(v).toISOString() }
                          : j,
                      ),
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

      {createLocationModalJourney != null ? (
        <CreatePlacePopup
          onClose={() => setCreateLocationModalJourney(null)}
          onSave={(locationId: string) => {
            setCurrentTripJourneys(prev =>
              prev.map((j, i) =>
                i === createLocationModalJourney.idx
                  ? { ...j, [createLocationModalJourney.key]: locationId }
                  : j,
              ),
            );
            setCreateLocationModalJourney(null);
          }}
        />
      ) : null}

      {createDeleteModal ? (
        <DeleteTripPopup
          tripId={Number(tripId)}
          onClose={() => setCreateDeleteModal(false)}
          onConfirm={() => {
            void navigate('..');
          }}
        />
      ) : null}

      <div className="trip-editor-actions">
        <button
          type="button"
          className="btn delete"
          onClick={() => {
            setCreateDeleteModal(true);
          }}
        >
          Delete
        </button>
        <button
          type="button"
          className="btn cancel"
          onClick={() => {
            void navigate('..');
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn primary"
          disabled={!isValid()}
          onClick={() =>
            void mutateTrip({
              name: currentTripName,
              year: currentTripYear === '' ? null : Number(currentTripYear),
              journeys: currentTripJourneys,
            })
          }
        >
          {create ? 'Create' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default AccountTrip;
