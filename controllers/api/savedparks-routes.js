const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Saved_Parks } = require("../../models");

// returns all the saved parks
router.get("/", (req, res) => {
  Saved_Parks.findAll({})
    .then((dbSavedData) => res.json(dbSavedData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// returns the saved parks for a given user id
router.get("/:id", (req, res) => {
  Saved_Parks.findAll({
    where: {
      user_id: req.params.id,
    },
  })
    .then((dbSavedData) => res.json(dbSavedData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});



module.exports = router;
