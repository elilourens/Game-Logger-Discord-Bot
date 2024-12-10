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

    if (interaction.commandName === 'add') {
        try {
            const accountName = interaction.options.getString('in-game-name');
            const tagline = interaction.options.getString('tagline');
            const region = interaction.options.getString('region');

            console.log(
                `Account Name: ${accountName}, Tagline: ${tagline}, Region: ${region}`
            );

            // Use await if getPuuidByGameName is async
            const puuid = await getPuuidByGameName(accountName, tagline, region);

            db.insertPlayer(accountName, puuid, region, tagline, (err, success) => {
                if (err) {
                    console.error(err.message);
                    return interaction.reply('Failed to add the player. Please try again.');
                }
                if (success) {
                    interaction.reply('Player added successfully.');
                } else {
                    interaction.reply('Player already exists.');
                }
            });
        } catch (error) {
            console.error(error.message);
            interaction.reply('An error occurred while processing your request.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);


process.on('SIGINT', () => {
    console.log('Closing database connection and bot...');
    db.close();
    
    process.exit();
});
