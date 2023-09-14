import {dirname, resolve} from "path";
import {fileURLToPath} from "url";

import foxScraper from "./foxSportsScraper.js";
import wikiScraper from "./wikipediaScraper.js";

function ScraperMain() {
    const scraperMain = {};

    scraperMain.__dirname = dirname(fileURLToPath(import.meta.url));
    scraperMain.pathToDatastoreDir = resolve(scraperMain.__dirname, "../datastore");

    scraperMain.scrapeAndUpdateData = async function () {
        const nationalTeamDict = await foxScraper.writeBasicNationalTeamInfo(
            scraperMain.pathToDatastoreDir + "/nationalTeams.json");
        const detailedPlayerInfo = await wikiScraper.writeDetailedPlayerInfo(
            nationalTeamDict, scraperMain.pathToDatastoreDir + "/playersByNationalTeam.json");
    }

    return scraperMain;
}

export default ScraperMain();
