// trip-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export class TripModel extends Model {
  declare id: number;
  declare name: string;
  declare year: string | null;
}

export function _Trip(sequelize: Sequelize) {
  TripModel.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'trips',
      timestamps: true,
    },
  );
}
