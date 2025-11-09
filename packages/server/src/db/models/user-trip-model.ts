// trip-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';
import { TripModel } from './trip-model.js';
import { UserModel } from './user-model.js';

export class UserTripModel extends Model {
  declare email: string;
  declare tripId: string;
}

export function _UserTrip(sequelize: Sequelize) {
  UserTripModel.init(
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: UserModel,
          key: 'email',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tripId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        references: {
          model: TripModel,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'user-trip',
      timestamps: false,
    },
  );
}
