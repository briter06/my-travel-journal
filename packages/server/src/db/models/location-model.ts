// place-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';
import { UserModel } from './user-model.js';

export const LOCATION_TYPES = {
  MANUAL: 1,
};

export class LocationModel extends Model {
  declare id: string;
  declare name: string | null;
  declare locality: string;
  declare country: string;
  declare latitude: number;
  declare longitude: number;
  declare type: number;
  declare owner: string;
}

export function _Location(sequelize: Sequelize) {
  LocationModel.init(
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      locality: {
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
      owner: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: true,
        references: {
          model: UserModel,
          key: 'email',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'locations',
      timestamps: false,
    },
  );
}
