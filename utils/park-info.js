const parkJson = require('../data/parks.json');

const getParkData = (parkId) => {
  let foundPark;
  parkJson.parks.forEach(park => {
    if (park.id === parkId) {
      foundPark = park;
    }
  });
  return foundPark;
}

/*
//for testing the function
const main = () => {
  let test = getParkData("3B8307B3-54AB-4E5F-ACBC-8DECB98AD5F1");
 console.log(test);
}

main();
*/

module.exports = { getParkData };