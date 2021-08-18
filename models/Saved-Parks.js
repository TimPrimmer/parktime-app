const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

class Saved_Parks extends Model {}

Saved_Parks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
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
    modelName: "saved_parks",
  }
);

module.exports = Saved_Parks;
