async function getParks(event) {
  event.preventDefault();
  const response = await fetch("/parks/200/400", {
    method: "GET",
    headers: { "Content-Type": "application/json"}
  });

  
  if (response.ok) {
    window.location.replace("/parks/200/400");
    
  }
  
}

document.querySelector("#find-parks").addEventListener("click", getParks);

