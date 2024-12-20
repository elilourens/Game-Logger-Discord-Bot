const {Client, IntentsBitField} = require('discord.js');
const db = require('./database');
const { createMatchEmbed } = require('./embed');
const { getPuuidByGameName, getRecentMatches, getMatchDetails } = require('./api');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', async (c) => {


    
   

    

    

    





    console.log(`${c.user.username} is now online`);

    
    setInterval(() => {
        const loggedMatches = {};
        db.getLoggingChannels((err, rows) => {
            if (err) {
                return console.error('Error fetching logging channels:', err.message);
            }

            rows.forEach(async (row) => {
                const channel = client.channels.cache.get(row.channel_id);
                if (!loggedMatches[channel.id]) {
                    loggedMatches[channel.id] = new Set();
                }
                if (channel) {
                    try {
                        const currentGuildId = channel.guild.id; 
                        const players = await db.getAllPlayers(currentGuildId);

                        if (players.length === 0) {
                            await channel.send('No players are being logged in this server.');
                        } else {
                            
                           for (const player of players) {
                                const puuid = player.puuid;
                                const region = player.region;

                                const matchData = await getRecentMatches(puuid, region);
                                


                                if (matchData.length > 0) {
                                    console.log(matchData[0]);
                                    if(loggedMatches[channel.id].has(matchData[0])){
                                        continue;
                                    }
                                    
                                    const matchDetails = await getMatchDetails(region,matchData[0]);
                                    const embed = createMatchEmbed(matchDetails);
                                    await channel.send({ content: `Recent match for ${player.username}`, embeds: [embed] });
                                    loggedMatches[channel.id].add(matchData[0]);
                                } else {
                                    
                                }
                           }
                        }
                    } catch (error) {
                        console.error(`Error fetching or sending player list: ${error.message}`);
                        await channel.send('An error occurred while fetching the player list.');
                    }
                } else {
                    console.error(`Channel with ID ${row.channel_id} not found.`);
                }   
            });
        });
    }, 2 * 60 * 1000); 
});

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

    if(interaction.commandName === 'setloggerchannel'){
        const channel = interaction.options.getChannel('channel');

        if(!channel || channel.type !== 0){
            return await interaction.reply({
                content: "Please mention a valid text channel.",
                ephemeral: true,
            });
        }

        db.setLoggingChannel(guildId,channel.id, (err) => {
            if(err) {
                console.error('Error setting a logging channel:', err.message);
                return interaction.reply('Failed to set the logging channel.');
            }
            interaction.reply(`Logging Channel Succeeded. ${channel}`)
        })
    }
});

client.login(process.env.DISCORD_TOKEN);


process.on('SIGINT', () => {
    console.log('Closing database connection and bot...');
    db.close();
    
    process.exit();
});
