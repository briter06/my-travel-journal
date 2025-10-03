import './App.css';
import { useEffect, useState } from 'react';
import { getNonce, loginUser } from '../../api/login';
import Loading from '../Loading/Loading';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading } from '../../store/slices/loading';
import MainScreen from '../MainScreen/MainScreen';
import { setIsLoggedIn } from '../../store/slices/session';
import { createUser, getNonceKey } from '../../api/signup';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{
    error: boolean;
    message: string;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isLoggedIn = useAppSelector(state => state.session.isLoggedIn);

  const dispatch = useAppDispatch();

  const isValid = () => {
    return username.length > 3 && username.length <= 30 && password.length > 3;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token != null) {
      dispatch(setIsLoggedIn(true));
    }
    dispatch(setLoading(false));
    setIsReady(true);
  }, []);

  const login = async () => {
    setMessage(null);
    dispatch(setLoading(true));
    const nonce = await getNonce();
    if (nonce != null) {
      const result = await loginUser(username, password, nonce.nonce);
      if (result == null) {
        setUsername('');
        setPassword('');
        dispatch(setIsLoggedIn(true));
      } else {
        setMessage({
          error: !result.status,
          message: result.message,
        });
      }
    } else {
      setMessage({
        error: true,
        message: 'There was a problem. Please try again.',
      });
    }
    dispatch(setLoading(false));
  };

  const signUp = async () => {
    setMessage(null);
    dispatch(setLoading(true));
    const nonce = await getNonceKey();
    if (nonce != null) {
      const result = await createUser(
        username,
        password,
        nonce.publicKey,
        nonce.nonce,
      );
      if (result.status) {
        setUsername('');
        setPassword('');
      }
      setMessage({
        error: !result.status,
        message: result.message,
      });
    } else {
      setMessage({
        error: true,
        message: 'There was a problem. Please try again.',
      });
    }
    dispatch(setLoading(false));
  };

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
                login()
                  .then(() => ({}))
                  .catch(console.error);
              }}
            >
              {/* Message */}
              {message != null && (
                <div
                  style={{
                    color: message.error ? 'red' : 'green',
                    marginBottom: '10px',
                  }}
                >
                  {message.message}
                </div>
              )}
              <label htmlFor="username" className="formLabel">
                Enter your username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="formInput"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <label htmlFor="password" className="formLabel">
                Enter your password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="formInput"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="loginButton"
                disabled={!isValid()}
              >
                Log In
              </button>
              <button
                type="button"
                className="loginButton"
                onClick={() => {
                  signUp()
                    .then(() => ({}))
                    .catch(console.error);
                }}
                disabled={!isValid()}
              >
                Sign Up
              </button>
            </form>
          </div>
        )
      ) : null}
    </div>
  );
}

export default App;
