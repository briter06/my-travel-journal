import './Map.css';
import { Trips } from '@my-travel-journal/common';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import moment from 'moment';
import { Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getTrips } from '../../../api/trips';
import { setTrips, setTripsForMap } from '../../../store/slices/trips';
import { startLoading, stopLoading } from '../../../store/slices/loading';
import NavigationContent from '../../utils/NavigationContent/NavigationContent';
import Switch from '../../utils/Switch/Switch';
import CheckBox from '../../utils/CheckBox/CheckBox';
import MapContent from './MapContent/MapContent';
import { SIDE_BAR_BACKGROUND_COLOR } from '../../../utils/colors';

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

function Map() {
  const [colors, setColors] = useState<Record<string, string>>({});

  const isSideBarOpen = useAppSelector(state => state.navigation.isSideBarOpen);
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

  const allAreSelected = () =>
    Object.keys(stateTrips).length === Object.keys(stateTripsForMap).length;

  useEffect(() => {
    if (isLoading) {
      dispatch(startLoading(LOADING_PROCESSES.GETTING_TRIPS));
    } else {
      tripsCallback();
      dispatch(stopLoading(LOADING_PROCESSES.GETTING_TRIPS));
    }
  }, [tripsResult, isLoading]);

  return stateTrips !== null && stateTripsForMap != null ? (
    <NavigationContent
      isOpen={isSideBarOpen}
      sidebar={
        <Menu style={{ backgroundColor: SIDE_BAR_BACKGROUND_COLOR }}>
          <div
            className="sticky"
            style={{ backgroundColor: SIDE_BAR_BACKGROUND_COLOR }}
          >
            <MenuItem>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <span style={{ marginRight: '20px' }}>Show journies</span>
                <Switch
                  size={'sm'}
                  checked={showJournies}
                  onChange={() => setShowJournies(!showJournies)}
                />
              </div>
            </MenuItem>
            <hr className="my-2 border-gray-200" />
          </div>
          <MenuItem
            style={{ color: 'black', fontWeight: 'bold' }}
            onClick={() => {
              if (allAreSelected()) {
                dispatch(setTripsForMap({}));
              } else {
                dispatch(setTripsForMap({ ...stateTrips }));
              }
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <CheckBox disableClick size={'sm'} checked={allAreSelected()} />
              <span style={{ marginLeft: '5px' }}>My Trips</span>
            </div>
          </MenuItem>
          {groupByYear(stateTrips).map(({ year, groupedData }) => (
            <SubMenu label={year} key={year}>
              {Object.values(groupedData).map(trip => (
                <MenuItem
                  key={trip.info.id}
                  style={{ paddingLeft: '16px' }}
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <CheckBox
                      disableClick
                      size={'sm'}
                      checked={stateTripsForMap[trip.info.id] != null}
                    />
                    <span style={{ marginLeft: '5px' }}>{trip.info.name}</span>
                  </div>
                </MenuItem>
              ))}
            </SubMenu>
          ))}
        </Menu>
      }
      content={
        <MapContent
          trips={stateTripsForMap}
          colors={colors}
          showJournies={showJournies}
        />
      }
    />
  ) : null;
}

export default Map;
