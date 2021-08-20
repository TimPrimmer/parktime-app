const router = require("express").Router();

const userRoutes = require("./user-routes.js");
const parkRoutes = require("./park-routes.js");
const commentRoutes = require("./comment-routes");
const savedparkRoutes = require("./savedparks-routes");

router.use("/users", userRoutes);
router.use("/parks", parkRoutes);
router.use("/comments", commentRoutes);
router.use("/saved", savedparkRoutes); // shorted it to saved for convinience sake

module.exports = router;
