const router = require('express').Router();
const { getDistance } = require("../utils/distance.js");
const { Park, Saved_Parks, Comment, User, Categories } = require("../models");

// renders ALL parks no pagination
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
    Park.findAll({
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
    }).then(dbParkData => {
      return {
        res: res,
        req: req,
        dbParkData: dbParkData
      }
    })
      .then(savedParks)
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
})

// renders parks sorted by distance via given lat and lon, with pagination
router.get('/:lat/:lon/:page', (req, res) => {
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
        where: {
          id: filteredParks
        }
      }).then(dbParkData => {
        const tempParks = dbParkData.map(park => park.get({ plain: true }));

        for (x = 0; x < tempParks.length; x++) {
          tempParks[x].distance = getDistance(req.params.lat, req.params.lon, tempParks[x].latitude, tempParks[x].longitude);
        }

        tempParks.sort((a, b) => (a.distance > b.distance) ? 1 : -1); // sorts by distance
        let pageParam = parseInt(req.params.page);
        let limit = 25; // how many results per page
        let startOffset = (pageParam - 1) * limit;
        let endOffset = startOffset + limit;
        const parks = tempParks.slice(startOffset, endOffset); // limits results
        let pages = Math.ceil(tempParks.length / limit);

        let pageArr = [];

        for (x = 0; x < pages; x++) {
          pageArr.push({ pageNum: x + 1 })
        }

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
            pagination: pagination,
            pageArr: pageArr
          });
          return;
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
              res.render("parks", {
                parks,
                loggedIn: req.session.loggedIn,
                user_id: req.session.user_id,
                firstPage: firstPage,
                lastPage: lastPage,
                pagination: pagination,
                pageArr: pageArr
              });
              return;
            }
          });
        }
      }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
    })
  } else {
    Park.findAll({
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
    }).then(dbParkData => {

    })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
})

function savedParks(obj) {
  const parks = obj.dbParkData.map(park => park.get({ plain: true }));

  for (x = 0; x < parks.length; x++) {
    parks[x].distance = 0; // setting the distance to 0 as we're accessing the page w/o any distance data
  }

  if (obj.req.session.user_id === undefined) { // checks to see if we are not signed in
    for (x = 0; x < parks.length; x++) {
      parks[x].saved = false;
    }
    obj.res.render("parks", {
      parks,
      loggedIn: obj.req.session.loggedIn,
      user_id: 0,
      pagination: false
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
          user_id: obj.req.session.user_id,
          pagination: false
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
}


module.exports = router;
