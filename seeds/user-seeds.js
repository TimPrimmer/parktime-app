const { User } = require('../models');



const userSql = [
  {
    username: 'TimP',
    email: 'webdev1@email.com',
    password: 'Test123'
  },
  {
    username: 'ErinH',
    email: 'webdev2@email.com',
    password: 'Test123'
  },
  {
    username: 'DerekB',
    email: 'webdev3@email.com',
    password: 'Test123'
  }
];

const seedUsers = async () => {
  await User.bulkCreate(userSql, {individualHooks: true});
  console.log('Users seeded!');
}

module.exports = seedUsers;

