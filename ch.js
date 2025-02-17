const axios = require("axios");
const fs = require("fs");
const path = require("path");

class CH {

    constructor() {
        
    }

    async _callAPI(ENDPOINT) {
        try {
            const response = await axios.get(ENDPOINT, {
                headers: {
                    "Accept": "application/json",
                    "Api-Key": "cr!CkH3r0s", // Replace with the correct API key
                    "Device-Type": "Chrome: 132.0.0.0",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
                    "Referer": "https://cricheroes.com/",
                    "Origin": "https://cricheroes.com",
                    "Sec-Ch-Ua": `"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"`,
                    "Sec-Ch-Ua-Mobile": "?0",
                    "Sec-Ch-Ua-Platform": `"Windows"`,
                    "Udid": "33f0e93e3c30665cfc5988b9f3ac8436"
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error fetching data:", error.message);
            throw new Error("Failed to fetch data from API");
        }
    }

    getCacheFilePath(tournamentId) {
        return path.join(__dirname, tournamentId + ".json");
    }

    async getTournamentTeams(tournamentId) {

        let jsonFilePath = this.getCacheFilePath(tournamentId);
        if (fs.existsSync(jsonFilePath)) {
            console.log("Returning data from cache file");
            return JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
        }

        const ENDPOINT = `https://cricheroes.com/_next/data/pOQT8buE0-bv4xxFJs-OD/tournament/${tournamentId}/tmpl-village-2/teams.json?tournamentId=${tournamentId}&tournamentName=tmpl-village-2&tabName=team`;

        try {
            console.log(`Fetching teams for tournament ID: ${tournamentId}`);
            const data = await this._callAPI(ENDPOINT);
            const teams = data?.pageProps?.tournamentDetails?.data?.teams || [];

            for (let team of teams) {
                console.log(`Fetching members for team: ${team.team_name} (ID: ${team.team_id})`);
                team.members = await this.getTeamMembers(team.team_id, team.team_name);
                for (let member of team.members) {
                    console.log(`Fetching stats for player: ${member.name} (ID: ${member.player_id})`);
                    member.stats = await this.getPlayerStats(member.player_id);
                }
            }

            fs.writeFileSync(jsonFilePath, JSON.stringify(teams, null, 2));
            console.log("Saved API response to cache file.");
            return teams;
        } catch (error) {
            console.error("Error fetching tournament teams:", error.message);
            return [];
        }
    }

    async getTeamMembers(teamId, teamName) {
        const ENDPOINT = `https://cricheroes.com/_next/data/pOQT8buE0-bv4xxFJs-OD/team-profile/${teamId}/${teamName}/members.json?teamId=${teamId}&teamName=${teamName}&tabName=members`;

        try {
            return (await this._callAPI(ENDPOINT))?.pageProps?.members?.data?.members || [];
        } catch (error) {
            console.error(`Error fetching members for team ${teamId}:`, error.message);
            return [];
        }
    }

    async getPlayerStats(playerId) {
        const ENDPOINT = `https://cricheroes.in/api/v1/player/get-player-statistic/${playerId}?pagesize=12`;

        try {
            return (await this._callAPI(ENDPOINT))?.data?.statistics || {};
        } catch (error) {
            console.error(`Error fetching stats for player ${playerId}:`, error.message);
            return {};
        }
    }

    async getTournamentData(tournamentId) {
        return await this.getTournamentTeams(tournamentId);
    }
}

module.exports = CH;