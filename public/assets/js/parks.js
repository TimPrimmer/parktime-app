const getParks = (event) => {
  event.preventDefault();
  document.location.replace("/api/parks");
  // let queryUrl = "/api/parks";
  
  // fetch(queryUrl) 
  //   .then(response => {
  //     if (response.ok) {
        
  //     }
  //   })
        
}
console.log("Hi");

document.querySelector("#find-parks").addEventListener("submit", getParks);