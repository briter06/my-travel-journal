import '../Popup.css';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectAutoComplete from '../../../../../../utils/SelectAutoComplete/SelectAutoComplete';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createLocation,
  getMyCountries,
  LOCATION_API_TYPES,
  LocationAPIData,
} from '../../../../../../../api/locations';
import { extractGoogleMapsCoords } from '../../../../../../../utils/coordinates';
import { handlePromiseError } from '../../../../../../../utils/promises';
import Disclamer from '../../../../../../utils/Disclamer/Disclamer';

type Props = {
  onClose: () => void;
  onSave: (locationId: string) => void;
};

const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['my_locations'],
        exact: false,
      });
    },
  });
};

export default function CreatePlacePopup({ onClose, onSave }: Props) {
  const { t } = useTranslation();
  const [country, setCountry] = useState<string | null>(null);
  const [locality, setLocality] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [mapsUrl, setMapsUrl] = useState<string | null>(null);
  const [manualCoords, setManualCoords] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    error: boolean;
    message: string;
  } | null>(null);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const locationMutator = useCreateLocation();

  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ['myCountries'],
    queryFn: getMyCountries,
    refetchOnMount: 'always',
  });

  const saveLocation = async (data: LocationAPIData) => {
    setIsCreating(true);
    const result = await locationMutator.mutateAsync(data);
    if (result != null) {
      onSave(result.id);
    } else {
      setMessage({
        error: true,
        message: t('createPlace.error.createFailed'),
      });
      setIsCreating(false);
    }
  };

  const handleCreate = async () => {
    if (country == null || locality == null) return;
    if (manualCoords) {
      if (latitude != null && longitude != null) {
        await saveLocation({
          country,
          locality,
          name,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          type: LOCATION_API_TYPES.MANUAL,
        });
      }
    } else {
      if (mapsUrl != null) {
        const coords = extractGoogleMapsCoords(mapsUrl);
        if (coords != null) {
          await saveLocation({
            country,
            locality,
            name,
            latitude: coords.lat,
            longitude: coords.lng,
            type: LOCATION_API_TYPES.MANUAL,
          });
        } else {
          setMessage({
            error: true,
            message: t('createPlace.error.invalidMapsUrl'),
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!isLoadingCountries && countries != null) {
      setAllCountries(countries.countries);
    }
  }, [countries, isLoadingCountries]);

  return (
    <div className="sac-modal-overlay">
      <div className="sac-modal">
        <Disclamer message={message} />
        <h3 style={{ marginTop: 0 }}>{t('createPlace.title')}</h3>

        <div style={{ display: 'grid', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>
              {t('createPlace.label.country')}
            </label>
            <SelectAutoComplete<string>
              disabled={allCountries == null}
              placeholder=""
              generateCustomId={query => query}
              options={allCountries.map(c => ({ id: c, label: c }))}
              value={country}
              onChange={v => setCountry(v)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>
              {t('createPlace.label.locality')}
            </label>
            <input
              className="sac-input"
              type="text"
              value={locality ?? ''}
              onChange={e =>
                setLocality(e.target.value === '' ? null : e.target.value)
              }
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>
              {t('createPlace.label.name')}
            </label>
            <input
              className="sac-input"
              type="text"
              value={name ?? ''}
              onChange={e =>
                setName(e.target.value === '' ? null : e.target.value)
              }
            />
          </div>

          {manualCoords ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{ display: 'block', fontSize: 13, marginBottom: 6 }}
                >
                  {t('createPlace.label.latitude')}
                </label>
                <input
                  className="sac-input"
                  type="text"
                  value={latitude ?? ''}
                  onChange={e =>
                    setLatitude(e.target.value === '' ? null : e.target.value)
                  }
                />
              </div>

              <div style={{ flex: 1 }}>
                <label
                  style={{ display: 'block', fontSize: 13, marginBottom: 6 }}
                >
                  {t('createPlace.label.longitude')}
                </label>
                <input
                  className="sac-input"
                  type="text"
                  value={longitude ?? ''}
                  onChange={e =>
                    setLongitude(e.target.value === '' ? null : e.target.value)
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              <label
                style={{ display: 'block', fontSize: 13, marginBottom: 6 }}
              >
                {t('createPlace.label.mapsUrl')}
              </label>
              <input
                className="sac-input"
                type="text"
                value={mapsUrl ?? ''}
                onChange={e =>
                  setMapsUrl(e.target.value === '' ? null : e.target.value)
                }
              />
            </div>
          )}

          {/* checkbox moved below the field and left-aligned */}
          <div style={{ marginTop: 6, textAlign: 'left' }}>
            <label
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <input
                type="checkbox"
                checked={manualCoords}
                onChange={e => {
                  const v = e.target.checked;
                  setManualCoords(v);
                  if (v) {
                    setMapsUrl(null);
                  } else {
                    setLatitude(null);
                    setLongitude(null);
                  }
                }}
              />
              <span>{t('createPlace.manualCoordsToggle')}</span>
            </label>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            marginTop: 12,
          }}
        >
          <button
            type="button"
            className="btn cancel"
            onClick={() => {
              onClose();
            }}
          >
            {t('createPlace.button.cancel')}
          </button>

          <button
            type="button"
            className="btn primary"
            disabled={
              isCreating ||
              country == null ||
              locality == null ||
              (manualCoords
                ? latitude == null || longitude == null
                : mapsUrl == null)
            }
            onClick={() => void handleCreate().catch(handlePromiseError)}
          >
            {isCreating
              ? t('createPlace.button.creating')
              : t('createPlace.button.create')}
          </button>
        </div>
      </div>
    </div>
  );
}
