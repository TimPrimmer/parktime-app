const { User } = require('../models');



const userSql = [
  {
    username: 'TimP',
    password: 'Test123'
  },
  {
    username: 'ErinH',
    password: 'Password123'
  },
  {
    username: 'DerekB',
    password: '123tesT'
  }
];

const seedUsers = async () => {
  await User.bulkCreate(userSql);
  console.log('Users seeded!');
}

module.exports = seedUsers;

