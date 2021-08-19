const router = require('express').Router();
const { Park, Saved_Parks, Categories } = require("../models");
const { Op } = require("sequelize");

router.get('/', (req, res) => {
  let findAllParks;
  if (req.query.categories) {
    const categories = req.query.categories.split("|");
    let parksWithCategories = Categories.findAll({
      order: [["park_id", "ASC"]],
      where: {
        category_abbr: categories, 
      }
    })
      .then(dbParkCatData => {
        for (let i = 0; i < dbParkCatData; i++) {
          
        }
      })
    findAllParks = Park.findAll({
      include: [
        {
          model: Categories,
          required: true,
          attribtues: ["category_abbr", "park_id" ],
          where: {
            category_abbr: categories 
          }
        }
      ]
    })

  } else {
    findAllParks = Park.findAll();
  }
    findAllParks.then(dbParkData => {
      const parks = dbParkData.map(park => park.get({ plain: true }));
      if (req.session.user_id === undefined) { // checks to see if we are not signed in
        for (x = 0; x < parks.length; x++) {
          parks[x].saved = false;
        }
        res.render("parks", {
          parks,
          loggedIn: req.session.loggedIn,
          user_id: 0
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
              user_id: req.session.user_id
            });
          });
      }
    })
  })

module.exports = router;
