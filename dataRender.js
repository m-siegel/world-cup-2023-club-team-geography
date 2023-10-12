import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import dao from "./datastore/dao.js";
import style from "./style.js";

/**
 * Methods to render data.
 * @returns 
 */
function DataRender() {
  let dataRender = {};

  dataRender.PROJECTION_TYPE = "geoEquirectangular";
  dataRender.geojson = {};
  dataRender.radius = {};
  dataRender.geoGenerator = {};

  dataRender.countryCentroids = {}; // Change on resize

  dataRender.mapPathElemMap = {};
  dataRender.colorScale = {};

  dataRender.init = function (json) {
    dataRender.geojson = json;
  }

  dataRender.drawMap = function () {
    let width = document.querySelector(".map-container").clientWidth;
    let height = .6 * width;
  
    let projection = d3[dataRender.PROJECTION_TYPE]().fitSize([width, height], dataRender.geojson);
    dataRender.geoGenerator = d3.geoPath().projection(projection);
  
    let map = d3
      .select("#mapCountryToClubBefore g.map")
      .selectAll("path")
      .data(dataRender.geojson.features);
    map
      .enter()
      .append("path")
      .attr("d", dataRender.geoGenerator)
      .each(function (d) {
        // So elements can be accessed directly later.
        dataRender.mapPathElemMap[this.__data__.properties.NAME.toLowerCase()] = this;
      });
  };

  dataRender.setRadius = function (fromTeams) {
    let clubCountries = dao.getPlayersByClubCountry(fromTeams);
    let mapWidth = document.querySelector(".map-container").clientWidth;
  
    const circleScaleDivisor = 60;    // Scale radii relative to map size.
    dataRender.radius = d3.scaleSqrt(
      [0, d3.max(clubCountries, (d) => d.players.length)],
      [0, Math.ceil(mapWidth / circleScaleDivisor)]
    );
  }

  dataRender.getCentroids = function () {
    d3.select("#mapCountryToClubBefore g.map")
      .selectAll("path")
      .each((d, i) => {
        dataRender.countryCentroids[d.properties.NAME] = dataRender.geoGenerator.centroid(d);
      });
  
    // TODO: I think this would give the longitude, latitude if it could be projected. Haven't been able to find naturalEarth documentaion.
    // .selectAll("path").each((d, i) => {dataRender.countryCentroids[d.properties.NAME] = [d.properties.LABEL_X, d.properties.LABEL_Y];});
  }

  dataRender.drawCircles = function (forTeams) {
    // TODO: make more efficient.
    let clubCountries = dao.getPlayersByClubCountry(forTeams);
    clubCountries.forEach((d) => {if (d.name == "Unattached") {console.log(d.name)}})
  
    // Scaling the radius here would keep the biggest circles the same size (easier to see), 
    // but it would be harder to see changes with teams checked/unchecked.
    // const radius = d3.scaleSqrt([0, d3.max(clubCountries, d => d.players.length)], [0, 20]);
  
    d3.select("#mapCountryToClubBefore .circles")
      .selectAll("circle")
      .data(clubCountries)
      .join("circle")
      .attr("transform", (d) => {
        let centroid = dataRender.countryCentroids[d.name];
        if (centroid) {
          return `translate (${centroid})`;
        }
        // TODO: Handle case where there's no centroid (unaffiliated players)
      })
      .attr("r", (d) => dataRender.radius(d.players.length));
  };

  // TODO: put elsewhere?
  dataRender.enhanceMapDataWithPlayerCount = function (playerCounts = {}) {
    dataRender.geojson.features.forEach((feature) => {
      feature.properties.playerCount =
        feature.properties.NAME in playerCounts
          ? playerCounts[feature.properties.name]
          : 0;
    });
  };

  dataRender.updateMap = function (teamNamesToAdd=[], teamNamesToRemove=[]) {
    let clubTeamToAddTo = dao.getPlayersByClubCountry(teamNamesToAdd);
    dataRender.addToMapCountryCountAttribute(clubTeamToAddTo);
    let clubTeamToRemoveFrom = dao.getPlayersByClubCountry(teamNamesToRemove);
    dataRender.addToMapCountryCountAttribute(
      clubTeamToRemoveFrom,
      -1
    );

    function getNames(teamArr) {
      return teamArr.map((t) => t.name.toLowerCase())
    }
    let temp = new Set([...getNames(clubTeamToAddTo), ...getNames(clubTeamToRemoveFrom)]);
    dataRender.recolorCountries(temp);
  };

  // helper
  dataRender.addToMapCountryCountAttribute = function(countsArray, sign = 1) {
    sign = sign >= 1 ? 1 : -1;
    countsArray.forEach((clubCountry) => {
      // TODO: note error if playercount undefined
      try {
          dataRender.mapPathElemMap[
            clubCountry.name.toLowerCase()
          ].__data__.properties.playerCount += sign * clubCountry.playerCount;
      } catch (err) {
        console.warn("addToMapCountryCountAttribute failed for " + clubCountry.name)
      }
    });
  }

  dataRender.recolorCountries = function (countryNamesArray) {  // iterable
    countryNamesArray.forEach((name) => {
      d3.select(dataRender.mapPathElemMap[name]).style("fill", (d) => {
        if (d.properties.playerCount) {
          return dataRender.colorScale(d.properties.playerCount)
        }
      });
    });
  };

  dataRender.setColorScale = function (nationalTeamNames) {
    let clubCountries = dao.getPlayersByClubCountry(nationalTeamNames);
    dataRender.colorScale = d3
      .scaleLinear()
      // TODO: maybe more benchmarks. other scale function?
      .domain([1, 23, d3.max(clubCountries, (d) => d.players.length)])
      .range(["brown", "yellow", style.accentColor2])
  };

  return dataRender;
}

export default DataRender()
