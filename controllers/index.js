const router = require('express').Router();

const homeRoutes = require('./home-routes.js');
const apiRoutes = require('./api');
const parksRoutes = require("./parks-routes.js");

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use("/parks", parksRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;  