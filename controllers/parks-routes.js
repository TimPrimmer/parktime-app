const router = require('express').Router();
// const { parks } = require("../data/parks.json");
const { getDistance } = require("../utils/distance.js");
const { Park, Saved_Parks } = require("../models");

// renders ALL parks no pagination
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
    ]
  })
    .then(dbParkData => {
      const parks = dbParkData.map(park => park.get({ plain: true }));

      for (x = 0; x < parks.length; x++) {
        parks[x].distance = 0; // setting the distance to 0 as we're accessing the page w/o any distance data
      }

      if (req.session.user_id === undefined) { // checks to see if we are not signed in
        for (x = 0; x < parks.length; x++) {
          parks[x].saved = false;
        }
        res.render("parks", {
          parks,
          loggedIn: req.session.loggedIn,
          user_id: 0,
          pagination: false
        });

      }
      else {
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
            const savedParks = dbSavedData.map(park => park.get({ plain: true }));
            for (x = 0; x < parks.length; x++) { // these two for loops check each park to each saved park for a given user id, and updates their saved property
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
              user_id: req.session.user_id,
              pagination: false
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});



// renders parks sorted by distance via given lat and lon, with pagination
router.get('/:lat/:lon/:page', (req, res) => {
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
  })
    .then(dbParkData => {
      const tempParks = dbParkData.map(park => park.get({ plain: true }));

      for (x = 0; x < tempParks.length; x++) {
        tempParks[x].distance = getDistance(req.params.lat, req.params.lon, tempParks[x].latitude, tempParks[x].longitude);
      }

      tempParks.sort((a, b) => (a.distance > b.distance) ? 1 : -1); // sorts by distance
      let pageParam = parseInt(req.params.page);
      let limit = 50;
      let startOffset = (pageParam - 1) * limit;
      let endOffset = startOffset + limit;
      const parks = tempParks.slice(startOffset, endOffset); // limits results
      let pages = Math.ceil(tempParks.length / limit);

      let lastPage = false;
      let firstPage = false;
      let pagination = true;
      
      if (pageParam === 1) {
        firstPage = true;
      }
      else if (pageParam === pages) {
        lastPage = true;
      }
      else if (pageParam < 1 || pageParam > pages) {
        res.redirect("/");
        return;
      }

      if (req.session.user_id === undefined) { // checks to see if we are not signed in
        for (x = 0; x < parks.length; x++) {
          parks[x].saved = false;
        }
        res.render("parks", {
          parks,
          loggedIn: req.session.loggedIn,
          user_id: 0,
          firstPage: firstPage,
          lastPage: lastPage,
          pagination: pagination
        });

      }
      else {
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
            const savedParks = dbSavedData.map(park => park.get({ plain: true }));
            for (x = 0; x < parks.length; x++) { // these two for loops check each park to each saved park for a given user id, and updates their saved property
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
              user_id: req.session.user_id,
              firstPage: firstPage,
              lastPage: lastPage,
              pagination: pagination
            });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
