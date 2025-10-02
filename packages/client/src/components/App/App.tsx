import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Map from '../Map/Map';
import { Trips } from '@my-travel-journal/common';
import { useState } from 'react';
import chroma from 'chroma-js';
import moment from 'moment';
import { Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import NavigationLayout from '../NavigationLayout/NavigationLayout';
import { login } from '../../api/login';
import { getTrips } from '../../api/trips';

const groupByYear = (trips: Trips) => {
  const grouped: Record<string, Trips> = {};
  for (const content of Object.values(trips)) {
    const index =
      content.info.date != null
        ? moment(content.info.date).year().toString()
        : 'Other';
    if (grouped[index] == null) {
      grouped[index] = {};
    }
    grouped[index][content.info.id] = content;
  }
  const finalGrouped = Object.entries(grouped).map(([year, content]) => ({
    year,
    groupedData: content,
  }));
  finalGrouped.sort((a, b) => a.year.localeCompare(b.year));
  return finalGrouped;
};

function App() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [trips, setTrips] = useState<Trips | null>(null);
  const [tripsForMap, setTripsForMap] = useState<Trips | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [showJournies, setShowJournies] = useState<boolean>(true);

  return (
    <div className="App">
      {trips !== null && tripsForMap ? (
        <NavigationLayout
          isOpen={isOpen}
          navbar={
            <div style={{ display: 'flex' }}>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                }}
                onClick={() => setIsOpen(!isOpen)}
              >
                <i className={`bi ${isOpen ? 'bi-x' : 'bi-list'}`}></i>
              </button>
              <div
                style={{
                  textAlign: 'center',
                  width: '100%',
                  fontFamily: 'Pacifico, cursive',
                  fontSize: '1.4rem',
                }}
              >
                My Travel Journal
              </div>
            </div>
          }
          sidebar={
            <Menu>
              <SubMenu label="Trips">
                {groupByYear(trips).map(({ year, groupedData }) => (
                  <SubMenu label={year} key={year}>
                    {Object.values(groupedData).map(trip => (
                      <MenuItem
                        key={trip.info.id}
                        onClick={() => {
                          const newData = { ...tripsForMap };
                          if (tripsForMap[trip.info.id] == null) {
                            newData[trip.info.id] = trip;
                          } else {
                            delete newData[trip.info.id];
                          }
                          setTripsForMap(newData);
                        }}
                      >
                        <input
                          type="checkbox"
                          onChange={() => ({})}
                          checked={tripsForMap[trip.info.id] != null}
                          style={{
                            marginRight: '10px',
                            pointerEvents: 'none',
                          }}
                        />
                        {trip.info.name}
                      </MenuItem>
                    ))}
                  </SubMenu>
                ))}
              </SubMenu>
              <MenuItem onClick={() => setShowJournies(!showJournies)}>
                <input
                  type="checkbox"
                  onChange={() => ({})}
                  checked={showJournies}
                  style={{ marginRight: '10px', pointerEvents: 'none' }}
                />
                Show journies
              </MenuItem>
            </Menu>
          }
          content={<Map data={tripsForMap} showJournies={showJournies} />}
        ></NavigationLayout>
      ) : (
        <div className="initial-select-container">
          {/* Error message */}
          {error && (
            <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
          )}
          <form
            className="loginForm"
            onSubmit={async e => {
              e.preventDefault();
              setIsProcessing(true);
              setError('');
              const loginResult = await login(username);
              if (loginResult) {
                const trips = await getTrips();
                if (trips != null) {
                  const values = Object.values(trips);
                  const colors = chroma.scale('Set1').colors(values.length);
                  for (let i = 0; i < values.length; i++) {
                    trips[values[i].info.id].color = colors[i];
                  }
                  setTrips(trips);
                  setTripsForMap(trips);
                } else {
                  setError('Error loading trips. Try again later!');
                }
              } else {
                setError('Incorrect login');
              }
              setIsProcessing(false);
            }}
          >
            <label htmlFor="username" className="usernameLabel">
              Enter your username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="usernameInput"
              value={username}
              disabled={isProcessing}
              onChange={e => setUsername(e.target.value)}
            />
            <button
              type="submit"
              className="loginButton"
              disabled={isProcessing}
            >
              Continue
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
