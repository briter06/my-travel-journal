import { Sequelize } from 'sequelize';
import { environment } from '../env/environment';
import { logger } from '../utils/logger';
import { _Place } from './models/place-model';
import { _Journey } from './models/journey-model';
import { _Trip } from './models/trip-model';
import { _User } from './models/user-model';
import { _UserTrip } from './models/user-trip-model';

const { JAWSDB, DATABASE_MIGRATE } = environment;

export const sequelize = new Sequelize(JAWSDB, {
  dialect: 'mysql',
  logging: false,
});

// Models
_User(sequelize);
_Trip(sequelize);
_Place(sequelize);
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
