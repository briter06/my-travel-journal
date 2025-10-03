import express from 'express';
import { getNonce } from '../crypto/hmac.js';
import { logger } from '../utils/logger.js';
import { generateRSAKeys } from '../crypto/rsa.js';

export const cryptoRouter = express.Router();

cryptoRouter.get('/nonce', (_, res) => {
  const nonce = getNonce();
  logger.info(`Generated nonce ${nonce}`);
  res.json({ nonce });
});

cryptoRouter.get('/nonce/key', (_, res) => {
  const { publicKey, privateKey } = generateRSAKeys();
  const nonce = getNonce({ privateKey });
  logger.info(`Generated nonce ${nonce} with public key`);
  res.json({ nonce, publicKey });
});
