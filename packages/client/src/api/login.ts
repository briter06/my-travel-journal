import axios from 'axios';
import { environment } from '../env/environment';
import { genHmac } from '../crypto/hmac';

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
  username: string,
  password: string,
  nonce: string,
) => {
  try {
    const hmac = await genHmac(username, password, nonce);
    const result = await axios.post(
      `${environment.apiUrl}/auth/login/${nonce}`,
      {
        username,
        password: hmac,
      },
    );
    localStorage.setItem('token', result.data.token);
    return null;
  } catch (err) {
    return {
      status: false,
      message: 'Username or password are incorrect',
    };
  }
};
