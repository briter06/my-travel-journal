import { useEffect, useState } from 'react';
import SelectAutoComplete from '../../../../../utils/SelectAutoComplete/SelectAutoComplete';
import './CreatePlacePopup.css';
import { useQuery } from '@tanstack/react-query';
import { getAllCountries } from '../../../../../../api/places';

type Props = {
  onClose: () => void;
  onSave: (data: {
    country: string;
    city: string;
    name: string | null;
  }) => void;
};

export default function CreatePlacePopup({ onClose, onSave }: Props) {
  const [country, setCountry] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  const [allCountries, setAllCountries] = useState<string[]>([]);

  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ['allCountries'],
    queryFn: getAllCountries,
    refetchOnMount: 'always',
  });

  useEffect(() => {
    if (!isLoadingCountries && countries != null) {
      setAllCountries(countries.countries);
    }
  }, [countries, isLoadingCountries]);

  return (
    <div className="sac-modal-overlay">
      <div className="sac-modal">
        <h3 style={{ marginTop: 0 }}>Create location</h3>

        <div style={{ display: 'grid', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>
              Country
            </label>
            <SelectAutoComplete<string>
              disabled={allCountries.length === 0}
              options={allCountries.map(c => ({ id: c, label: c }))}
              value={country}
              onChange={v => setCountry(v)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>
              City
            </label>
            <input
              className="sac-input"
              type="text"
              value={city ?? ''}
              onChange={e =>
                setCity(e.target.value === '' ? null : e.target.value)
              }
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>
              Name
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
            Cancel
          </button>

          <button
            type="button"
            className="btn primary"
            disabled={country == null || city == null}
            onClick={() => {
              if (country != null && city != null) {
                onSave({ country, city, name });
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
