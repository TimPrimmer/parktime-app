const router = require('express').Router();

router.get('/', (req, res) => {
  res.render("parks");
});

module.exports = router;
