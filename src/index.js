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

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'add'){
        
    }
})

client.login(process.env.DISCORD_TOKEN);


process.on('SIGINT', () => {
    console.log('Closing database connection and bot...');
    db.close();
    
    process.exit();
});
