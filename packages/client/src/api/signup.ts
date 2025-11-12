import { encryptPassword, hashPassword } from '../crypto/hmac';
import { callAPI } from './helper';

type NonceKeyResult = {
  nonce: string;
  publicKey: string;
};

export const getNonceKey = () =>
  callAPI<NonceKeyResult>('GET', '/crypto/nonce/key');

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
    const signUpResult = await callAPI('POST', `/auth/signup/${nonce}`, {
      payload: {
        email: user.email,
        password: encryptedPassword,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    if (signUpResult == null) {
      return {
        status: false,
        message: 'auth.signup.userExists',
      };
    } else {
      return {
        status: true,
        message: 'auth.signup.success',
      };
    }
  } catch (_err) {
    return {
      status: false,
      message: 'general.error',
    };
  }
};
