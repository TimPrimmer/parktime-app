var modal = $("#park-result-modal");
var closeModal = $("#close-modal");


// fires when we click on the test modal button
// this style of event capture works for dynamically created html as well, aka like the park results we will be generating
$("#results-container").on("click", "button.park-modal-button", function (event) {

  modal.css("display", "flex");
  console.log(event);
});


// fires when we click on the span x in the modal
closeModal.on("click", function (event) {

  modal.css("display", "none");
  console.log(event);
});


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

console.log(getDistance(30.437575, -97.766203, 30.111375, -97.290104));

var findParksButton = $("#find-parks");

var useCurrentLocation = function(event) {
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(usersCurrentLocation);
  } else {
    console.log("failed");
  }
}

var usersCurrentLocation = function(data) {
  console.log(data.coords.latitude);
  console.log(data.coords.longitude);
}

$("#current-location").on("click", useCurrentLocation);

var captureUsersAddress = function(event) {
  event.preventDefault();
  let address = $("#address").val();
  convertAddressToLatLon(address);
}

var convertAddressToLatLon = function(address) {
  fetch("https://api.geoapify.com/v1/geocode/search?text=" + address + "&apiKey=30b8ed07042d496bb70facbcf6fc2ab6").then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data.features[0].properties.lat);
        console.log(data.features[0].properties.lon);
      })
    } else {
      console.log("Error converting users address to Lat/Lon");
    }
  });
}

findParksButton.on("click", captureUsersAddress);