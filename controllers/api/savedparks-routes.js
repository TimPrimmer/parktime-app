const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Saved_Parks } = require("../../models");

// returns all the saved parks
router.get("/", (req, res) => {
  Saved_Parks.findAll({
    order: [
      ['user_id', 'ASC'],
      ['park_id', 'ASC']
    ]
  })
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
    order: [
      ['user_id', 'ASC'],
      ['park_id', 'ASC']
    ]
  })
    .then((dbSavedData) => res.json(dbSavedData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// creating a new saved park entry, this happens each time the user clicks on save next to a park
router.post("/", (req, res) => {

  // here we are checking to see if theres a unique pair already (eg: has user 1 already saved park 50?)
  // this shouldnt get triggered on the website as it should flip the "save" button to a "saved" button, but better safe than sorry
  Saved_Parks.findAll({
    Attributes: [[sequelize.fn('DISTINCT', sequelize.col('user_id')), 'user_id'], 'park_id'],
    //group: ['user_id', 'park_id'],
    where: {
      user_id: req.body.user_id,
      park_id: req.body.park_id
    }
  })
    .then((dbSavedData) => {
      if (dbSavedData.length === 0) { // if this is a unique pair do the following
        Saved_Parks.create({
          user_id: req.body.user_id,
          park_id: req.body.park_id
        })
          .then((dbSavedData) => {
            res.json(dbSavedData);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });

      }
      else {// if this is NOT a unique pair do the following 
        res.status(400).json({ message: "User " + req.body.user_id + " has already saved park " + req.body.park_id + " to their list" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });

});

//this deletes a saved park entry via the park_id and user_id from a JSON body
router.delete("/", (req, res) => {
  Saved_Parks.destroy({
    where: {
      user_id: req.body.user_id,
      park_id: req.body.park_id
    }
  })
    .then((dbSavedData) => {
      if (!dbSavedData) {
        res.status(404).json({ message: "No saved park entry found with that user/park id" });
        return;
      }
      res.json(dbSavedData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// this deletes a saved park entry via a saved park entry id
router.delete("/:id", (req, res) => {
  Saved_Parks.destroy({
    where: {
      id: req.params.id,
    }
  })
    .then((dbSavedData) => {
      if (!dbSavedData) {
        res.status(404).json({ message: "No saved park entry found with that id" });
        return;
      }
      res.json(dbSavedData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
