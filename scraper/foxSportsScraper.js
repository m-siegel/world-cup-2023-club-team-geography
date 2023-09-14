import * as fs from "fs";
import common from "world-cup-2023-club-team-geography.common";
import scraperCommon from "./common.js";

function FoxSportsScraper() {
    const mod = {}

    mod.FOX_TEAM_LIST_URL = "https://www.foxsports.com/soccer/2023-fifa-womens-world-cup/teams";
    mod.FOX_BRACKET_URL = "https://www.foxsports.com/soccer/2023-fifa-womens-world-cup/bracket";

    /**
     * Returns the full URL for a team roster, given the team's relative URL from FoxSports.
     * @param teamUrl    Relative URL from FoxSports, e.g. "soccer/argentina-women-team".
     * @returns {`https://www.foxsports.com/${string}-roster`}
     */
    mod.getFoxRosterUrlFromTeamUrl = function (teamUrl) {
        return `https://www.foxsports.com/${teamUrl}-roster`;
    }

    /**
     * Scrapes national team names and FoxSports roster links from FoxSports.
     *
     * @returns {Promise<*[{"country": string, "url": string}]>}  List of team names and their FoxSports URLs.
     */
    mod.getNationalTeamsAndUrls = async function getNationalTeamsAndUrls() {
        const nationalTeams = [];
        try {
            const [html, loadedHtml] = await scraperCommon.getLoadedHtml(mod.FOX_TEAM_LIST_URL);

            loadedHtml(".body-content", html)
                .find(".entity-list-row-container")
                .each(function () {
                    const name = loadedHtml(this)
                        .find(".entity-list-row-title")
                        .text()
                        .replace("Rep.", "Republic");
                    // const teamRosterUrl = `https://www.foxsports.com/${loadedHtml(this).attr("href")}-roster`;
                    const teamRosterUrl = mod.getFoxRosterUrlFromTeamUrl(loadedHtml(this).attr("href"));
                    nationalTeams.push({"country": name, "url": teamRosterUrl});
                })
        } catch (err) {
            console.log(err);
        }
        return nationalTeams;
    };

    /**
     * Update dictionary of teams to include the team's placement in the tournament (e.g. quarterfinals).
     * @param teamsDict    Dictionary of `common.NationalTeam`s that includes all teams from the tournament.
     * @returns {Promise<*>}    The parameter dictionary after update.
     */
    mod.getPlacementForNationalTeams = async function getPlacementForNationalTeams(teamsDict) {
        try {
            const [html, loadedHtml] = await scraperCommon.getLoadedHtml(mod.FOX_BRACKET_URL);
            loadedHtml(".rounds.left-to-right.bracketTemplate", html)
                .find(".round")
                .each(function () {
                    if (loadedHtml(this).hasClass("level-zero")) {
                        loadedHtml(this)
                            .find(".is-loser .score-team-name.team .scores-text")
                            .each(function () {
                                teamsDict[loadedHtml(this).text().toLowerCase()].placed = common.PLACEMENTS.KNOCKOUT;
                            })
                    } else if (loadedHtml(this).hasClass("level-one")) {
                        loadedHtml(this)
                            .find(".is-loser .score-team-name.team .scores-text")
                            .each(function () {
                                teamsDict[loadedHtml(this).text().toLowerCase()].placed = common.PLACEMENTS.QUARTERS;
                            })
                    } else if (loadedHtml(this).hasClass("level-last")) {
                        const final = loadedHtml(this).find(".bracketChip:not(.third-place)");
                        const thirdPlayoff = loadedHtml(this).find(".bracketChip.third-place");

                        const losingClasses = ".score-team-row.is-loser .score-team-name.team .scores-text";
                        const winningClasses = ".score-team-row:not(.is-loser) .score-team-name.team .scores-text";

                        teamsDict[final.find(winningClasses).text().toLowerCase()].placed = common.PLACEMENTS.FIRST;
                        teamsDict[final.find(losingClasses).text().toLowerCase()].placed = common.PLACEMENTS.SECOND;
                        teamsDict[thirdPlayoff.find(winningClasses).text().toLowerCase()].placed = common.PLACEMENTS.THIRD;
                        teamsDict[thirdPlayoff.find(losingClasses).text().toLowerCase()].placed = common.PLACEMENTS.FOURTH;
                    }
                })
        } catch (err) {
            console.log(err);
        }
        return teamsDict;
    };

    /**
     * Scrape the player roster for the team with the given URL. For each player in the roster, creates a Player object
     * with their name, country and position.
     * @param country    (string) The country of the team whose roster to get.
     * @param foxTeamRosterUrl    (string) The URL of the page to scrape.
     * @returns {Promise<*[common.Player]>}
     */
    mod.getRosterForNationalTeam = async function getRosterForNationalTeam(country, foxTeamRosterUrl) {
        const players = [];
        try {
            const [html, loadedHtml] = await scraperCommon.getLoadedHtml(foxTeamRosterUrl);

            loadedHtml(".roster", html)
                .find(".table-roster tr")
                .each(function () {
                    const name = loadedHtml(this)
                        .find(".table-entity-name h3")
                        .text()
                        .trim();
                    const position = loadedHtml(this)
                        .find("[data-index='1'] div")
                        .text()
                        .trim();
                    if (name) {
                        players.push(new common.Player(name, country, position));
                    }
                })
        } catch (err) {
            console.log(err);
        }
        return players;
    };

    /**
     * Get a dictionary of lowercase team name: `common.NationalTeam`, with the `country` and `placement` attributes of
     * the team filled in.
     * @param teamNameObjArray    ([{"country": string}]) Array of objects with the country name.
     * @returns {Promise<{"country name": common.NationalTeam}>}
     */
    mod.getNationalTeamsDict = async function getNationalTeamsDict(teamNameObjArray) {
        const teamsDict = {};
        teamNameObjArray.forEach((team) => {
            teamsDict[team.country.toLowerCase()] = new common.NationalTeam(team.country);
        })
        return await mod.getPlacementForNationalTeams(teamsDict);
    };

    /**
     * Get a dictionary of <lowercase country name> to <array of `common.Player`> for all players on each team in the
     * given dictionary.
     * @param teamsAndUrls    ([{"country": string, "url": string}]) Array of objects with the team name and url to the
     *                        team roster page.
     * @returns {Promise<{"<country name lower case>": [common.Player]}>}
     */
    mod.getPlayersByNationalTeam = async function getPlayersByNationalTeam(teamsAndUrls) {
        const playersByNationalTeam = {}
        for (const entry of teamsAndUrls) {
            playersByNationalTeam[entry.country] = await mod.getRosterForNationalTeam(entry.country, entry.url);
        }
        return playersByNationalTeam;
    };

    /**
     * /**
     * Write a dictionary of `common.NationalTeam`s, with country and placement data,
     * to the given filepath or `common.NATIONAL_TEAMS_FILE` json.
     * @returns {Promise<{"country name": common.NationalTeam}>}
     */
    mod.writeBasicNationalTeamInfo = async function (filepath = "") {
        filepath = filepath ? filepath : common.NATIONAL_TEAMS_FILE;
        const teamsAndUrls = await mod.getNationalTeamsAndUrls();
        const nationalTeamsDict = await mod.getNationalTeamsDict(teamsAndUrls);
        await common.writeJson(filepath, nationalTeamsDict);
        return nationalTeamsDict;
    };

    /**
     * Write a dictionary mapping national teams to [`common.Player`s], with country and name data for each player
     * to given filepath or `common.PLAYERS_BY_NATIONAL_TEAM_FILE` json.
     * @returns {Promise<{"<country name lower case>": common.Player[]}>}
     */
    mod.writeBasicPlayerInfo = async function (filepath = "") {
        filepath = filepath ? filepath : common.PLAYERS_BY_NATIONAL_TEAM_FILE;
        const teamsAndUrls = await mod.getNationalTeamsAndUrls();
        const playersByNationalTeamDict = await mod.getPlayersByNationalTeam(teamsAndUrls);
        await common.writeJson(filepath, playersByNationalTeamDict);
        return playersByNationalTeamDict;
    };

    return mod;
}

export default FoxSportsScraper();
