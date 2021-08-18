var modalSaved = $("#modal-saved");



// fires when we click on the "save" or "saved" button in the modal
modalSaved.on("click", function (event) {
  //event.target).attr("index")
  console.log($(event.target)); 
});

// fires when we click on the "save" or "saved" button in the results section
$(document).on("click", "p.saved", function (event) {
  console.log($(event.target)); 
});