// trip-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserModel extends Model {
  declare username: string;
  declare password: string;
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
