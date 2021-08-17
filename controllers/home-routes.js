const router = require('express').Router();
const { Saved_Parks, Park } = require("../models");

router.get('/', (req, res) => {
  res.render("homepage", {
    loggedIn: req.session.loggedIn
  });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/saved_list", (req, res) => {

  if (req.session.user_id === undefined) { // checks to see if we're logged in or not
    res.redirect("/");
    return;
  }

  Saved_Parks.findAll({
    where: {
      user_id: req.session.user_id,
    },
    include: {
      model: Park,
    },
    order: [
      ['user_id', 'ASC'],
      ['park_id', 'ASC']
    ]
  })
    .then((dbSavedData) => {

      const filteredParks = dbSavedData.map(park => park.get({ plain: true }));
      let parks = [];
      filteredParks.forEach((element) => {
        parks.push(element.park);
      });

      if (parks.length > 1) {
        res.render("saved", {
          parks,
          loggedIn: req.session.loggedIn
        });
      }

    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

});

module.exports = router;
