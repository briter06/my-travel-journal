import { createBrowserRouter } from 'react-router';
import Map from './components/routes/Map/Map';
import App from './components/App/App';
import Account from './components/routes/Account/Account';
import AccountGeneral from './components/routes/Account/routes/General/AccountGeneral';
import AccountMyTrips from './components/routes/Account/routes/MyTrips/AccountMyTrips';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Map />,
        handle: { hasSideBar: true },
      },
      {
        path: 'account',
        element: <Account />,
        children: [
          {
            path: '',
            element: <AccountGeneral />,
          },
          {
            path: 'trips',
            element: <AccountMyTrips />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <h2>Page Not Found</h2>,
  },
]);
