function openModal(parkCode) {
  document.getElementById(parkCode + "-modal").style.display = "flex";
}

const detailsLink = document.getElementsByClassName("park-modal");

// adding event listener to "View Details" 
for (let i = 0; i < detailsLink.length; i++) {
  detailsLink[i].addEventListener("click", function(){
    openModal(detailsLink[i].dataset.parkCode);
  });
}

function closeModal(parkCode) {
  document.getElementById(parkCode + "-modal").style.display = "none";
}

const closeModalX = document.getElementsByClassName("close-modal");

// adding event listener to modal's X (close)
for (let i = 0; i < closeModalX.length; i++) {
  closeModalX[i].addEventListener("click", function() {
    closeModal(closeModalX[i].dataset.parkCode);
  });
}
