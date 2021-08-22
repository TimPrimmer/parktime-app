var resultsPage = $("#results-page");


// fires when we click on the "save" or "saved" button in the modal
$(".modal-saved").on('click', function (event) {
  saveOrDelete(event);
});

// fires when we click on the "save" or "saved" button in the results section
$(".saved").on('click', function (event) {
  saveOrDelete(event);
});

saveOrDelete = (event) => {

  if (resultsPage.attr("user_id") != 0) {

    if ($(event.target).text() === "Save") {
      fetch("/api/saved",
        {
          headers: {
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            user_id: resultsPage.attr("user_id"),
            park_id: $(event.target).attr("park_id")
          })
        })
        .then(function (res) {

          if ($(event.target).hasClass("modal-saved")) { // if we click on the save button via the modal...
            $(event.target).text("Saved"); // set modal to saved
            let parks = $(".saved").map(function () {
              if ($(this).attr("park_id") === $(event.target).attr("park_id")) {
                return this;
              }
            }).get();
            $(parks[0]).text("Saved"); // set park results to saved
          }
          else {
            if ($(event.target).hasClass("saved")) { // if we click on the save button via the park results
              $(event.target).text("Saved"); // set park results to saved
              let modalParks = $(".modal-saved").map(function () {
                if ($(this).attr("park_id") === $(event.target).attr("park_id")) {
                  return this;
                }
              }).get();
              $(modalParks[0]).text("Saved"); // set modal to saved
            }
          }
        })
        .catch(function (res) { console.log(res) })
    }
    else {
      fetch("/api/saved",
        {
          headers: {
            'Content-Type': 'application/json'
          },
          method: "DELETE",
          body: JSON.stringify({
            user_id: resultsPage.attr("user_id"),
            park_id: $(event.target).attr("park_id")
          })
        })
        .then(function (res) {

          if ($(event.target).hasClass("modal-saved")) { // if we click on the save button via the modal...
            $(event.target).text("Save"); // set modal to save
            let parks = $(".saved").map(function () {
              if ($(this).attr("park_id") === $(event.target).attr("park_id")) {
                return this;
              }
            }).get();
            $(parks[0]).text("Save"); // set park results to save
          }
          else {
            if ($(event.target).hasClass("saved")) { // if we click on the save button via the park results
              $(event.target).text("Save"); // set park results to save
              let modalParks = $(".modal-saved").map(function () {
                if ($(this).attr("park_id") === $(event.target).attr("park_id")) {
                  return this;
                }
              }).get();
              $(modalParks[0]).text("Save"); // set modal to save
            }
          }

        })
        .catch(function (res) { console.log(res) })
    }
  }
}


