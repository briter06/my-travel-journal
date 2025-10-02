// journey-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';
import { PlaceModel } from './place-model';
import { TripModel } from './trip-model';

export class JourneyModel extends Model {
  declare from: number;
  declare to: number;
  declare tripId: number;
  declare date: Date;
}

export function _Journey(sequelize: Sequelize) {
  JourneyModel.init(
    {
      from: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: PlaceModel,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      to: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        references: {
          model: PlaceModel,
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
