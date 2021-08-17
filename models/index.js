// import all models
const Park = require('./Park');
const Categories = require("./Categories");

// create associations eventually
Park.hasMany(Categories, {
  foreignKey: "parks_id"
});

Categories.belongsTo(Park, {
  foreignKey: "parks_id"
});

module.exports = { Park, Categories };
