import fs from "fs";

function writeJSON(filename, jsonInterpretable) {
  fs.writeFile(filename, JSON.stringify(jsonInterpretable), (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function filter(geoJSON) {
  let filteredGeoJSON = { type: "FeatureCollection" };
  filteredGeoJSON.features = geoJSON.features.map((feature) => {
    let filteredFeature = {
      type: feature.type,
      geometry: feature.geometry,
      properties: {
        featurecla: feature.properties.featurecla,
        NAME: feature.properties.NAME,
        CONTINENT: feature.properties.CONTINENT,
        LABEL_X: feature.properties.LABEL_X,
        LABEL_Y: feature.properties.LABEL_Y,
        WIKIDATAID: feature.properties.WIKIDATAID,
      },
    };

    // If the area outside the shape is being filled, then undo this reversal.
    if (filteredFeature.geometry.type == "Polygon") {
      filteredFeature.geometry.coordinates[0] =
        filteredFeature.geometry.coordinates[0].reverse();
    } else if (filteredFeature.geometry.type == "MultiPolygon") {
      for (let i = 0; i < filteredFeature.geometry.coordinates.length; i++) {
        filteredFeature.geometry.coordinates[i][0] =
          filteredFeature.geometry.coordinates[i][0].reverse();
      }
    } else {
      console.log("Type: " + filteredFeature.geometry.type);
    }

    return filteredFeature;
  });
  filteredGeoJSON.features = filteredGeoJSON.features.reverse();
  return filteredGeoJSON;
}

async function readJSON(filename) {
  try {
    return await JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch (err) {
    console.log(err);
  }
}

function FilterMap() {
  let filtermap = {};
  filtermap.filterMap = async function () {
    // let json = await readJSON("ne_110m_admin_0_countries.json");    // countries (uk)
    let json = await readJSON("./ne_110m_admin_0_map_units.json");    // england, scotland, etc. distinguished
    writeJSON("./countriesGeoJSON.json", filter(json));
    console.log("Done filtering map.");
  };
  return filtermap;
}

export default FilterMap();
