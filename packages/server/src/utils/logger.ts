import { getLogger, Logger } from 'log4js';

export const logger: Logger = getLogger();
logger.level = `${process.env.LOGGER_LEVEL}`;
