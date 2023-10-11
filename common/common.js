import fs from "fs";

function Common() {
    const common = {};

    // Data files
    common.PLAYERS_BY_NATIONAL_TEAM_FILE = "playersByNationalTeam.json";
    common.NATIONAL_TEAMS_FILE = "nationalTeams.json";

    // Farthest the team got.
    function getPlacementConstants() {
        const placements = {};
        placements.GROUP = "Group Stage";
        placements.KNOCKOUT = "Round of Sixteen";
        placements.QUARTERS = "Quarterfinals";
        placements.FOURTH = "Fourth Place";
        placements.THIRD = "Third Place";
        placements.SECOND = "Second Place";
        placements.FIRST = "Champions";
        return placements;
    }

    common.PLACEMENTS = getPlacementConstants();

    // Governing bodies.
    function getConfederationConstants() {
        const confederations = {};
        confederations.AFC = "AFC";
        confederations.CAF = "CAF";
        confederations.CONCACAF = "CONCACAF";
        confederations.CONMEBOL = "CONMEBOL";
        confederations.OFC = "OFC";
        confederations.UEFA = "UEFA";
        return confederations;
    }

    common.CONFEDERATIONS = getConfederationConstants();

    // Classes
    common.NationalTeam = function NationalTeam(country, nickname = country, placed = common.PLACEMENTS.GROUP, confederation = "UNKNOWN") {
        this.country = country;
        this.nickname = nickname;
        this.placed = placed;  // Group Stage, Round of 16, Quarter-finals, Semi-finals (Fourth, Third), Final (Second, First)
        this.confederation = confederation;
        this.wikipediaUrl = "";
    };

    common.Player = function Player(name, nationalTeam, position = "N/A", precedingClub = null, followingClub = null) {
        this.name = name;
        this.nationalTeam = nationalTeam;
        this.precedingClub = precedingClub;  // Played at before the World Cup
        this.followingClub = followingClub;  // Will play at after the World Cup
        this.position = position;  // G, D, M, F, N/A
        this.wikipediaUrl = "";
    };

    common.ClubTeam = function ClubTeam(name, association = null, wikiUrl = "") {
        this.name = name;
        this.wikipediaUrl = wikiUrl;
        this.association = association;
    };

    common.ClubAssociation = function ClubAssociation(name, country, wikiUrl = "") {
        this.name = name;
        this.country = country;
        this.wikipediaUrl = wikiUrl;
        // team list?
    }

    common.Country = function Country(name, mapCoordinates = {"x": 0, "y": 0}) {
        this.name = name;
        this.mapCoordinates = mapCoordinates;
    }

    common.writeJson = async function (filename, jsonInterpretable) {
        await fs.writeFile(filename, JSON.stringify(jsonInterpretable), (err) => {
            if (err) {
                console.log(err);
            }
        });
    };

    common.readJson = async function (filename) {
        try {
            return await JSON.parse(fs.readFileSync(filename, "utf8"));
        } catch (err) {
            console.log(err);
        }
    };

    return common;
}

export default Common();
