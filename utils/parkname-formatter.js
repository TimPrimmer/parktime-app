const convertName = (parkName) => { 
  // Returns a formatted version of a park name for use in google maps search query
  // otherwise the console gets spammed with errors
  let tempName = parkName.replace(/&/g, "and").replace(/ /g, "+");
  return tempName;
}




module.exports = { convertName };

