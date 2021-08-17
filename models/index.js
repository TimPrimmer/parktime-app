// import all models
const Park = require("./Park");
const User = require("./User");
const Comment = require("./Comment");
const Categories = require("./Categories");

// create associations eventually
Park.hasMany(Categories, {
  foreignKey: "parks_id"
});

Categories.belongsTo(Park, {
  foreignKey: "parks_id"
});

module.exports = { Park, Categories };
