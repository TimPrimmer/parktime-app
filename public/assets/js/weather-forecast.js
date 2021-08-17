function emptyUlElement(parkCode) {
  document.getElementById(parkCode).innerHTML = "";
}

let currentParkCode;

let getParkCode = (parkCode) => {
  currentParkCode = parkCode;
}

function addUviBackground(uvi, i) {
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

function buildForecastCards(data) {
  let parkCode = currentParkCode;
  emptyUlElement(parkCode);
  for (let i = 0; i < 5; i++) {
    let date = new Date(data.daily[i].dt * 1000);
    date = date.toLocaleDateString();
    let listEl = document.createElement("li");
    listEl.classList.add("modal-forecast");
    document.getElementById(parkCode).appendChild(listEl);
    let forecastIcon = "<img src='https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png' alt='" + data.daily[i].weather[0].description + " weather icon' title='" + data.daily[i].weather[0].description + "'>";
    let forecastTemp = "<p>Temp: " + data.daily[i].temp.day + " &#176;F</p>";
    let forecastWind = "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>";
    let forecastHumidity = "<p>Humidity: " + data.daily[i].humidity + "%</p>";
    let forecastUvi = "<p> UV Index: <span class='uvi' id='uvi" + i + "'>" + data.daily[i].uvi + "</span>";
    listEl.innerHTML = "<p>" + date + "</p>" + forecastIcon + forecastTemp + forecastWind + forecastHumidity + forecastUvi;
    addUviBackground(data.daily[i].uvi, i);
  }
}

function getWeatherForecast(parkCoordinates) {
  let oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?" + parkCoordinates
    + "&units=imperial&appid=8a3c0b5830459bf0bc6ee52ea4c39851"

  fetch(oneCallApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          buildForecastCards(data);
        });
      } else {
        return; // not sure what to do here just yet
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather API. Please try again.");
    });
}

function getParkCoordinates(lat, lon) {
  let parkCoordinates = "lat=" + lat + "&lon=" + lon;
  getWeatherForecast(parkCoordinates);
}

