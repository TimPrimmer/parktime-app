async function commentFormHandler(park_id, park_code) {
  const comment_text = document
    .querySelector(`textarea[name="comment-body-${park_id}"]`)
    .value.trim();

  if (comment_text) {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        comment_text,
        park_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.querySelector(".comment-form").reset();
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector(".comment-form").addEventListener("submit", (event) => {
  event.preventDefault();
});
