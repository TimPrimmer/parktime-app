const { Park } = require('../models');

const parkdata = [
  {
    id: 1,
    url: "https://www.nps.gov/abli/index.htm",
    name: "Abraham Lincoln Birthplace National Historical Park",
    description: "For over a century people from around the world have come to rural Central Kentucky to honor the humble beginnings of our 16th president, Abraham Lincoln. His early life on Kentucky's frontier shaped his character and prepared him to lead the nation through Civil War. The country's first memorial to Lincoln, built with donations from young and old, enshrines the symbolic birthplace cabin."
  }
];

const seedParks = () => Park.bulkCreate(parkdata);

module.exports = seedParks;
