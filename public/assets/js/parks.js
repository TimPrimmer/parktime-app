async function getParks(event) {
  event.preventDefault();
  const response = await fetch("/api/parks", {
    method: "GET",
    headers: { "Content-Type": "application/json"}
  });
  
  
  if (response.ok) {
    window.location.replace("/parks");
    
  }
  
}

document.querySelector("#find-parks").addEventListener("click", getParks);

