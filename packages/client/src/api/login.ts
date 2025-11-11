import { genHmac } from '../crypto/hmac';
import { Me } from '../store/slices/session';
import { setInStorage } from '../utils/storage';
import { callAPI } from './helper';

type NonceResult = { nonce: string };

export const getNonce = () => callAPI<NonceResult>('GET', '/crypto/nonce');

export const loginUser = async (
  email: string,
  password: string,
  nonce: string,
) => {
  const hmac = await genHmac(email, password, nonce);
  const result = await callAPI<{ token: string }>(
    'POST',
    `/auth/login/${nonce}`,
    {
      payload: {
        email,
        password: hmac,
      },
    },
  );
  if (result == null) {
    return {
      status: false,
      message: 'Email or password are incorrect',
    };
  }
  setInStorage('token', result.token);
  return null;
};

export const getMe = () => callAPI<Me>('GET', '/auth/me');
