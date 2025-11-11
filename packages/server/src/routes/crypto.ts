import express from 'express';
import { getNonce } from '../crypto/hmac.js';
import { logger } from '../utils/logger.js';
import { generateRSAKeys } from '../crypto/rsa.js';
import { respond } from '../utils/response.js';

export const cryptoRouter = express.Router();

cryptoRouter.get('/nonce', (_, res) => {
  const nonce = getNonce();
  logger.info(`Generated nonce ${nonce}`);
  respond(res, { nonce });
});

cryptoRouter.get('/nonce/key', (_, res) => {
  const { publicKey, privateKey } = generateRSAKeys();
  const nonce = getNonce({ privateKey });
  logger.info(`Generated nonce ${nonce} with public key`);
  respond(res, { nonce, publicKey });
});
