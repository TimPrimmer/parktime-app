var modal = $("#park-result-modal");
var closeModal = $("#close-modal");

var findParksButton = $("#find-parks");
var statusText = $("#status-text");


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

var usersLatLon = function(data) {
  console.log(data.coords.latitude);
  console.log(data.coords.longitude);
  searchDisplayMsg(false, 3); // display success message
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
          console.log(data);
          if (data.features.length >= 1) { // Checks to see if we actually got a location back by verifying the features array length
            console.log(data.features[0].properties.lat);
            console.log(data.features[0].properties.lon);
            searchDisplayMsg(false, 3); // display success message
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
  var apiUrl = "https://https://developer.nps.gov/api/v1/parks?api_key=2vw10xovy9QiRhFAyNBZFHnpXusF6ygII6GCVlgB&limit=9999"
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);
      })
    } else {
      console.log("Error grabbing park data");
    }
  });
}

$("#current-location").on("click", useCurrentLocation);
findParksButton.on("click", captureUsersAddress); 