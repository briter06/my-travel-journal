import '../Auth.css';
import { useEffect, useState } from 'react';
import { getMe, getNonce, loginUser } from '../../../api/login';
import { useAppDispatch } from '../../../store/hooks';
import { setIsLoggedIn, setMe } from '../../../store/slices/session';
import { startLoading, stopLoading } from '../../../store/slices/loading';
import { useLocation, useNavigate } from 'react-router';

const LOADING_PROCESSES = {
  LOGIN: 'login',
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{
    error: boolean;
    message: string;
  } | null>(null);

  const dispatch = useAppDispatch();

  const isValid = () => {
    return email.length > 3 && email.length <= 30 && password.length > 3;
  };

  useEffect(() => {
    const signUpResult = location.state?.signUpResult;
    if (signUpResult != null) {
      setMessage({
        error: !signUpResult.status,
        message: signUpResult.message,
      });
    }
  }, [location.state]);

  const login = async () => {
    setMessage(null);
    dispatch(startLoading(LOADING_PROCESSES.LOGIN));
    const nonce = await getNonce();
    if (nonce != null) {
      const result = await loginUser(email, password, nonce.nonce);
      if (result == null) {
        const me = await getMe();
        if (me != null) {
          dispatch(setMe(me));
          dispatch(setIsLoggedIn(true));
        } else {
          setMessage({
            error: true,
            message: 'There was a problem. Please try again.',
          });
        }
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
    dispatch(stopLoading(LOADING_PROCESSES.LOGIN));
  };

  return (
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
        <h2 style={{ marginBottom: '30px' }}>Welcome!</h2>

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
        <label htmlFor="email" className="formLabel">
          Enter your email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          required
          className="formInput"
          value={email}
          onChange={e => setEmail(e.target.value)}
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
        <button type="submit" className="loginButton" disabled={!isValid()}>
          Log In
        </button>
        <button
          type="button"
          className="loginButton"
          onClick={() => {
            void navigate('/signup');
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Login;
