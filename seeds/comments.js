const { Comment } = require("../models");

const userSql = [
  {
    comment_text: "This park is great!",
    user_id: 1,
    park_id: 1,
  },
  {
    comment_text: "This park is great!",
    user_id: 2,
    park_id: 2,
  },
  {
    comment_text: "This park is great!",
    user_id: 3,
    park_id: 3,
  },
  {
    comment_text: "This park is great!",
    user_id: 1,
    park_id: 4,
  },
];

const seedComments = async () => {
  await Comment.bulkCreate(userSql, { individualHooks: true });
  console.log("Comments seeded!");
};

module.exports = seedComments;
