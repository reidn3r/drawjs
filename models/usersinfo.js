'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsersInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsersInfo.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    lastTimeVisited: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UsersInfo',
  });
  return UsersInfo;
};