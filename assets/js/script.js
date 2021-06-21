var modal = $("#park-result-modal");
var closeModal = $("#close-modal");
var mainForm = $("#main-form");

var findParksButton = $("#find-parks");
var statusText = $("#status-text");

var userLat = 0;
var userLon = 0;

// fires when we click on the test modal button
// this style of event capture works for dynamically created html as well, aka like the park results we will be generating
$("#results-container").on("click", "button.park-modal-button", function (event) {
  modal.css("display", "flex");
});


// fires when we click on the span x in the modal
closeModal.on("click", function (event) {
  modal.css("display", "none");
});

// fires when we click outside of the modal
window.onclick = function(event) {
  if (event.target === modal[0]) { 
    modal.css("display", "none");
  }
}

var getDistance = function (lat1, lon1, lat2, lon2) { // Returns distance in miles between two lat and lon points
  var radlat1 = Math.PI * lat1 / 180;
  var radlat2 = Math.PI * lat2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  return dist;
}

// Displays a little message underneath the search bar so the user knows when the address is invalid,
// or the "use my address" was successful
var myTimeout; // Declaring this outside the function allows us to keep a reference to running timeouts
var searchDisplayMsg = function (isError, seconds) {
  if (isError) {
    statusText.html("Invalid Address")
    statusText.removeClass();
    statusText.addClass("error");
  }
  else
  {
    statusText.html("Location Gathered")
    statusText.removeClass();
    statusText.addClass("success");
  }
  clearTimeout(myTimeout); // clears any existing timeout, this resets the timer if you trigger this before the last timeout finishes
  myTimeout = setTimeout(function() { 
    statusText.text("")
    statusText.removeClass();
  }, seconds * 1000); // hide after x seconds
}

var useCurrentLocation = function(event) { 
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(usersLatLon);
  } else {
    console.log("failed");
  }
}

var usersLatLon = function(data) { // fires if we get the users current location
  userLat = data.coords.latitude;
  userLon = data.coords.longitude;
  searchDisplayMsg(false, 3); // display success message
  getParkData();
}

var captureUsersAddress = function(event) { // Fires when we click on "Find parks"
  event.preventDefault();
  let address = $("#address").val();
  convertAddressToLatLon(address);
}

var convertAddressToLatLon = function(address) {
  if (!address) { // checks to see if the user has entered in an address
    searchDisplayMsg(true, 2); // display error message
  }
  else
  {
    fetch("https://api.geoapify.com/v1/geocode/search?text=" + address + "&apiKey=30b8ed07042d496bb70facbcf6fc2ab6")
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          if (data.features.length >= 1) { // Checks to see if we actually got a location back by verifying the features array length
            searchDisplayMsg(false, 3); // display success message
            userLat = data.features[0].properties.lat;
            userLon = data.features[0].properties.lon;
            getParkData();
          }
          else
          {
            searchDisplayMsg(true, 2); // display error message
          }
        })
      } else {
        console.log("Error converting users address to Lat/Lon");
     }
    })
    .catch(function(error) {
      console.log(error);
    });
  } 
}

var getParkData = function () {
  var apiUrl = "https://developer.nps.gov/api/v1/parks?api_key=2vw10xovy9QiRhFAyNBZFHnpXusF6ygII6GCVlgB&limit=999";
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        displayResults(data.data); //passing in the array of parks itself
      })
    } else {
      console.log("Error grabbing park data");
    }
  });
}

var displayResults = function (data) {
 var parkList = [];
  for (x = 0; x < data.length; x++) {
    var tempParkObj = {
      name: "Park Name",
      loc: "Park Location",
      dist: 0,
      saved: false,
      description: "Park Description",
      link: ""
    }; // Have to declare this inside the loop, otherwise it passes the obj reference into the array not a new object each time
    tempParkObj.name = data[x].fullName;
    if (data[x].addresses[0] != null) { // some park results dont have an address field, this checks for that
      tempParkObj.loc = data[x].addresses[0].city + ", " + data[x].states;
    }
    else 
    {
      tempParkObj.loc = data[x].states;
    }
    tempParkObj.dist = Math.trunc(getDistance(userLat, userLon, data[x].latitude, data[x].longitude));
    tempParkObj.saved = false;
    tempParkObj.description = data[x].description;
    tempParkObj.link = data[x].url;

    parkList.push(tempParkObj);
  }

  parkList.sort((a,b) => a.dist - b.dist) // sorts by distance, lower values first

  console.log(parkList);
}

$("#current-location").on("click", useCurrentLocation); // "use my location" button
findParksButton.on("click", captureUsersAddress); // "find parks" button