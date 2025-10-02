import { getLogger, Logger } from 'log4js';
import { environment } from '../env/environment';

export const logger: Logger = getLogger();
logger.level = `${environment.LOGGER_LEVEL}`;
