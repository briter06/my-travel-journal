import 'dotenv/config';
import { connectSequelize } from './db/init.js';
import { logger } from './utils/logger.js';
import express from 'express';
import path from 'path';
import { apiRouter } from './api.js';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3000;

// Get __filename equivalent
const __filename = fileURLToPath(import.meta.url);

// Get __dirname equivalent
const __dirname = dirname(__filename);

const clientBuildPath = path.join(__dirname, '../../client/build');

app.use(express.static(clientBuildPath));

app.use(helmet());

// CORS config
const corsWhitelist = process.env.CORS_ORIGINS!.split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || corsWhitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);

// Morgan middleware
app.use(
  morgan(':method :url | Status: :status | Response time: :response-time ms', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  }),
);

app.use('/api', apiRouter);

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

connectSequelize()
  .then(() => {
    // Start server
    app.listen(port, () => {
      logger.info(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    throw err;
  });
