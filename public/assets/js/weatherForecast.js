var emptyUlElement = function () {
  document.querySelector("#modal-forecast-box").innerHTML = "";
}

var addUviBackground = function (uvi, i) {
  var uviSpan = document.getElementById("uvi" + i);
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

var buildForecastCards = function (data) {
  emptyUlElement();
  for (var i = 0; i < 5; i++) {
    var date = new Date(data.daily[i].dt * 1000);
    date = date.toLocaleDateString();
    var listEl = document.createElement("li");
    listEl.classList.add("modal-forecast");
    document.querySelector("#modal-forecast-box").appendChild(listEl);
    var forecastIcon = "<img src='https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png' alt='" + data.daily[i].weather[0].description + " weather icon' title='" + data.daily[i].weather[0].description + "'>";
    var forecastTemp = "<p>Temp: " + data.daily[i].temp.day + " &#176;F</p>";
    var forecastWind = "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>";
    var forecastHumidity = "<p>Humidity: " + data.daily[i].humidity + "%</p>";
    var forecastUvi = "<p> UV Index: <span class='uvi' id='uvi" + i + "'>" + data.daily[i].uvi + "</span>";
    listEl.innerHTML = "<p>" + date + "</p>" + forecastIcon + forecastTemp + forecastWind + forecastHumidity + forecastUvi;
    addUviBackground(data.daily[i].uvi, i);
  }
}

var getWeatherForecast = function (parkCoordinates) {
  var oneCallApi = "https://api.openweathermap.org/data/2.5/onecall?" + parkCoordinates
    + "&units=imperial&appid=8a3c0b5830459bf0bc6ee52ea4c39851"

  fetch(oneCallApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          buildForecastCards(data);
        });
      } else {
        return; 
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather API. Please try again.");
    });
}

var getParkCoordinates = function (index) {
  var parkCoordinates = "lat=" + parkList[index].lat + "&lon=" + parkList[index].lon;
  getWeatherForecast(parkCoordinates);
}
console.log("hi");

// getParkCoordinates();