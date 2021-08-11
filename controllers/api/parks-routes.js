const router = require("express").Router();
const { parks } = require("../../data/parks.json");

router.get("/", (req, res) => {
  let results = parks;
  res.json(results);
});

module.exports = router;
