const toggleCheckbox = function (elem) {
  if (elem.hasAttribute("checked")) {
    elem.removeAttribute("checked");
  }

  else if (!elem.hasAttribute("checked")) {
    elem.setAttribute("checked", "");
  }
}

const captureCheckedActivities = function () {
  const checkedActivities = [];
  var activities = document.querySelectorAll("#main-form .activities");
  for (var item of activities) {
    if (item.checked === true) {
      checkedActivities.push(item.defaultValue.substring(0,3));
    }
  }
  // console.log(checkedActivities);
  return checkedActivities;
}

// document.querySelector("#find-parks").addEventListener("click", captureCheckedActivities);