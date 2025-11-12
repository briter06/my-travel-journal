import '../Auth.css';
import { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { startLoading, stopLoading } from '../../../store/slices/loading';
import { useNavigate, useParams } from 'react-router';
import { createUser, getNonceKey } from '../../../api/signup';
import { clearSession } from '../../../store/slices/session';
import { isValid } from '../../../utils/form';
import Disclamer from '../../utils/Disclamer/Disclamer';
import { deleteFromStorage } from '../../../utils/storage';
import { authHomeRedirector } from '../../utils/AuthHomeRedirector/AuthHomeRedirector';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../utils/LanguageSelector/LanguageSelector';

const LOADING_PROCESSES = {
  SIGNUP: 'signup',
};

function SignUp() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { lng } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState<{
    error: boolean;
    message: string;
  } | null>(null);

  const dispatch = useAppDispatch();

  const signUp = async () => {
    setMessage(null);
    dispatch(startLoading(LOADING_PROCESSES.SIGNUP));
    const nonce = await getNonceKey();
    if (nonce != null) {
      const result = await createUser(
        { email, password, firstName, lastName },
        nonce.publicKey,
        nonce.nonce,
      );
      if (result.status) {
        dispatch(clearSession());
        deleteFromStorage('token');
        void navigate(`/${lng}/login`, { state: { signUpResult: result } });
      } else {
        setMessage({
          error: !result.status,
          message: result.message,
        });
      }
    } else {
      setMessage({
        error: true,
        message: 'general.error',
      });
    }
    dispatch(stopLoading(LOADING_PROCESSES.SIGNUP));
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
          signUp()
            .then(() => ({}))
            .catch(console.error);
        }}
      >
        <h2 style={{ marginBottom: '30px' }}>{t('auth.signup.title')}</h2>

        <Disclamer message={message} />

        <div className="formRow">
          <div className="formCol">
            <label htmlFor="firstName" className="formLabel">
              {t('auth.signup.firstNameLabel')}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="formInput"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div className="formCol">
            <label htmlFor="lastName" className="formLabel">
              {t('auth.signup.lastNameLabel')}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="formInput"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="email" className="formLabel">
          {t('auth.signup.emailLabel')}
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
          {t('auth.signup.passwordLabel')}
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
          disabled={!isValid({ email, password, firstName, lastName })}
        >
          {t('auth.signup.signupButton')}
        </button>
      </form>
    </div>,
  );
}

export default SignUp;
