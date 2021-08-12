function openModal(parkCode) {
  let allModals = document.getElementsByClassName("park-result-modal");
  for (let modal of allModals) {
    modal.style.display = "none";
  }

  let modal = document.getElementById(parkCode + "-modal");
  modal.style.display = "flex";

}

const detailsLink = document.getElementsByClassName("park-modal");
// pass value into event listener method
for (let i = 0; i < detailsLink.length; i++) {
  detailsLink[i].addEventListener("click", function(){
    openModal(detailsLink[i].dataset.parkCode);
  });
}

