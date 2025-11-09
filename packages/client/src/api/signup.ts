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
  } catch (_err) {
    return null;
  }
};

export const createUser = async (
  user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  },
  publicKey: string,
  nonce: string,
) => {
  try {
    const hashedPassword = await hashPassword(user.password);
    const encryptedPassword = await encryptPassword(publicKey, hashedPassword);
    const signUpResult = await axios.post(
      `${environment.apiUrl}/auth/signup/${nonce}`,
      {
        email: user.email,
        password: encryptedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    );
    if (!signUpResult.data.status) {
      return {
        status: false,
        message: 'That email is already associated with an account',
      };
    } else {
      return {
        status: true,
        message: 'The user has been created. Please login',
      };
    }
  } catch (_err) {
    return {
      status: false,
      message: 'There was a problem. Please try again later.',
    };
  }
};
