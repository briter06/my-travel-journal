import './MainScreen.css';
import Map from '../Map/Map';
import { Trips } from '@my-travel-journal/common';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import moment from 'moment';
import { Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import NavigationLayout from '../NavigationLayout/NavigationLayout';
import { getTrips } from '../../api/trips';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTrips, setTripsForMap } from '../../store/slices/trips';
import { clearSession } from '../../store/slices/session';
import { startLoading, stopLoading } from '../../store/slices/loading';
import { getInitials } from '../../utils/user';
import NavBar from '../NavBar/NavBar';

const LOADING_PROCESSES = {
  GETTING_TRIPS: 'gettingTrips',
};

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
  const [colors, setColors] = useState<Record<string, string>>({});

  const stateTrips = useAppSelector(state => state.trips.trips);
  const stateTripsForMap = useAppSelector(state => state.trips.tripsForMap);
  const dispatch = useAppDispatch();

  const [showJournies, setShowJournies] = useState<boolean>(true);

  const { data: tripsResult, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
  });

  const tripsCallback = () => {
    if (tripsResult != null) {
      const localColors: Record<string, string> = {};
      const trips = tripsResult.trips;
      const values = Object.values(trips);
      const generatedColors = chroma.scale('Set1').colors(values.length);
      for (let i = 0; i < values.length; i++) {
        localColors[values[i].info.id] = generatedColors[i];
      }
      setColors(localColors);
      dispatch(setTrips(trips));
      dispatch(setTripsForMap(trips));
      console.log('Loaded data:', trips);
    }
  };

  useEffect(() => {
    if (isLoading) {
      dispatch(startLoading(LOADING_PROCESSES.GETTING_TRIPS));
    } else {
      tripsCallback();
      dispatch(stopLoading(LOADING_PROCESSES.GETTING_TRIPS));
    }
  }, [tripsResult, isLoading]);

  return stateTrips !== null && stateTripsForMap != null ? (
    <NavigationLayout
      isOpen={isOpen}
      navbar={<NavBar isOpen={isOpen} setIsOpen={setIsOpen} />}
      sidebar={
        <Menu>
          <MenuItem onClick={() => setShowJournies(!showJournies)}>
            <input
              type="checkbox"
              onChange={() => ({})}
              checked={showJournies}
              style={{ marginRight: '10px', pointerEvents: 'none' }}
            />
            Show journies
          </MenuItem>
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
      content={
        <Map
          trips={stateTripsForMap}
          colors={colors}
          showJournies={showJournies}
        />
      }
    ></NavigationLayout>
  ) : null;
}

export default MainScreen;
