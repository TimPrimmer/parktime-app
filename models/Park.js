const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');


// create our Park model
class Park extends Model { }

// create fields/columns for Park model
Park.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    park_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    park_code: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT, 
      allowNull: false
    },
    image: {
      type: DataTypes.TEXT, 
      allowNull: false
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: false,
    modelName: 'park'
  }
);

module.exports = Park;
