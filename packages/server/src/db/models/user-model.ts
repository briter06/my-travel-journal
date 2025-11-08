// trip-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserModel extends Model {
  declare username: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare lastRefreshTrigger: string;
}

export function _User(sequelize: Sequelize) {
  UserModel.init(
    {
      username: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastRefreshTrigger: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
    },
  );
}
