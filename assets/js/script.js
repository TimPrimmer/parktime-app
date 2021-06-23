var modal = $("#park-result-modal");
var closeModal = $("#close-modal");
var modalTitle = $("#modal-title");
var modalSubtitle = $("#modal-subtitle");
var modalDistance = $("#modal-distance");
var modalSaved = $("#modal-saved");
var modalActs = $("#modal-activities");
var modalDescription = $("#modal-description");
var modalWebsite = $("#modal-website");
var gMapsBox = $("#gmaps-box");
var mainForm = $("#main-form");

var findParksButton = $("#find-parks");
var statusText = $("#status-text");
var resultsBox = $("#results-container");
var resultsSection = $("#results-page");
var heroImg = $(".hero-image");
var formBox = $("#main-form");

var userLat = 0;
var userLon = 0;

var parkList = [];

// fires when we click on the test modal button
// this style of event capture works for dynamically created html as well, aka like the park results we will be generating
resultsBox.on("click", "span.park-modal", function (event) {
  modal.css("display", "flex");
  populateModal($(event.target).attr("index"));
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
              });
          } else {
              return; // not sure what to do here just yet
          }
      })
      .catch(function(error) {
          alert("Unable to connect to Weather API. Please try again.");
      });
}


let getParkCoordinates = function(index) {
  let parkCoordinates = "lat=" + parkList[index].lat + "&lon=" + parkList[index].lon;
  getWeatherForecast(parkCoordinates);
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
        formatResults(data.data); //passing in the array of parks itself
        displayParklist(); // displaying the results
      })
    } else {
      console.log("Error grabbing park data");
    }
  });
}

var formatResults = function (data) {
  for (x = 0; x < data.length; x++) {
    var tempParkObj = {
      name: "Park Name",
      states: "Park Location",
      dist: 0,
      lat: "",
      lon: "",
      img: "https://via.placeholder.com/200x100",
      saved: false,
      description: "Park Description",
      activities: "",
      link: ""
    }; // Have to declare this inside the loop, otherwise it passes the obj reference into the array not a new object each time
    tempParkObj.name = data[x].fullName;
    tempParkObj.states = data[x].states;
    tempParkObj.lat = data[x].latitude;
    tempParkObj.lon = data[x].longitude;
    tempParkObj.activities = data[x].activities;
    tempParkObj.dist = Math.trunc(getDistance(userLat, userLon, data[x].latitude, data[x].longitude));
    tempParkObj.saved = false;
    tempParkObj.description = data[x].description;
    tempParkObj.link = data[x].url;

    parkList.push(tempParkObj);
  }

  parkList.sort((a,b) => a.dist - b.dist); // sorts by distance, lower values first

  console.log(parkList);
}

var toggleCheckbox = function(elem) {
  if (elem.hasAttribute("checked")) {
    elem.removeAttribute("checked");
  }

  else if (!elem.hasAttribute("checked")) {
    elem.setAttribute("checked", "");
  }
}

// move variable to top after merging with results from Tim
var checkedActivities = [];
var captureCheckedActivities = function() {
  var activities = document.querySelectorAll("#main-form ul li label input");
  checkedActivities = [];
  for (var item of activities) {
    if (item.checked === true) {
      checkedActivities.push(item.defaultValue);
    }
  }
  console.log("activities", checkedActivities);
}



// Displays the current formatted list of parks onto the page
var displayParklist = function () {
  formBox.css("display", "none");
  heroImg.css("display", "none");
  resultsSection.css("display", "block");
  resultsBox.html(""); // clearing any previous results
  var searchLimit = parkList.length; // We can set this to something else to limit results
  for (x = 0; x < searchLimit; x++)
  {
    var parkCard = $(document.createElement("div"));
    parkCard.addClass("park-card");

    var parkImgDiv = $(document.createElement("div"));
    var parkImg = parkList[x].img;
    parkImgDiv.html("<img class='park-image' src='" + parkImg + "'>");

    var parkInfoDiv = $(document.createElement("div"));
    var parkName = $(document.createElement("h4"));
    parkName.addClass("park-name");
    parkName.text(parkList[x].name);

    var parkStates = $(document.createElement("p"));
    parkStates.addClass("park-states");
    parkStates.text(parkList[x].states);

    var parkDist = $(document.createElement("p"));
    parkDist.addClass("miles-away");
    parkDist.text(parkList[x].dist + " miles away");

    var parkSaved = $(document.createElement("p"));
    parkSaved.addClass("saved");
    if (parkList[x].saved){
      parkSaved.text("Saved");
    }
    else{
      parkSaved.text("Save");
    }
    
    parkInfoDiv.append(parkName);
    parkInfoDiv.append(parkStates);
    parkInfoDiv.append(parkDist);
    parkInfoDiv.append(parkSaved);

    var boxLine = $(document.createElement("hr"));
    boxLine.addClass("park-horizontal-row");

    var parkDesBox = $(document.createElement("div"));
    var parkDescription = $(document.createElement("p"));
    parkDescription.addClass("park-description");
    parkDescription.text(parkList[x].description);

    var parkModalLink = $(document.createElement("span"));
    parkModalLink.addClass("park-modal park-modal-link");
    parkModalLink.text("View Details");
    parkModalLink.attr("index", x);

    var parkUrl = $(document.createElement("a"));
    parkUrl.addClass("park-website");
    parkUrl.text("Website");
    parkUrl.attr("href", parkList[x].link)
    parkUrl.attr("target", "_blank");

    parkDesBox.append(parkDescription);
    parkDesBox.append(parkModalLink);
    parkDesBox.append(parkUrl);

    parkCard.append(parkImgDiv);
    parkCard.append(parkInfoDiv);
    parkCard.append(boxLine);
    parkCard.append(parkDesBox);

    resultsBox.append(parkCard);
  }
}


var populateModal = function (index) {
  modalTitle.text(parkList[index].name);
  modalSubtitle.text(parkList[index].states);
  modalDistance.text(parkList[index].dist + " miles away");
  if (parkList[index].saved){
    modalSaved.text("Saved");
  }
  else{
    modalSaved.text("Save");
  }
  modalActs.html("") //clearing any previous activities
  for(x = 0; x < parkList[index].activities.length; x++) {
    var activity = $(document.createElement("div"));
    activity.addClass("modal-activity");
    activity.text(parkList[index].activities[x].name);
    modalActs.append(activity);
  }
  modalDescription.text(parkList[index].description);
  modalWebsite.attr("href", parkList[index].link)
  modalWebsite.attr("target", "_blank");
  
  var gUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyBvUej8oCiG__h7_jtiZKORjFKY1Uk-fu8&q=" 
  + parkList[index].name.replace(/&/g, '');
  gMapsBox.attr("src", gUrl);
  
  getParkCoordinates(index);
}




$("#current-location").on("click", useCurrentLocation); // "use my location" button
findParksButton.on("click", captureUsersAddress); // "find parks" button
findParksButton.on("click", captureCheckedActivities);