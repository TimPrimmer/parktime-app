const router = require('express').Router();
const { Park, Saved_Parks, Categories } = require("../models");
const { Op } = require("sequelize");

router.get('/', (req, res) => {
  if (req.query.categories) {
    const categories = req.query.categories.split("|");
    Categories.findAll({
      where: {
        category_abbr: categories,
      }
    }).then(dbCategoryData => {
      let filteredParks = [];
      const parkCategoryCount = new Map();
      for (let i = 0; i < dbCategoryData.length; i++) {
        if (parkCategoryCount.has(dbCategoryData[i].park_id)) {
          parkCategoryCount.set(dbCategoryData[i].park_id, parkMap.get(dbCategoryData[i].park_id) + 1);
        } else {
          parkCategoryCount.set(dbCategoryData[i].park_id, 1);
        }
        if (categories.length === parkCategoryCount.get(dbCategoryData[i].park_id)) {
          filteredParks.push(dbCategoryData[i].park_id);
        }
      }
      Park.findAll({
        where: {
          id: filteredParks
        }
      }).then(dbParkData => {
        return {
          res: res,
          req: req,
          dbParkData: dbParkData
        }
      }).then(savedParks)
    })
  } else {
    Park.findAll().then(dbParkData => {
      return {
        res: res,
        req: req,
        dbParkData: dbParkData
      }
    }).then(savedParks);
  }
})

function savedParks(obj) {
  const parks = obj.dbParkData.map(park => park.get({ plain: true }));
  if (obj.req.session.user_id === undefined) { // checks to see if we are not signed in
    for (x = 0; x < parks.length; x++) {
      parks[x].saved = false;
    }
    obj.res.render("parks", {
      parks,
      loggedIn: obj.req.session.loggedIn,
      user_id: 0
    });

  }
  else {
    Saved_Parks.findAll({
      where: {
        user_id: obj.req.session.user_id,
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
        obj.res.render("parks", {
          parks,
          loggedIn: obj.req.session.loggedIn,
          user_id: obj.req.session.user_id
        });
      });
  }
}

module.exports = router;
