const sequelize = require('../config/dbConfig');
const { DataTypes } = require('sequelize');

const UsersInfo = sequelize.define("users_info", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  lastTimeVisited:{
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: new Date()
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
  { tableName: "UsersInfos" }
);

module.exports = UsersInfo;