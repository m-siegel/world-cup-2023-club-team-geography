/**
 * Contains methods to fit components to the screen size.
 * @returns Object with methods to fit components to the screen size. 
 */
function Fit() {
  let fit = {};

  /**
   * Fit main, menu, and map to window.
   */
  fit.fitToWindow = function () {
    fit.fitMain();
    fit.fitMenu();
    fit.fitMap();
  }
  
  /**
   * Fits the main section below the header.
   */
  fit.fitMain = function () {
    let headerHeight = document.querySelector("header").offsetHeight;
    document.querySelector("main").style.marginTop = `${headerHeight}px`;
  }
  
  /**
   * Whether menu SHOULD BE (not is) displaying vertical.
   * @returns
   */
  fit.shouldBeMenuVertical = function () {
    return window.innerWidth > window.innerHeight;
  }
  
  /**
   * Fit the map menu.
   */
  fit.fitMenu = function () {
    if (fit.shouldBeMenuVertical()) {
      fit.fitVerticalMenu();
    } else {
      fit.fitHorizontalMenu();
    }
  }

  /**
   * Fit the vertical map menu (and hide the horizontal one).
   */
  fit.fitVerticalMenu = function () {
    document.querySelector(".map-menu-horizontal").style.display = "none";
    document.querySelector(".map-menu-vertical").style.display = "";
    fit.setVerticalMenuHeight();
  }
  
  /**
   * Get the ideal height for the vertical menu.
   */
  fit.setVerticalMenuHeight = function () {
    let menu = document.querySelector(".map-menu-vertical");
    let topBound = menu.getBoundingClientRect().y;
    // Too time-intensive
    // document.querySelector(".map-menu-vertical").style.maxHeight = `${
    //   Math.min(window.innerHeight - topBound, document.querySelector("#mapCountryToClubBefore").clientHeight)
    // }px`;
    let buffer = 30;   // Extra amount to subtract so the maxHeight will kick in.
    document.querySelector(".map-menu-vertical").style.maxHeight = `${
      window.innerHeight - topBound - buffer
    }px`;
  }

  /**
   * Fit the horizontal map menu and hide the vertical one.
   */
  fit.fitHorizontalMenu = function () {
    // TODO set up horizontal
    document.querySelector(".map-menu-vertical").style.display = "none";
    document.querySelector(".map-menu-horizontal").style.display = "";
  }
  
  /**
   * Get the available width left for the map.
   * @returns Size in pixels for the map.
   */
  fit.getAvailableMapWidth = function () {
    let viewportWidth = window.innerWidth;
    let mapMargin = parseInt(
      window
        .getComputedStyle(document.querySelector(".map-content"))
        .getPropertyValue("margin")
        .slice(0, -2)
    );
  
    if (!fit.shouldBeMenuVertical()) {
      return viewportWidth - 2 * mapMargin;    // Account for margins on both sides.
    }
  
    let mapMenuElem = document.querySelector(".map-menu-vertical");
    let mapMenuMargin = parseInt(
      window.getComputedStyle(mapMenuElem).getPropertyValue("margin").slice(0, -2)
    );
    let extraBufferFactor = 5;    // Extra factor to scale mapMenuWidth.
    let mapMenuWidth = mapMenuElem.offsetWidth + extraBufferFactor * mapMenuMargin;
    let mapWidth = viewportWidth - mapMenuWidth - 2 * mapMargin;    // Account for margins on both sides.

    return mapWidth;
  }
  
  /**
   * Fit the map to the available space.
   */
  fit.fitMap = function () {
    let mapWidth = fit.getAvailableMapWidth();
    document.querySelector(".map-container").style.width = `${mapWidth}px`;
    }

  return fit;
}

export default Fit();