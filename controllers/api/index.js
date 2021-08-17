const router = require("express").Router();

const parksRoutes = require("./parks-routes");
const categoryRoutes = require("./category-routes");

router.use("/parks", parksRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
