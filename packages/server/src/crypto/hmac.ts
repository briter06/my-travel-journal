import crypto from 'crypto';

type NonceData = {
  date: number;
  privateKey?: string;
};

const nonces: Record<string, NonceData> = {};

export const getNonce = (additionalData = {}) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  nonces[nonce] = {
    date: Date.now(),
    ...additionalData,
  };
  return nonce;
};

export const claimNonce = (nonce: string) => {
  const activeNonce = nonces[nonce];
  if (activeNonce != null) {
    delete nonces[nonce];
    return Date.now() - activeNonce.date <= 600000 ? activeNonce : null;
  }
  return null;
};

export const verifyLogin = (
  username: string,
  password: string,
  hash: string,
  nonce: string,
) => {
  const hmac_hash = crypto
    .createHmac('sha256', password)
    .update(username + nonce)
    .digest('hex');
  return claimNonce(nonce) != null && hash == hmac_hash;
};
