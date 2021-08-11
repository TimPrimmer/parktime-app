const router = require('express').Router();
const { parks } = require("../data/parks.json");

router.get('/', (req, res) => {
  res.render("parks", {parks});
});

module.exports = router;
