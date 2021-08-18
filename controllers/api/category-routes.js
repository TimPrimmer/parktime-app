const router = require('express').Router();
const { Categories } = require("../../models");

router.get('/', (req, res) => {
  Categories.findAll()
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
