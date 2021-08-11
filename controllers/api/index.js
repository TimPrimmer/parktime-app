const router = require("express").Router();

const parksRoutes = require("./parks-routes");

router.use("/parks", parksRoutes);

module.exports = router;
