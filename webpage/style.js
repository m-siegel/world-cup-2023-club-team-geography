function setStyle() {
  let headerHeight = document.querySelector("header").offsetHeight;
  document.querySelector("main").style.marginTop = `${headerHeight}px`;

  // change menu display location (turn one on, other off)
  // change size of map display

  // TODO: only for when wide enough to be vertical... conditional based on viewport later
  let viewportWidth = window.innerWidth;
  let mapMenuWidth = document.querySelector(".map-menu-vertical").offsetHeight;
  let mapWidth = viewportWidth - mapMenuWidth;
  let mapHeight = mapWidth * .6;
  document.querySelector("svg.map").style.width = `${mapWidth}px`;
  document.querySelector("svg.map").style.height = `${mapHeight}px`;
}

window.addEventListener("resize", setStyle);
setStyle();


