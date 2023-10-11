import {dirname, resolve} from "path";
import {fileURLToPath} from "url";
import common from "world-cup-2023-club-team-geography.common";

import foxScraper from "./foxSportsScraper.js";
import wikiScraper from "./wikipediaScraper.js";

function ScraperMain() {
    const scraperMain = {};

    scraperMain.__dirname = dirname(fileURLToPath(import.meta.url));
    scraperMain.pathToDatastoreDir = resolve(scraperMain.__dirname, "../datastore");

    scraperMain.scrapeAndUpdateData = async function () {
        // Team names from FoxScraper must be corrected by hand before Wikipedia 
        // scraping will work (or China and South Korea will be missed).
        // In the future, could get all data from Wiki instead of including Fox.
        // const nationalTeamDict = await foxScraper.writeBasicNationalTeamInfo(
        //     scraperMain.pathToDatastoreDir + "/nationalTeams.json");
        const nationalTeamDict = await common.readJson(scraperMain.pathToDatastoreDir + "/nationalTeams.json")
        const detailedPlayerInfo = await wikiScraper.writeDetailedPlayerInfo(
            nationalTeamDict, scraperMain.pathToDatastoreDir + "/playersByNationalTeam.json");
    }

    return scraperMain;
}

export default ScraperMain();
