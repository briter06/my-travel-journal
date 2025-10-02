// trip-model.ts
import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserModel extends Model {
  declare username: string;
}

export function _User(sequelize: Sequelize) {
  UserModel.init(
    {
      username: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
    },
  );
}
