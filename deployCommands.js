const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./auth.json');
const { getFiles } = require('./utils');
const { startDatabase } = require('./database/db');
const path = require('node:path');
const arkchatGuildId = '383889230704803851';
// does clientId need to be dynamic with sharding?


const cliArgs = process.argv.slice(2);
const getCommandDetails = async () => {
	const commands = [];
	const baseCommandPath = path.join(__dirname, 'commands');
	const commandFiles = getFiles(baseCommandPath);
	let guildId = '';
	const deployGlobally = cliArgs.includes('-g') || cliArgs.includes('--global');

	if (cliArgs.includes('-r') || cliArgs.includes('--reset')) {
		guildId = arkchatGuildId;
	} else if (cliArgs.includes('-G') || cliArgs.includes('--guild')) {
		const db = await startDatabase('./database/db.json');

		let flagIndex = cliArgs.indexOf('-G');
		if (flagIndex < 0) {
			flagIndex = cliArgs.indexOf('--guild');
		}
		guildId = cliArgs[flagIndex + 1];
		const guildConfig = await db.get(`guilds[${guildId}]`).value();
		if (!guildConfig) {
			console.log('That server does not have a configuration set up. You must initialize the configuration and choose which commands to use in that server.');
			return ({ route: null, commands: null });
		}
		commandFiles.filter(cf => !cf.global)
			.reduce((acc, command) => {
				if (guildConfig[command.name].enabled) {
					acc.push(command.data.toJSON());
				}
				return acc;
			}, commands);
	} else {
		commandFiles.reduce((acc, command) => {
			if (command.global === deployGlobally) {
				acc.push(command.data.toJSON());
			}
			return acc;
		}, commands);
		guildId = arkchatGuildId;
	}

	const route = guildId ?
		Routes.applicationGuildCommands(clientId, guildId) :
		Routes.applicationCommands(clientId);

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
 * 		effect: deploys all global commands
 * 	3) command: node deployCommands.js -G 383889230704803851
 * 		effect: deploys commands to the guild based on their configuration
 * 	4) command: node deployCommands.js -r
 * 		effect: resets Arkchat guild-specific commands
 */
const rest = new REST({ version: '10' }).setToken(token);
const loadCommands = (async () => {
	const { route, commands } = await getCommandDetails();
	if (!route || !commands) {
		return;
	}
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
});

loadCommands();

module.exports = {
	loadCommands
};