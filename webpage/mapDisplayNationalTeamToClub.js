import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// TODO -- this is temporary
function setUpMap(geojson) {
  // TODO: get width from viewport
  
  // TODO: also must change on resize
  let width = document.querySelector("svg.map").clientWidth;
  let height = document.querySelector("svg.map").clientHeight;

  // TODO: how to get y
  let projection = d3
  .geoMercator().fitSize([width, height], geojson);
  let geoGenerator = d3.geoPath().projection(projection);

  let map = d3.select("#mapCountryToClubBefore").selectAll("path").data(geojson.features);
  map.enter().append("path").attr("d", geoGenerator);
}

// TODO: temporary -- figure out how to read from file on github or something
d3.json("http://localhost:8000/countriesGeoJSON.json")
.then((geojson) => setUpMap(geojson));
