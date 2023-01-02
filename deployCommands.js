const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./auth.json');
const { getFilepaths } = require('./utils');
const path = require('node:path');
const arkchatGuildId = '383889230704803851';
// does clientId need to be dynamic with sharding?

const cliArgs = process.argv.slice(2);
const getCommandDetails = () => {
	const commands = [];
	const baseCommandPath = path.join(__dirname, 'commands');
	let guildId = '';
	const deployGlobally = cliArgs.includes('-g') || cliArgs.includes('--global');

	if (cliArgs.includes('-G') || cliArgs.includes('--guild')) {
		let flagIndex = cliArgs.indexOf('-G');
		if (flagIndex < 0) {
			flagIndex = cliArgs.indexOf('--guild');
		}
		guildId = cliArgs[flagIndex + 1];
	} else {
		// deploys all commands to Arkchat
		const commandFiles = getFilepaths(baseCommandPath);
		const filteredCommands = commandFiles.reduce((acc, filepath) => {
			const command = require(filepath);
			if (!deployGlobally) {
				acc.push(command.data.toJSON());
			} else if (command.global) {
				acc.push(command.data.toJSON());
			}
			return acc;
		}, []);
		commands.push(...filteredCommands);
		guildId = arkchatGuildId;
	}

	const route = guildId ?
		Routes.applicationCommands(clientId) :
		Routes.applicationGuildCommands(clientId, guildId);

	return {
		commands,
		route
	};
};

/**
 * Example commands:
 * 	1) command: node deployCommands.js
 * 		effect: deploys all commands to the Arkchat guild, for testing
 * 	2) command: node deployCommands.js -g
 * 		effect: deploys all global commands, hardcoded in the `getCommandDetails()` function
 * 	3) command: node deployCommands.js -G 383889230704803851
 * 		effect: deploys all commands to a specific guild; config-based command exclusions to come
 */
const { route, commands } = getCommandDetails();

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			route,
			{ body: commands }
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();