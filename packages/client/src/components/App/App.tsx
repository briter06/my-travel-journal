import './App.css';
import { useEffect } from 'react';
import { getMe } from '../../api/login';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setMe } from '../../store/slices/session';
import { useQuery } from '@tanstack/react-query';
import { startLoading, stopLoading } from '../../store/slices/loading';
import NavigationLayout from '../NavigationLayout/NavigationLayout';
import { useNavigate, useParams } from 'react-router';
import { getTrips } from '../../api/trips';
import {
  setLocations,
  setTrips,
  setTripsForMap,
} from '../../store/slices/data';
import { deleteFromStorage, getFromStorage } from '../../utils/storage';

const LOADING_PROCESSES = {
  GETTING_ME: 'gettingMe',
  GETTING_TRIPS: 'gettingTrips',
};

function App() {
  const navigate = useNavigate();
  const { lng } = useParams();

  const sendToLogin = () => {
    void navigate(`/${lng}/login`);
  };

  const hasToken = getFromStorage('token') != null;
  const stateMe = useAppSelector(state => state.session.me);

  const dispatch = useAppDispatch();

  const { data: me, isLoading: isLoadingMe } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: hasToken,
  });

  const {
    data: tripsResult,
    isLoading: isLoadingTrips,
    isFetching: isFetchingTrips,
  } = useQuery({
    queryKey: ['trips'],
    queryFn: getTrips,
    enabled: hasToken,
  });

  useEffect(() => {
    if (hasToken) {
      if (isLoadingMe) {
        dispatch(startLoading(LOADING_PROCESSES.GETTING_ME));
      } else {
        if (me != null) {
          dispatch(setMe({ ...me }));
        } else {
          deleteFromStorage('token');
          sendToLogin();
        }
        dispatch(stopLoading(LOADING_PROCESSES.GETTING_ME));
      }
    } else {
      sendToLogin();
    }
  }, [me, isLoadingMe]);

  useEffect(() => {
    if (hasToken) {
      if (isLoadingTrips || isFetchingTrips) {
        dispatch(startLoading(LOADING_PROCESSES.GETTING_TRIPS));
      } else {
        if (tripsResult != null) {
          dispatch(setTrips({ ...tripsResult.trips }));
          dispatch(setTripsForMap({}));
          dispatch(setLocations({ ...tripsResult.locations }));
        }
        dispatch(stopLoading(LOADING_PROCESSES.GETTING_TRIPS));
      }
    }
  }, [tripsResult, isLoadingTrips, isFetchingTrips]);

  return (
    <div className="App">{stateMe != null ? <NavigationLayout /> : null}</div>
  );
}

export default App;
