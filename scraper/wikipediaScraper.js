import * as fs from "fs";
import common from "world-cup-2023-club-team-geography.common";
import scraperCommon from "./common.js";

const WIKIPEDIA_BASE_URL = "https://en.wikipedia.org/";
const WIKI_WORLD_CUP_MAIN_URL = "https://en.wikipedia.org/wiki/2023_FIFA_Women%27s_World_Cup";
const WIKI_SQUADS_URL = "https://en.wikipedia.org/wiki/2023_FIFA_Women%27s_World_Cup_squads"

function WikipediaScraper() {
    const mod = {};

    /**
     * Get a dictionary mapping nationalTeams to players dictionary, which maps player name to `common.Player`.
     * Fills in name, country, position, and last-year club for each player.
     * @param nationalTeamDict    Dictionary with all participating country names (lower case) as keys.
     * @returns {Promise<{}>}
     */
    mod.getDetailedPlayerInfo = async function (nationalTeamDict) {
        const playersByNationalTeam = {};
        try {
            const [html, loadedHtml] = await scraperCommon.getLoadedHtml(WIKI_SQUADS_URL);

            loadedHtml("h3", html).each(function () {
                const heading = loadedHtml(this).find(".mw-headline").text();
                if (heading.toLowerCase() in nationalTeamDict) {
                    const teamRoster = {};

                    var table = loadedHtml(this).next();
                    while (!table.hasClass("wikitable")) {
                        table = loadedHtml(table).next();
                    }
                    loadedHtml(table).find("tbody tr.nat-fs-player").each(function () {
                        const positionCol = loadedHtml(this).find("td:first").next();
                        const nameCol = positionCol.next();
                        const clubCol = nameCol.next().next().next().next();
                        const [clubAssociation, club] = clubCol.children();
                        const player = new common.Player(
                            nameCol.find("a").text(),
                            heading,
                            positionCol.find("a").text());
                        player.wikiUrl = nameCol.find("a").attr("href").toString();
                        var precedingClubAssociation = new common.ClubAssociation(
                            loadedHtml(clubAssociation).find("a").attr("title"),
                            loadedHtml(clubAssociation).find("img").attr("alt"),
                            `${WIKIPEDIA_BASE_URL}${loadedHtml(clubAssociation).find("a").attr("href")}`
                        );
                        player.precedingClub = new common.ClubTeam(
                            clubCol.find("a").text(),
                            precedingClubAssociation,
                            `${WIKIPEDIA_BASE_URL}${loadedHtml(club).attr("href")}`
                        );
                        teamRoster[player.name.toLowerCase()] = player;
                    })

                    playersByNationalTeam[heading.toLowerCase()] = teamRoster;
                }
            })
        } catch (err) {
            console.log(err);
        }
        return playersByNationalTeam;
    };

    /**
     * Writes the results of `getDetailedPlayerInfo(nationalTeamDict)` to the given filepath or
     * `common.PLAYERS_BY_NATIONAL_TEAM_FILE`.
     * @param nationalTeamDict
     * @returns {Promise<{}>}
     */
    mod.writeDetailedPlayerInfo = async function (nationalTeamDict, filepath = "") {
        filepath = filepath ? filepath : common.PLAYERS_BY_NATIONAL_TEAM_FILE;
        const playersByNationalTeam = await mod.getDetailedPlayerInfo(nationalTeamDict);
        await common.writeJson(filepath, playersByNationalTeam);
        return playersByNationalTeam;
    }

    return mod;
}

export default WikipediaScraper();
