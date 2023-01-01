const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./auth.json');
const { getFilepaths } = require('./utils');
const path = require('node:path');
const guildId = '383889230704803851'; // Arkchat guildId
// does clientId need to be dynamic with sharding?

const cliArgs = process.argv.slice(2);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getFilepaths(commandsPath);
const allCommands = commandFiles.map(filepath => require(filepath).data.toJSON());
/**
 * TODO: create a "getCommands" function and do some better logic. Also allow deploying of specific commands for a guild
 * Example commands:
 * 	1) command: node deployCommands.js
 * 		effect: deploys all commands to the Arkchat guild, for testing
 * 	2) command: node deployCommands.js -g fun/stats.js
 * 		effect: deploys the `stats` command globally
 * 	3) command: node deployCommands.js -g --all
 * 		effect: deploys all commands globally
 */
const commands = (!cliArgs.includes('-g') && !cliArgs.includes('--global')) ?
	allCommands :
	(cliArgs.includes('--all') ?
		allCommands :
		[require(path.join(__dirname, 'commands', cliArgs.find(arg => arg.includes('.js')))).data.toJSON()]
	);

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const route = (cliArgs.includes('-g') || cliArgs.includes('--global')) ?
			Routes.applicationCommands(clientId) :
			Routes.applicationGuildCommands(clientId, guildId);
		const data = await rest.put(
			route,
			{ body: commands }
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();