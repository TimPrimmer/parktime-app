// import all models
const Park = require("./Park");
const User = require("./User");
const Comment = require("./Comment");
const Categories = require("./Categories");
const Saved_Parks = require("./Saved-Parks");

// create associations eventually
Park.hasMany(Categories, {
  foreignKey: "park_id"
});

Categories.belongsTo(Park, {
  foreignKey: "park_id"
});

Saved_Parks.belongsTo(Park, {
  foreignKey: "park_id"
});

Saved_Parks.belongsTo(User, {
  foreignKey: "user_id"
});

module.exports = { Park, Categories, Comment, User, Saved_Parks};
