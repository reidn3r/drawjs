const sequelize = require('../config/dbConfig')
const { DataTypes } = require('sequelize');

const SketchInfo = sequelize.define('sketch_info', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  label: {
    type: DataTypes.STRING,
    allowNull: false
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
  }, {tableName: "SketchInfos"}
);

module.exports = SketchInfo;