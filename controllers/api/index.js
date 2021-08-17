const router = require('express').Router();

//const userRoutes = require('./user-routes.js');
const parkRoutes = require('./park-routes.js');

//router.use('/users', userRoutes);
router.use('/parks', parkRoutes);

module.exports = router;
