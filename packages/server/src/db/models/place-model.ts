// place-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';
import { TripModel } from './trip-model.js';

export class PlaceModel extends Model {
  declare id: number;
  declare name: string | null;
  declare city: string;
  declare country: string;
  declare latitude: number;
  declare longitude: number;
  declare description: string | null;
  declare tripId: number;
}

export function _Place(sequelize: Sequelize) {
  PlaceModel.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
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
    },
    {
      sequelize,
      tableName: 'places',
      timestamps: false,
    },
  );
}
