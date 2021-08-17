const router = require('express').Router();
const { Categories, Park } = require("../../models");

router.get('/', (req, res) => {
  // res.render("parks", {parks});
  Categories.findAll({
    attributes: [
      "id",
      "name",
      "category_abbr"
    ]
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
