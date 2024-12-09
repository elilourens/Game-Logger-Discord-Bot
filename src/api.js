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
        console.log(response.data);
        return response.data; 
        
    } catch (error) {
        console.error('Failed to fetch account data:', error.response ? error.response.data : error.message);
        return null; 
    }
    
}

module.exports = {
    getPuuidByGameName
};


