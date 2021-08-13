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
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'park'
  }
);

module.exports = Park;
