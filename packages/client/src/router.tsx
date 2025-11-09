import { createBrowserRouter } from 'react-router';
import Map from './components/routes/Map/Map';
import App from './components/App/App';
import Account from './components/routes/Account/Account';
import AccountGeneral from './components/routes/Account/routes/General/AccountGeneral';
import AccountMyTrips from './components/routes/Account/routes/MyTrips/AccountMyTrips';
import SignUp from './components/Auth/SignUp/SignUp';
import AccountTrip from './components/routes/Account/routes/Trip/AccountTrip';

export const createRouter = () =>
  createBrowserRouter([
    // Public routes
    {
      path: 'signup',
      element: <SignUp />,
    },
    // Main routes
    {
      path: '',
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
              children: [
                {
                  path: '',
                  element: <AccountMyTrips />,
                },
                {
                  path: 'create',
                  element: <AccountTrip create />,
                },
                {
                  path: ':tripId',
                  element: <AccountTrip />,
                },
              ],
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
