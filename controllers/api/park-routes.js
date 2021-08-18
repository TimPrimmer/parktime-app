const router = require("express").Router();
const { Park, Comment } = require("../../models");

// get all parks
router.get("/", (req, res) => {
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
      "longitude",
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "user_id"],
      },
    ],
  })
    .then((dbParkData) => res.json(dbParkData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  Park.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((dbParkData) => {
      if (!dbParkData) {
        res.status(404).json({ message: "No park found with this id" });
        return;
      }
      res.json(dbParkData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
