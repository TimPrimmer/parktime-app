const { Park } = require('../models');
const fetch = require('node-fetch');
const fs = require('fs');

const limit = 999; // how many parks we should return on fetch

// gets the park data as json
const getParkData = async () => {
  let apiUrl = "https://developer.nps.gov/api/v1/parks?api_key=2vw10xovy9QiRhFAyNBZFHnpXusF6ygII6GCVlgB&limit=" + limit;
  const response = await fetch(apiUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
    }
  });
  const data = await response.json();

  // these format the json so it has just a "parks" array
  let tempData = await JSON.stringify(data, null, "\t");
  let changedJson = await `{"parks"` + tempData.substr(tempData.indexOf(`"data"`)+6);
  let formattedData = await JSON.parse(changedJson);

  return formattedData;
}

// creates the park data file - data/parks.json
const writeToFile = (fileName, data) => {
  fs.writeFile(fileName, data, err => {
    if (err) {
      console.log("JSON generation failed.");
      return console.error(err);
    } else {
      console.log("JSON generated successfully!");
    }
  });
}

// gets all the park ids and adds them into an array with a mysql id so we can reference the park later
const generateSqlArray = (parkData) => {
  let formattedSql = [];
  let parks = parkData.parks;
  for (let x = 0; x < parks.length; x++) {
    formattedSql.push({id: x + 1, park_id: parks[x].id})
  }
  return formattedSql;
}

const seedParks = async () => {
  const parkData = await getParkData();

  writeToFile("./data/parks.json", JSON.stringify(parkData))

  const parkSql = generateSqlArray(parkData);

  await Park.bulkCreate(parkSql);
  console.log('Parks seeded!');
}

module.exports = seedParks;

