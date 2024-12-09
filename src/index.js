const {Client, IntentsBitField} = require('discord.js');
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

client.login(process.env.DISCORD_TOKEN);

