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
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({
            user_id: resultsPage.attr("user_id"),
            park_id: $(event.target).attr("park_id")
          })
        })
        .then(function (res) {
          console.log(res);
          document.location.reload();
        })
        .catch(function (res) { console.log(res) })
    }
    else {
      fetch("/api/saved",
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "DELETE",
          body: JSON.stringify({
            user_id: resultsPage.attr("user_id"),
            park_id: $(event.target).attr("park_id")
          })
        })
        .then(function (res) {
          console.log(res);
          document.location.reload();
        })
        .catch(function (res) { console.log(res) })
    }
  }
}


