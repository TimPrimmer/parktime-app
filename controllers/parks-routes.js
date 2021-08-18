const router = require("express").Router();
// const { parks } = require("../data/parks.json");
const { Park, Saved_Parks, Comment, User } = require("../models");

router.get("/", (req, res) => {
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
      "longitude",
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "user_id"],

        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
        ],
      },
    ],
  })
    .then((dbParkData) => {
      const parks = dbParkData.map((park) => park.get({ plain: true }));
      if (req.session.user_id === undefined) {
        // checks to see if we are not signed in
        for (x = 0; x < parks.length; x++) {
          parks[x].saved = false;
          res.render("parks", {
            parks,
            loggedIn: req.session.loggedIn,
          });
        }
      } else {
        Saved_Parks.findAll({
          where: {
            user_id: req.session.user_id,
          },
          include: {
            model: Park,
          },
          order: [
            ["user_id", "ASC"],
            ["park_id", "ASC"],
          ],
        }).then((dbSavedData) => {
          const savedParks = dbSavedData.map((park) =>
            park.get({ plain: true })
          );
          for (x = 0; x < parks.length; x++) {
            // these two for loops check each park to each saved park for a given user id, and updates their saved property
            parks[x].saved = false;
            for (y = 0; y < savedParks.length; y++) {
              if (parks[x].id === savedParks[y].park_id) {
                parks[x].saved = true;
              }
            }
          }
          res.render("parks", {
            parks,
            loggedIn: req.session.loggedIn,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
