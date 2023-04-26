'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserOutput extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserOutput.belongsTo(models.SketchInfo, {
        foreignKey: 'sketch_id',
        onDelete: 'CASCADE',
      });
      UserOutput.belongsTo(models.UsersInfo, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
      })
    }
  }
  UserOutput.init({
    user_id: DataTypes.INTEGER,
    sketch_id: DataTypes.INTEGER,
    probability: DataTypes.REAL
  }, {
    sequelize,
    modelName: 'UserOutput',
  });
  return UserOutput;
};