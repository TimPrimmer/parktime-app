const { Saved_Parks } = require('../models');


const listSql = [
  {
    user_id: 1,
    park_id: 1
  },
  {
    user_id: 1,
    park_id: 2
  },
  {
    user_id: 1,
    park_id: 3
  },
  {
    user_id: 2,
    park_id: 56
  },
  {
    user_id: 2,
    park_id: 59
  },
  {
    user_id: 2,
    park_id: 60
  },
  {
    user_id: 3,
    park_id: 100
  },
  {
    user_id: 3,
    park_id: 200
  },
  {
    user_id: 3,
    park_id: 300
  },
  {
    user_id: 3,
    park_id: 400
  },
];

const seedSavedParks = async () => {
  await Saved_Parks.bulkCreate(listSql);
  console.log('Saved parks seeded!');
}

module.exports = seedSavedParks;

