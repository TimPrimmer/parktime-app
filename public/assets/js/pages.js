let leftArrow = $("#left-arrow");
let rightArrow = $("#right-arrow");
let anyQueries;

const highlightPageNum = () => {
  let urlArr = window.location.href.split('/');
  if (window.location.href.split('?').length === 2) {
    anyQueries = true;
  }
  else
  {
    anyQueries = false;
  }
  let all = $(".page-num").map(function () {
    return this;
  }).get();
  $(all[parseInt(urlArr[6]) - 1]).addClass("page-highlight-num");
}

const changePage = (nextPage) => {
  let urlArr = window.location.href.split('/');
  let fetchString = "/parks/" + urlArr[4] + "/" + urlArr[5] + "/";
  let pageNum = urlArr.pop().split('?').shift();
  if (nextPage) {
    pageNum++;
  }
  else {
    pageNum--;
  }
  let querys = window.location.href.split('?').pop();
  if (anyQueries) {
    window.location.replace(fetchString + pageNum + "?" + querys);
  }
  else {
    window.location.replace(fetchString + pageNum);
  }
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
  let querys = window.location.href.split('?').pop();
  if (anyQueries) {
    window.location.replace(fetchString + pageNum + "?" + querys);
  }
  else {
    window.location.replace(fetchString + pageNum);
  }
});

highlightPageNum();