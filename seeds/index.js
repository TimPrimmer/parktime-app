const sequelize = require("../config/connection");

const seedParks = require("./park-seeds");
const seedUsers = require("./user-seeds");
const seedSavedParks = require("./saved-parks-seeds");
const seedComments = require("./comments");

const seedAll = async () => {
  await sequelize.sync({ force: true });

  console.log("--------------");
  await seedParks();

  console.log("--------------");
  await seedUsers();

  console.log("--------------");
  await seedSavedParks();

  console.log("--------------");
  await seedComments();

  process.exit(0);
};

seedAll();
