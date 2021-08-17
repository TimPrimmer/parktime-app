const router = require("express").Router();

const userRoutes = require("./user-routes.js");
const parkRoutes = require("./park-routes.js");
const commentRoutes = require("./comment-routes");

router.use("/users", userRoutes);
router.use("/parks", parkRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
