async function commentFormHandler(park_id) {
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
        response.json().then((data) => {
          let userId = data.user_id;
          buildTempCommentCard(comment_text, userId, park_id);
        })
      } else {
        alert(response.statusText);
      }
  }
}

async function buildTempCommentCard(comment, userId, parkId) {
  const userData = await fetch(`/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (userData.ok) {
    userData.json().then((data) => {
      let username = data.username;
      let commentUl = document.querySelector(`ul.comments[data-park-id='${parkId}']`);

      // create comment HTML and append to ul container
      let listEl = document.createElement("li");
      commentUl.append(listEl);
      let textDiv = document.createElement("div");
      textDiv.innerHTML = comment;
      textDiv.className = "text";
      let userDiv = document.createElement("div");
      userDiv.innerHTML = "🥾" + username;
      userDiv.className = "username";
      listEl.append(textDiv);
      listEl.append(userDiv);
      let commentTextBox = document.querySelector(`textarea[name="comment-body-${parkId}"]`);
      commentTextBox.value = "";
    })
  }
}

document
  .querySelector(".comment-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
  });
