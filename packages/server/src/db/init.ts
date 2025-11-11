import { Sequelize } from 'sequelize';
import { environment } from '../env/environment.js';
import { logger } from '../utils/logger.js';
import { _Journey } from './models/journey-model.js';
import { _Trip } from './models/trip-model.js';
import { _User } from './models/user-model.js';
import { _UserTrip } from './models/user-trip-model.js';
import { _Location } from './models/location-model.js';

const { JAWSDB_URL, DATABASE_MIGRATE } = environment;

export const sequelize = new Sequelize(JAWSDB_URL, {
  dialect: 'mysql',
  logging: false,
});

// Models
_User(sequelize);
_Trip(sequelize);
_Location(sequelize);
_Journey(sequelize);
_UserTrip(sequelize);

export const connectSequelize = async () => {
  await sequelize.authenticate();
  if (DATABASE_MIGRATE === 'TRUE') {
    logger.info(`Migrating models to database...`);
    await sequelize.sync({ alter: true });
    logger.info(`Migration finalized`);
  }
  logger.info(`Database started`);
};
