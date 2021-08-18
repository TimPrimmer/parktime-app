let statusText = $("#status-text");


var useCurrentLocation = function (event) {// fires if we get the users current location
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(usersLatLon);
  } else {
    searchDisplayMsg(false, 3, "Error grabbing location");
  }
}

let usersLatLon = (data) => { // updates the address field with the user lat and lon
  userLat = data.coords.latitude;
  userLon = data.coords.longitude;
  searchDisplayMsg(false, 2, "Success"); // display success message
  address = String(userLat) + ", " + String(userLon);
  $("#address").val(address);
}


let myTimeout;
const searchDisplayMsg = (isError, seconds, errorMsg) => {
  if (isError) {
    statusText.html(errorMsg)
    statusText.removeClass();
    statusText.addClass("error");
  }
  else {
    statusText.html(errorMsg)
    statusText.removeClass();
    statusText.addClass("success");
  }
  clearTimeout(myTimeout); // clears any existing timeout, this resets the timer if you trigger this before the last timeout finishes
  myTimeout = setTimeout(function () {
    statusText.text("")
    statusText.removeClass();
  }, seconds * 1000); // hide after x seconds
}


const convertAddressToLatLon = async (address) => {
  let userLat, userLon;
  let response = await fetch("https://api.geoapify.com/v1/geocode/search?text=" + address + "&apiKey=30b8ed07042d496bb70facbcf6fc2ab6");

  if (response.ok) {
    let data = await response.json();

    if (data.features.length >= 1) { // Checks to see if we actually got a location back by verifying the features array length
      searchDisplayMsg(false, 3, "Searching"); // display success message
      userLat = data.features[0].properties.lat;
      userLon = data.features[0].properties.lon;
      return { userLat, userLon };
    }
  }
  else {
    console.log("Error converting users address to Lat/Lon");
  }

}



const getParks = async (event) => {  // Fires when we click on "Find parks"
  event.preventDefault();
  address = $("#address").val();
  if (!address) { // checks to see if the user has entered in an address
    searchDisplayMsg(true, 2, "Invalid Location"); // display error message
  }
  else {
    let userLoc = await convertAddressToLatLon(address);
    let fetchString = "/parks/" + userLoc.userLat + "/" + userLoc.userLon;
    const response = await fetch(fetchString, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });


    if (response.ok) {
      window.location.replace(fetchString);

    }
  }
}

$("#current-location").on("click", useCurrentLocation); // "use my location" button
document.querySelector("#find-parks").addEventListener("click", getParks); // "find parks" button

