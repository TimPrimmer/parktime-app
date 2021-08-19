let leftArrow = $("#left-arrow");
let rightArrow = $("#right-arrow");

const highlightPageNum = () => {
  let urlArr = window.location.href.split('/');
  let all = $(".page-num").map(function () {
    return this;
  }).get();
  $(all[parseInt(urlArr[6]) - 1]).addClass("page-highlight-num");
}

const changePage = (nextPage) => {
  let urlArr = window.location.href.split('/');
  let fetchString = "/parks/" + urlArr[4] + "/" + urlArr[5] + "/";
  let pageNum = urlArr.pop();
  if (nextPage) {
    pageNum++;
  }
  else {
    pageNum--;
  }
  console.log(nextPage);
  window.location.replace(fetchString + pageNum);
}

leftArrow.on('click', function () { // left page arrow
  changePage(false)
});

rightArrow.on('click', function () { // right page arrow
  changePage(true)
});

$(".page-num").on('click', function (event) {
  let pageNum = parseInt($(event.target).text());
  let urlArr = window.location.href.split('/');
  let fetchString = "/parks/" + urlArr[4] + "/" + urlArr[5] + "/";
  window.location.replace(fetchString + pageNum);
});

highlightPageNum();