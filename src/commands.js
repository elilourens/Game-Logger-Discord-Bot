const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();


const clientID = "1314384494580469832";
const guildID = "871685165477408829";

const commands = [
    {
        name: 'add',
        description: 'Add your account to the logger.',
        options: [
            {
                name: 'in-game-name',
                description: 'Your account name.',
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'tagline',
                description: 'Your account tagline. (characters after the #)',
                type: ApplicationCommandOptionType.String,
            },
            {
                name: 'region',
                description: 'Your account region',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'Europe',
                        value: 'europe'
                    },
                    {
                        name: 'Asia',
                        value: 'asia'
                    },
                    {
                        name: 'Americas',
                        value: 'americas'
                    }
                ]
            }
        ]
    },
    {
        name: 'help',
        description: 'add syntax: remove syntax:',
    },
];

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(clientID,guildID),
            { body: commands }
        )
        console.log("slash commands registered.")
    } catch (error) {
        console.log(`Error with command: ${error}`);
    }
})();

