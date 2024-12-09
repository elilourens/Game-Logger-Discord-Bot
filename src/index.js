const {Client, IntentsBitField} = require('discord.js');
const db = require('./database');
const { getPuuidByGameName } = require('./api');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready',(c) => {
    console.log(`${c.user.username} is now online`)
})

client.on('messageCreate', (message) => {
    if (message.author.bot){
        return;
    }

})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const guildId = interaction.guild.id;

    if (interaction.commandName === 'getplayerlist') {
        
    
        try {
            const players = await db.getAllPlayers(guildId);
            if (players.length === 0) {
                await interaction.reply('No players are being logged in this server.');
            } else {
                const playerList = players
                    .map(
                        (player) =>
                            `Username: ${player.username}, Region: ${player.region}, Tagline: ${player.tagline}`
                    )
                    .join('\n');
                await interaction.reply(`Players in this server:\n${playerList}`);
            }
        } catch (err) {
            console.error('Error fetching players:', err.message);
            await interaction.reply('An error occurred while fetching the player list.');
        }
    }

    if (interaction.commandName === 'add') {
        const username = interaction.options.getString('in-game-name');
        const tagline = interaction.options.getString('tagline');
        const region = interaction.options.getString('region');

        const puuid = await getPuuidByGameName(username, tagline, region); // Replace with your actual logic

        db.insertPlayer(username, puuid, region, tagline, guildId, (err, success) => {
            if (err) {
                console.error('Error inserting player:', err.message);
                return interaction.reply('Failed to add the player.');
            }
            if (success) {
                interaction.reply(`Player ${username} added successfully.`);
            } else {
                interaction.reply(`Player ${username} is already logged.`);
            }
        });
    }
});

client.login(process.env.DISCORD_TOKEN);


process.on('SIGINT', () => {
    console.log('Closing database connection and bot...');
    db.close();
    
    process.exit();
});
