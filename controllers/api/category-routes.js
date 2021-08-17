const router = require('express').Router();
const { Categories, Park } = require("../../models");

router.get('/', (req, res) => {
  // res.render("parks", {parks});
  Categories.findAll({
    attributes: [
      "id",
      "category_abbr"
    ], 
    include: [
      {
        model: Park,
        attributes: ["name"]
      }
    ]
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
