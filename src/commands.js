const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const clientID = "1314384494580469832";

const commands = [
    {
        name: 'add',
        description: 'Add your account to the logger.',
        options: [
            {
                name: 'in-game-name',
                description: 'Your account name.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'tagline',
                description: 'Your account tagline. (characters after the #)',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'region',
                description: 'Your account region',
                type: ApplicationCommandOptionType.String,
                choices: [
                    { name: 'Europe', value: 'europe' },
                    { name: 'Asia', value: 'asia' },
                    { name: 'Americas', value: 'americas' }
                ],
                required: true,
            }
        ]
    },
    {
        name: 'help',
        description: 'Provides command usage information.',
    },
    {
        name: 'getplayerlist',
        description: 'Shows players being logged.',
    },
    {
        name: 'setloggerchannel',
        description: 'Sets the channel the logger will output to.',
        options: [
            {
                name: 'channel',
                description: 'Channel where logging will be outputted:',
                type: ApplicationCommandOptionType.Channel,
                required: true,
            }
        ]
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registering global slash commands...');
        await rest.put(
            Routes.applicationCommands(clientID), // Global registration
            { body: commands }
        );
        console.log('Global slash commands registered successfully.');
    } catch (error) {
        console.error(`Error registering commands: ${error}`);
    }
})();
