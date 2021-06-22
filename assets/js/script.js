var modal = $("#park-result-modal");
var closeModal = $("#close-modal");


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

console.log(getDistance(30.437575, -97.766203, 30.111375, -97.290104));

let emptyUlElement = function() {
  document.querySelector("#modal-forecast-box").innerHTML = "";
}

let addUviBackground = function(uvi, i) {
  let uviSpan = document.getElementById("uvi" + i);
  if (uvi < 3) {
      uviSpan.classList.add("low");
  } 
  else if (uvi < 6) {
      uviSpan.classList.add("moderate");
  }
  else if (uvi < 8) {
      uviSpan.classList.add("high");
  }
  else if (uvi < 11) {
      uviSpan.classList.add("very-high");
  }
  else {
      uviSpan.classList.add("extreme");
  }
}

let buildForecastCards = function(data) {
  emptyUlElement();
  for (let i = 0; i < 5; i++) {
    let date = new Date(data.daily[i].dt * 1000);
    date = date.toLocaleDateString();
    let listEl = document.createElement("li");
    listEl.classList.add("modal-forecast");
    document.querySelector("#modal-forecast-box").appendChild(listEl);
    let forecastIcon = "<img src='https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png' alt='" + data.daily[i].weather[0].description +  " weather icon' title='" + data.daily[i].weather[0].description + "'>";
    let forecastTemp = "<p>Temp: " + data.daily[i].temp.day + " &#176;F</p>";
    let forecastWind = "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>";
    let forecastHumidity = "<p>Humidity: " + data.daily[i].humidity + "%</p>";
    let forecastUvi = "<p> UV Index: <span class='uvi' id='uvi" + i + "'>" + data.daily[i].uvi + "</span>";
    listEl.innerHTML = "<p>" + date + "</p>" +  forecastIcon + forecastTemp + forecastWind + forecastHumidity + forecastUvi;
    addUviBackground(data.daily[i].uvi, i);
  }
}

let getWeatherForecast = function(parkCoordinates) {
  let oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?" + parkCoordinates
   + "&units=imperial&appid=8a3c0b5830459bf0bc6ee52ea4c39851"

  fetch(oneCallApi)
      .then(function(response) {
          if (response.ok) {
              response.json().then(function(data) {
                  buildForecastCards(data);
                  console.log(data);
              });
          } else {
              return; // not sure what to do here just yet
          }
      })
      .catch(function(error) {
          alert("Unable to connect to Weather API. Please try again.");
      });
}

// move this function call to be called when modal is being built
let getParkCoordinates = function() {
  // hard-coding lat/lon temporarily
  let parkCoordinates = "lat=" + 29.53539777 + "&lon=" + -101.075821;
  getWeatherForecast(parkCoordinates);
}
getParkCoordinates();



var findParksButton = $("#find-parks");

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