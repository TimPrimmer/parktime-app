const User = require("./Users");
const Comment = require("./Comment");
const Park = require("./Park");

Comment.belongTo(User);

Park.belongsToMany(User);

Park.belongsToMany(User);

User.hasMany(Park);

User.hasMany(Comment);

module.exports = { User, Comment, Park };
