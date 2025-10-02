import log4js from 'log4js';
import { environment } from '../env/environment.js';

export const logger = log4js.getLogger();
logger.level = `${environment.LOGGER_LEVEL}`;
