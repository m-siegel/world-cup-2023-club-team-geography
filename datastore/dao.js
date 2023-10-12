import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Util.
/**
 * Check whether the given object is null or empty.
 * @param {Object} obj 
 * @returns True if the object is null or empty; false otherwise.
 */
function isEmpty(obj) {
  return (!obj || Object.keys(obj).length === 0);
}

function DAO () {
  let dao = {};
  dao.data_dir = "./";

  dao.playersByNationalTeam = {};

  dao.init = async function (rootDir) {
    dao.data_dir = rootDir;

    let json = await (await fetch(dao.data_dir + "playersByNationalTeam.json")).json();
    // Get dict {nationalTeams: {clubCountries: [players]}}
    Object.keys(json).forEach((nationalTeamKey) => {
      dao.playersByNationalTeam[nationalTeamKey] = {};
      Object.keys(json[nationalTeamKey]).forEach(playerKey => {
        let player = json[nationalTeamKey][playerKey];
        let playerCountry = player.precedingClub.association.country;  // Could be undefined.
        
        if (!(playerCountry in dao.playersByNationalTeam[nationalTeamKey])) {
          dao.playersByNationalTeam[nationalTeamKey][playerCountry] = [];
        }
        dao.playersByNationalTeam[nationalTeamKey][playerCountry].push(player);
      })
    });

    dao.nationalTeams = await (await fetch(dao.data_dir + "nationalTeams.json")).json();

    dao.worldMap = await d3.json(dao.data_dir + "countriesGeoJSON.json");    // Exploring different ways of accessing json.

    if (!dao.isInitialized) {
      throw new Error("Initilization failed.");
    }
  }

  dao.isInitialized = function() {
    if (isEmpty(dao.playersByNationalTeam) || isEmpty(dao.nationalTeams) || isEmpty(dao.worldMap)) {
      return false;
    }
    return true;
  }

  /**
   * Get array of players for the given national team.
   * @param {*} teamName 
   * @returns 
   */
  dao.getArrayOfPlayersForNationalTeam = function (teamName) {
    let teamDict = dao.playersByNationalTeam[teamName];
    teamDict = teamDict ? teamDict : {};
    let teamArray = [];
    Object.keys(teamDict).forEach((clubCountryKey) => {
      teamArray = teamArray.concat(teamDict[clubCountryKey]);
    })
    return teamArray;
  }

  dao.getPlayersByClubCountry = function (teamNameArray) {
    let playersByClubCountry = [];

    // Map club countries to players for all national teams requested.
    let clubCountryDict = {};
    teamNameArray.forEach(teamName => {
      if (teamName in dao.playersByNationalTeam) {
        Object.keys(dao.playersByNationalTeam[teamName]).forEach((clubCountryKey) => {
          if (!(clubCountryKey in clubCountryDict)) {
            clubCountryDict[clubCountryKey] = [];
          };
          clubCountryDict[clubCountryKey] = clubCountryDict[clubCountryKey].concat(dao.playersByNationalTeam[teamName][clubCountryKey]);
        })
      } else {
        console.warn(`Cannot find match for ${teamName} in playersByNationalTeam keys.`);
      }
    });

    // d3 Operates off of arrays, not dictionaries.
    Object.keys(clubCountryDict).forEach((countryKey) => {
      let temp = {};
      temp.name = countryKey;
      temp.players = clubCountryDict[countryKey];
      temp.playerCount = temp.players.length;
      playersByClubCountry.push(temp);
    });

    return playersByClubCountry;
  }

  /**
   * Get the names of the national teams.
   * @returns 
   */
  dao.getNationalTeamNames = function () {
    return Object.keys(dao.nationalTeams);
  }

  dao.getNationalTeamsObjArray = function () {
    let teams = [];
    Object.keys(dao.nationalTeams).forEach((key) => {
      teams.push(dao.nationalTeams[key]);
    })
    return teams;
  }

  dao.getMap = function () {
    return dao.worldMap;
  }

  return dao;
}

export default DAO();