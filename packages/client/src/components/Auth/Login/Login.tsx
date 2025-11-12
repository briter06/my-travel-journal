import '../Auth.css';
import { useEffect, useState } from 'react';
import { getNonce, loginUser } from '../../../api/login';
import { useAppDispatch } from '../../../store/hooks';
import { startLoading, stopLoading } from '../../../store/slices/loading';
import { useLocation, useNavigate } from 'react-router';
import { isValid } from '../../../utils/form';
import Disclamer from '../../utils/Disclamer/Disclamer';
import { authHomeRedirector } from '../../utils/AuthHomeRedirector/AuthHomeRedirector';
import { setInStorage } from '../../../utils/storage';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../utils/LanguageSelector/LanguageSelector';

const LOADING_PROCESSES = {
  LOGIN: 'login',
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{
    error: boolean;
    message: string;
  } | null>(null);

  const dispatch = useAppDispatch();

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
      if (result.token != null) {
        setInStorage('token', result.token);
        void navigate(`/`, { replace: true });
      } else {
        setMessage({
          error: true,
          message: result.message,
        });
      }
    } else {
      setMessage({
        error: true,
        message: 'general.error',
      });
    }
    dispatch(stopLoading(LOADING_PROCESSES.LOGIN));
  };

  return authHomeRedirector(
    <div className="initialScreen" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <LanguageSelector />
      </div>
      <form
        className="loginForm"
        onSubmit={e => {
          e.preventDefault();
          login()
            .then(() => ({}))
            .catch(console.error);
        }}
      >
        <h2 style={{ marginBottom: '30px' }}>{t('auth.login.title')}</h2>

        <Disclamer message={message} />

        <label htmlFor="email" className="formLabel">
          {t('auth.login.emailLabel')}
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
          {t('auth.login.passwordLabel')}
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
          disabled={!isValid({ email, password })}
        >
          {t('auth.login.loginButton')}
        </button>
        <button
          type="button"
          className="loginButton"
          onClick={() => {
            void navigate(`../signup`);
          }}
        >
          {t('auth.login.signupButton')}
        </button>
      </form>
    </div>,
  );
}

export default Login;
