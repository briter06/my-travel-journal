import './App.css';
import { useEffect, useState } from 'react';
import { getMe } from '../../api/login';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setIsLoggedIn, setMe } from '../../store/slices/session';
import { useQuery } from '@tanstack/react-query';
import { startLoading, stopLoading } from '../../store/slices/loading';
import Loading from '../utils/Loading/Loading';
import NavigationLayout from '../NavigationLayout/NavigationLayout';
import { Outlet, useLocation, useMatches, useNavigate } from 'react-router';
import Login from '../Auth/Login/Login';

const LOADING_PROCESSES = {
  GETTING_ME: 'gettingMe',
  SIGNUP: 'signup',
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch.handle as { isPublicRoute?: boolean } | undefined;

  const resetLocation = () => {
    if (handle?.isPublicRoute !== true && location.pathname !== '/') {
      void navigate('/');
    }
  };

  const hasToken = localStorage.getItem('token') != null;
  const [isReady, setIsReady] = useState(!hasToken);
  const isLoggedIn = useAppSelector(state => state.session.isLoggedIn);

  const dispatch = useAppDispatch();

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: hasToken,
  });

  useEffect(() => {
    if (hasToken) {
      if (isLoading) {
        dispatch(startLoading(LOADING_PROCESSES.GETTING_ME));
      } else {
        if (me != null) {
          dispatch(setMe(me));
          dispatch(setIsLoggedIn(true));
        } else {
          dispatch(setIsLoggedIn(false));
          localStorage.removeItem('token');
          resetLocation();
        }
        dispatch(stopLoading(LOADING_PROCESSES.GETTING_ME));
        setIsReady(true);
      }
    } else {
      resetLocation();
    }
  }, [navigate, location.pathname, me, isLoading]);

  return (
    <div className="App">
      {isReady ? isLoggedIn ? <NavigationLayout /> : <Login /> : null}
    </div>
  );
}

export default App;
