const router = require('express').Router();

router.get('/', (req, res) => {
  res.render("search-results");
});

module.exports = router;
