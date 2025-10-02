import 'dotenv/config';
import { connectSequelize } from './db/init';
import { logger } from './utils/logger';
import express from 'express';
import path from 'path';
import { apiRouter } from './api';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

const clientBuildPath = path.join(__dirname, '../../client/build');

app.use(express.static(clientBuildPath));

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

app.get('/', (_req, res) => {
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
