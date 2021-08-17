const router = require('express').Router();
const { Park, Categories } = require("../../models");

router.get('/', (req, res) => {
  // res.render("parks", {parks});
  Park.findAll({
    attributes: [
      "id",
      "park_id",
      "park_code",
      "name",
      "description",
      "state",
      "url",
      "image", 
      "latitude",
      "longitude"
    ], 
    include: [
      {
        model: Categories,
        attributes: ["category_abbr"]
      }
    ]
  })
    .then(dbParkData => res.json(dbParkData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
