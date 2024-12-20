const axios = require('axios');
require('dotenv').config();

const baseRiotURLs = {
    'asia': 'https://asia.api.riotgames.com',
    'europe': 'https://europe.api.riotgames.com',
    'americas': 'https://americas.api.riotgames.com'
}
const API_KEY = process.env.RIOT_TOKEN;


async function getPuuidByGameName(gameName, tagLine, region) {
    
    const baseURL = baseRiotURLs[region.toLowerCase()]; // Fetch the base URL using the region parameter

    if (!baseURL) {
        console.error('Invalid region specified');
        return null;
    }

    try {
        const response = await axios.get(`${baseURL}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`, {
            headers: {
                'X-Riot-Token': API_KEY, // API key is sent as a header
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://developer.riotgames.com'
            }
        });
        console.log('puuid:' + response.data.puuid);
        return response.data.puuid; 
        
    } catch (error) {
        console.error('Failed to fetch account data:', error.response ? error.response.data : error.message);
        return null; 
    }
    
}

async function getRecentMatches(puuid,region) {
    const baseURL = baseRiotURLs[region.toLowerCase()];

    if (!baseURL) {
        console.error('Invalid region specified');
        return null;
    }

    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - 120;

    const queryParams = {
        start: 0,
        count: 1,
        startTime,
        endTime
    }

    const queryString = Object.entries(queryParams).map(([key,value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
    
    try {
        const response = await axios.get(`${baseURL}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?${queryString}`, {
            headers: {
                'X-Riot-Token': API_KEY,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://developer.riotgames.com'
            }
        }) ;
        console.log("Match IDs:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch player data for puuid ${puuid}`, error.response ? error.response.data : error.message);
        return null;
    }

}

async function getMatchDetails(region,matchId){
    const baseURL = baseRiotURLs[region.toLowerCase()];

    if (!baseURL) {
        console.error('Invalid region specified');
        return null;
    }

    try {
        const response = await axios.get(`${baseURL}/lol/match/v5/matches/${encodeURIComponent(matchId)}`, {
            headers: {
                'X-Riot-Token': API_KEY, // API key is sent as a header
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://developer.riotgames.com'
            }
        });
        //console.log(response.data);
        return response.data;
    } catch (error){
        console.error('Failed to fetch game data:', error.response ? error.response.data : error.message);
        return null; 
    }
}

module.exports = {
    getPuuidByGameName, getRecentMatches, getMatchDetails
};


