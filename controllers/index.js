const router = require('express').Router();

const homeRoutes = require('./home-routes.js');
const resultsRoutes = require('./results-routes.js')
//const apiRoutes = require('./api');

//router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/park-results', resultsRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;  