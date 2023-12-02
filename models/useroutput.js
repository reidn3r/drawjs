// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class UserOutput extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//       UserOutput.belongsTo(models.SketchInfo, {
//         foreignKey: 'sketch_id',
//         onDelete: 'CASCADE',
//       });
//       UserOutput.belongsTo(models.UsersInfo, {
//         foreignKey: 'user_id',
//         onDelete: 'CASCADE',
//       })
//     }
//   }
//   UserOutput.init({
//     user_id: DataTypes.INTEGER,
//     sketch_id: DataTypes.INTEGER,
//     probability: DataTypes.REAL
//   }, {
//     sequelize,
//     modelName: 'UserOutput',
//   });
//   return UserOutput;
// };

const sequelize = require('../config/dbConfig');
const { DataTypes } = require('sequelize');

const UserOutput = sequelize.define("user_output", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  sketch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  sketch_id: {
    type: DataTypes.REAL,
    allowNull: false,
  },

  createdAt:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  },

  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
  }
  },
  {tableName: "UserOutputs"}
);

module.exports = UserOutput;