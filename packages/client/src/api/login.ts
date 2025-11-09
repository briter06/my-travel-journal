import axios from 'axios';
import { environment } from '../env/environment';
import { genHmac } from '../crypto/hmac';
import { Me } from '../store/slices/session';

type NonceResult = { nonce: string };

export const getNonce = async (): Promise<NonceResult | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/crypto/nonce`);
    return result.data as NonceResult;
  } catch (err) {
    return null;
  }
};

export const loginUser = async (
  email: string,
  password: string,
  nonce: string,
) => {
  try {
    const hmac = await genHmac(email, password, nonce);
    const result = await axios.post(
      `${environment.apiUrl}/auth/login/${nonce}`,
      {
        email,
        password: hmac,
      },
    );
    localStorage.setItem('token', result.data.token);
    return null;
  } catch (err) {
    return {
      status: false,
      message: 'Email or password are incorrect',
    };
  }
};

export const getMe = async (): Promise<Me | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return result.data.error != null ? null : (result.data as Me);
  } catch (err) {
    return null;
  }
};
