import './MainScreen.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Map from '../Map/Map';
import { Trips } from '@my-travel-journal/common';
import { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import moment from 'moment';
import { Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import NavigationLayout from '../NavigationLayout/NavigationLayout';
import { getTrips } from '../../api/trips';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading } from '../../store/slices/loading';
import { setTrips, setTripsForMap } from '../../store/slices/trips';
import {
  clearSession,
  setIsLoggedIn,
  setUsername,
} from '../../store/slices/session';
import { handlePromiseError } from '../../utils/promises';

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

function MainScreen() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const stateTrips = useAppSelector(state => state.trips.trips);
  const stateTripsForMap = useAppSelector(state => state.trips.tripsForMap);
  const dispatch = useAppDispatch();

  const [showJournies, setShowJournies] = useState<boolean>(true);

  const loadTrips = async () => {
    const tripsResult = await getTrips();
    if (tripsResult != null) {
      const trips = tripsResult.trips;
      const values = Object.values(trips);
      const colors = chroma.scale('Set1').colors(values.length);
      for (let i = 0; i < values.length; i++) {
        trips[values[i].info.id].color = colors[i];
      }
      dispatch(setTrips(trips));
      dispatch(setTripsForMap(trips));
      dispatch(setUsername(tripsResult.username));
      console.log('Loaded data:', trips);
    }
  };

  useEffect(() => {
    dispatch(setLoading(true));
    loadTrips()
      .then(() => dispatch(setLoading(false)))
      .catch(handlePromiseError);
  }, []);

  return stateTrips !== null && stateTripsForMap != null ? (
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
            {groupByYear(stateTrips).map(({ year, groupedData }) => (
              <SubMenu label={year} key={year}>
                {Object.values(groupedData).map(trip => (
                  <MenuItem
                    key={trip.info.id}
                    onClick={() => {
                      const newData = { ...stateTripsForMap };
                      if (stateTripsForMap[trip.info.id] == null) {
                        newData[trip.info.id] = trip;
                      } else {
                        delete newData[trip.info.id];
                      }
                      dispatch(setTripsForMap(newData));
                    }}
                  >
                    <input
                      type="checkbox"
                      onChange={() => ({})}
                      checked={stateTripsForMap[trip.info.id] != null}
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
          <MenuItem
            onClick={() => {
              dispatch(clearSession());
              localStorage.clear();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      }
      content={<Map data={stateTripsForMap} showJournies={showJournies} />}
    ></NavigationLayout>
  ) : null;
}

export default MainScreen;
