function getParks(event) {
  event.preventDefault();

  window.location.replace("/parks");

}

document.querySelector("#find-parks").addEventListener("click", getParks);
