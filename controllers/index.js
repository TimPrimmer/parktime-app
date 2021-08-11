const router = require('express').Router();

const homeRoutes = require('./home-routes.js');
const apiRoutes = require('./api');
const resultRoutes = require("./result-routes.js");

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use("/parks", resultRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;  