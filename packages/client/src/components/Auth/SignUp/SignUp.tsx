import '../Auth.css';
import { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { startLoading, stopLoading } from '../../../store/slices/loading';
import { useNavigate } from 'react-router';
import { createUser, getNonceKey } from '../../../api/signup';
import { clearSession } from '../../../store/slices/session';
import { isValid } from '../../../utils/form';
import Disclamer from '../../utils/Disclamer/Disclamer';

const LOADING_PROCESSES = {
  SIGNUP: 'signup',
};

function SignUp() {
  const navigate = useNavigate();
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
        localStorage.clear();
        void navigate('/', { state: { signUpResult: result } });
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
    dispatch(stopLoading(LOADING_PROCESSES.SIGNUP));
  };

  return (
    <div className="initialScreen">
      <form
        className="loginForm"
        onSubmit={e => {
          e.preventDefault();
          signUp()
            .then(() => ({}))
            .catch(console.error);
        }}
      >
        <h2 style={{ marginBottom: '30px' }}>Become a member!</h2>

        <Disclamer message={message} />

        <div className="formRow">
          <div className="formCol">
            <label htmlFor="firstName" className="formLabel">
              First name
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
              Last name
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
        <button
          type="submit"
          className="loginButton"
          disabled={!isValid({ email, password, firstName, lastName })}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
