// trip-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export class TripModel extends Model {
  declare id: number;
  declare name: string;
  declare date: Date | null;
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
      date: {
        type: DataTypes.DATE,
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
