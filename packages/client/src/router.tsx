import { createBrowserRouter } from 'react-router';
import Map from './components/routes/Map/Map';
import App from './components/App/App';
import Account from './components/routes/Account/Account';

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
      },
    ],
  },
  {
    path: '*',
    element: <h2>Page Not Found</h2>,
  },
]);
