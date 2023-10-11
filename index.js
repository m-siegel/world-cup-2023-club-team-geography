import environment from "./environment.js";
import fit from "./fit.js";
import dao from "./datastore/dao.js";
import dataRender from "./dataRender.js";
import interactiveFunctionality from "./interactiveFunctionality.js";

async function launchPage() {
  // TODO: manage order (must load geojson before can fit; must init dao before can draw bubbles, etc)
  await dao.init(environment.rootDir + "datastore/");
  let geojson = await dao.getMap();
  dataRender.init(geojson)

  interactiveFunctionality.addWindowEventListeners();

  interactiveFunctionality.setUpMenu();

  fit.fitToWindow();
  dataRender.drawMap();

  dataRender.getCentroids();
  dataRender.setRadius(interactiveFunctionality.allNationalTeams);
  dataRender.drawCircles(interactiveFunctionality.selectedNationalTeams);
}

launchPage();
