const sequelize = require('../config/connection');

const seedParks = require('./park-seeds');
const seedUsers = require('./user-seeds');


const seedAll = async () => {
  await sequelize.sync({ force: true });

  console.log('--------------');
  await seedParks();
  
  console.log('--------------');
  await seedUsers();
  

  process.exit(0);
};

seedAll();


