const { EmbedBuilder } = require("discord.js");

function createMatchEmbed(data) {
    const participants = data.info.participants;
    const teams = data.info.teams;

    // Determine team results
    const teamResults = {};
    teams.forEach(team => {
        teamResults[team.teamId] = team.win ? "Win" : "Lose";
    });

    const blueTeamPlayers = participants.filter(p => p.teamId === 100);
    const redTeamPlayers = participants.filter(p => p.teamId === 200);

    // Build a single string for each team
    let blueTeamString = "";
    blueTeamPlayers.forEach(player => {
        const summonerName = player.summonerName || "Unknown";
        const championName = player.championName;
        const kda = `${player.kills}/${player.deaths}/${player.assists}`;
        // Add each player on a new line
        blueTeamString += `**${summonerName}**\n${championName} \n ${kda}\n\n`;
    });

    let redTeamString = "";
    redTeamPlayers.forEach(player => {
        const summonerName = player.summonerName || "Unknown";
        const championName = player.championName;
        const kda = `${player.kills}/${player.deaths}/${player.assists}`;
        redTeamString += `**${summonerName}**\n${championName} \n ${kda}\n\n`;
    });

    // Trim trailing spaces/newlines if any
    blueTeamString = blueTeamString.trim();
    redTeamString = redTeamString.trim();

    const embed = new EmbedBuilder()
        .setAuthor({ name: "League Logger" })
        .setTitle(`EUW - ${data.info.gameMode}`)
        .addFields(
            {
                name: `Blue Team (${teamResults[100]})`,
                value: blueTeamString || "\u200b",
                inline: true
            },
            {
                name: `Red Team (${teamResults[200]})`,
                value: redTeamString || "\u200b",
                inline: true
            }
        )
        .setColor("#00b0f4")
        .setFooter({
            text: "League Logger",
            iconURL: "https://i.pinimg.com/474x/c0/1f/99/c01f992cfe001354a1541a122c1a2bdd.jpg",
        })
        .setTimestamp();

    return embed;
}

module.exports = { createMatchEmbed };
