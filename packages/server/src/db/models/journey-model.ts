// journey-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';
import { LocationModel } from './location-model.js';
import { TripModel } from './trip-model.js';

export class JourneyModel extends Model {
  declare from: string;
  declare to: string | null;
  declare tripId: number;
  declare date: Date;
}

export function _Journey(sequelize: Sequelize) {
  JourneyModel.init(
    {
      from: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references: {
          model: LocationModel,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      to: {
        type: DataTypes.STRING,
        allowNull: true,
        primaryKey: true,
        references: {
          model: LocationModel,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tripId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: TripModel,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'journeys',
      timestamps: false,
    },
  );
}
