import axios from 'axios';
import { environment } from '../env/environment';
import { encryptPassword, hashPassword } from '../crypto/hmac';

type NonceKeyResult = {
  nonce: string;
  publicKey: string;
};

export const getNonceKey = async (): Promise<NonceKeyResult | null> => {
  try {
    const result = await axios.get(`${environment.apiUrl}/crypto/nonce/key`);
    return result.data as NonceKeyResult;
  } catch (err) {
    return null;
  }
};

export const createUser = async (
  username: string,
  password: string,
  publicKey: string,
  nonce: string,
) => {
  try {
    const hashedPassword = await hashPassword(password);
    const encryptedPassword = await encryptPassword(publicKey, hashedPassword);
    const signUpResult = await axios.post(
      `${environment.apiUrl}/auth/signup/${nonce}`,
      {
        username: username,
        password: encryptedPassword,
      },
    );
    if (!signUpResult.data.status) {
      return {
        status: false,
        message: 'That username already exists',
      };
    } else {
      return {
        status: true,
        message: 'The user has been created. Please login',
      };
    }
  } catch (err) {
    return {
      status: false,
      message: 'There was a problem. Please try again later.',
    };
  }
};
