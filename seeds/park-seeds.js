const { Park } = require('../models');
const fetch = require('node-fetch');
const fs = require('fs');

// gets the park data sends it to other functions


// const getParkData = async () => {
//   let apiUrl = "https://developer.nps.gov/api/v1/parks?api_key=2vw10xovy9QiRhFAyNBZFHnpXusF6ygII6GCVlgB&limit=10";
//   let data = await fetch(apiUrl);
//   console.log("national park api data", data);
// }

// const getParkData = () => {
//   let apiUrl = "https://developer.nps.gov/api/v1/parks?api_key=2vw10xovy9QiRhFAyNBZFHnpXusF6ygII6GCVlgB&limit=10";
//   fetch(apiUrl)
//   .then(data => console.log(data));
// }

// need to fix to actually work
// const getParkData = async () => {
//   let apiUrl = "https://developer.nps.gov/api/v1/parks?api_key=2vw10xovy9QiRhFAyNBZFHnpXusF6ygII6GCVlgB&limit=999";
//   const response = await fetch(apiUrl, {
//     method: "GET",
//     headers: { "Content-Type": "application/json"},
//     credentials: 'include'
//   });

//   console.log(response);
// }


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

const parkdata = [ // example of the formatted park-data
  {
    id: 1,
    park_id: "77E0D7F0-1942-494A-ACE2-9004D2BDC59E"
  },
  {
    id: 2,
    park_id: "77E0D7F0-1942-494A-ACE2-9453634563456"
  },
  {
    id: 3,
    park_id: "77E0D7F0-1942-494A-ACE2-345634563456"
  },
  {
    id: 4,
    park_id: "77E0D7F0-1942-494A-ACE2-345643563456"
  }
];


const seedParks = async () => {
  //await getParkData();
  await Park.bulkCreate(parkdata);
}

module.exports = seedParks;

