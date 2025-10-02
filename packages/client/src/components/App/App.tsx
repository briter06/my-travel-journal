import './App.css';
import { useEffect, useState } from 'react';
import { login } from '../../api/login';
import Loading from '../Loading/Loading';
import { handlePromiseError } from '../../utils/promises';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading } from '../../store/slices/loading';
import MainScreen from '../MainScreen/MainScreen';
import { setIsLoggedIn } from '../../store/slices/session';

function App() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const isLoggedIn = useAppSelector(state => state.session.isLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token != null) {
      dispatch(setIsLoggedIn(true));
    }
    dispatch(setLoading(false));
    setIsReady(true);
  }, []);

  return (
    <div className="App">
      <Loading />
      {isReady ? (
        isLoggedIn ? (
          <MainScreen />
        ) : (
          <div className="initialScreen">
            <form
              className="loginForm"
              onSubmit={e => {
                e.preventDefault();
                dispatch(setLoading(true));
                setError('');
                login(username)
                  .then(loginResult => {
                    dispatch(setLoading(false));
                    if (loginResult) {
                      dispatch(setIsLoggedIn(true));
                    } else {
                      setError('Incorrect login');
                    }
                  })
                  .catch(handlePromiseError);
              }}
            >
              {/* Error message */}
              {error && (
                <div style={{ color: 'red', marginBottom: '10px' }}>
                  {error}
                </div>
              )}
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
                onChange={e => setUsername(e.target.value)}
              />
              <button type="submit" className="loginButton">
                Continue
              </button>
            </form>
          </div>
        )
      ) : null}
    </div>
  );
}

export default App;
