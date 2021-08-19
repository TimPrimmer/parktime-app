const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Categories extends Model {}

Categories.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_abbr: {
      type: DataTypes.STRING,
      allowNull: false
    },
    park_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "park",
        key: "id",
      },
    },
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: false,
    modelName: 'categories'
  }
);

module.exports = Categories;
