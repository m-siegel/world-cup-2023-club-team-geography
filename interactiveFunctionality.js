import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import fit from "./fit.js";
import dao from "./datastore/dao.js";
import dataRender from "./dataRender.js";

/**
 * Methods to provide interative functionality.
 * @returns 
 */
function InteractiveFunctionality() {
  let interactiveFunctionality = {};

  interactiveFunctionality.PROJECTION_TYPE = "geoEquirectangular";
  interactiveFunctionality.allNationalTeams = [];
  interactiveFunctionality.selectedNationalTeams = []; // Changes by menu selection

/**
 * Sets the items of the map menu.
 */
  interactiveFunctionality.setUpMenu = function (changeHandler=interactiveFunctionality.handleCheckboxChangeForChoropleth) {
  let teams = dao.getNationalTeamsObjArray();
  // Inefficient but only done once.
  d3.select(".map-menu-vertical .groupStageFinishers")
    .selectAll("div.item")
    .data(teams.filter((t) => t.placed === "Group Stage"))
    .join("div.item")
    .html(
      (t) =>
        `<input type="checkbox" id="${t.country}" name="${
          t.country
        }" value="${t.country.toLowerCase()}" checked>
      <label for="${t.country}">${t.country}</label>
      <br>`
    )
    .each((d) => {
      interactiveFunctionality.selectedNationalTeams.push(d.country.toLowerCase());
      interactiveFunctionality.allNationalTeams.push(d.country.toLowerCase());
    });
  d3.select(".map-menu-vertical .roundOf16Finishers")
    .selectAll("div.item")
    .data(teams.filter((t) => t.placed === "Round of Sixteen"))
    .join("div.item")
    .html(
      (t) =>
        `<input type="checkbox" id="${t.country}" name="${
          t.country
        }" value="${t.country.toLowerCase()}" checked>
      <label for="${t.country}">${t.country}</label>
      <br>`
    )
    .each((d) => {
      interactiveFunctionality.selectedNationalTeams.push(d.country.toLowerCase());
      interactiveFunctionality.allNationalTeams
      .push(d.country.toLowerCase());
    });
  d3.select(".map-menu-vertical .quarterfinalFinishers")
    .selectAll("div.item")
    .data(teams.filter((t) => t.placed === "Quarterfinals"))
    .join("div.item")
    .html(
      (t) =>
        `<input type="checkbox" id="${t.country}" name="${
          t.country
        }" value="${t.country.toLowerCase()}" checked>
      <label for="${t.country}">${t.country}</label>
      <br>`
    )
    .each((d) => {
      interactiveFunctionality.selectedNationalTeams.push(d.country.toLowerCase());
      interactiveFunctionality.allNationalTeams.push(d.country.toLowerCase());
    });

    d3.select(".map-menu-vertical .semifinalFinishers")
    .selectAll("div.item")
    .data(teams.filter((t) => (t.placed === "Fourth Place" || t.placed === "Third Place")))
    .join("div.item")
    .html(
      (t) =>
        `<input type="checkbox" id="${t.country}" name="${
          t.country
        }" value="${t.country.toLowerCase()}" checked>
      <label for="${t.country}">${t.country} (${t.placed})</label>
      <br>`
    )
    .each((d) => {
      interactiveFunctionality.selectedNationalTeams.push(d.country.toLowerCase());
      interactiveFunctionality.allNationalTeams.push(d.country.toLowerCase());
    });
    d3.select(".map-menu-vertical .finalists")
    .selectAll("div.item")
    .data(teams.filter((t) => (t.placed === "Second Place" || t.placed === "Champions")))
    .join("div.item")
    .html(
      (t) =>
        `<input type="checkbox" id="${t.country}" name="${
          t.country
        }" value="${t.country.toLowerCase()}" checked>
      <label for="${t.country}">${t.country} (${t.placed})</label>
      <br>`
    )
    .each((d) => {
      interactiveFunctionality.selectedNationalTeams.push(d.country.toLowerCase());
      interactiveFunctionality.allNationalTeams.push(d.country.toLowerCase());
    });
  
    // Must be on the input element, so can't be combined with the selections above.
  d3.selectAll(".map-menu-vertical input").on("change", (e) => {
    changeHandler(e);
  });
}

interactiveFunctionality.handleCheckboxChange = function (e) {
  interactiveFunctionality.handleCheckboxChangeForChoropleth(e);
}

interactiveFunctionality.handleCheckboxChangeForBubbles = function (e) {
  if (e.target.checked) {
    interactiveFunctionality.selectedNationalTeams.push(e.target.value);
  } else {
    interactiveFunctionality.selectedNationalTeams = interactiveFunctionality.selectedNationalTeams.filter(
      (t) => t !== e.target.value
    );
  }
  dataRender.drawCircles(interactiveFunctionality.selectedNationalTeams);
}

interactiveFunctionality.handleCheckboxChangeForChoropleth = function (e) {
  if (e.target.checked) {
    dataRender.updateMap([e.target.value], []);
  } else {
    dataRender.updateMap([], [e.target.value]);
  }
}

interactiveFunctionality.addWindowEventListeners = function () {
  window.addEventListener("resize", (e) => {
    fit.fitToWindow();
  });
  window.addEventListener("scroll", fit.setVerticalMenuHeight);
}

  return interactiveFunctionality;
}

export default InteractiveFunctionality();
