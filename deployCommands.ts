import { REST, Routes } from 'discord.js';
import path from 'node:path';
import { ARKEN_ASYLUM_GUILD_ID } from './constants/arken.ts';
import type { Command } from './types/command.type.ts';
import type { GuildConfig } from './types/db.type.ts';

import { startDatabase } from './database/db.js';
import { getFiles } from './utils.ts';

import authConfig from './auth.json' with { type: 'json' };
const { clientId, token } = authConfig; // does clientId need to be dynamic with sharding?

const cliArgs = process.argv.slice(2);
const getCommandDetails = async () => {
	const commands: ReturnType<Command['data']['toJSON']>[] = [];
	const baseCommandPath = path.join(__dirname, 'commands');
	const commandFiles = await getFiles(baseCommandPath) as Command[];
	let guildId = '';
	const deployGlobally = cliArgs.includes('-g') || cliArgs.includes('--global');

	if (cliArgs.includes('-r') || cliArgs.includes('--reset')) {
		guildId = ARKEN_ASYLUM_GUILD_ID;
	} else if (cliArgs.includes('-G') || cliArgs.includes('--guild')) {
		const db = await startDatabase('./database/db.json');

		let flagIndex = cliArgs.indexOf('-G');
		if (flagIndex < 0) {
			flagIndex = cliArgs.indexOf('--guild');
		}
		guildId = cliArgs[flagIndex + 1];
		const guildConfig = db.data.guilds[guildId];
		if (!guildConfig) {
			console.log(
				'That server does not have a configuration set up. You must initialize the configuration and choose which commands to use in that server.',
			);
			return ({ route: null, commands: null });
		}
		commandFiles.filter(cf => !cf.global)
			.reduce((acc, command) => {
				const commandsConfig = guildConfig.commands;
				const key = command.name as keyof NonNullable<GuildConfig['commands']>;
				if (commandsConfig?.[key]?.enabled) {
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
		guildId = ARKEN_ASYLUM_GUILD_ID;
	}

	const route = guildId
		? Routes.applicationGuildCommands(clientId, guildId)
		: Routes.applicationCommands(clientId);

	return {
		commands,
		route,
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
export const loadCommands = async () => {
	const { route, commands } = await getCommandDetails();
	if (!route || !commands) {
		return;
	}
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			route,
			{ body: commands },
		) as Array<any>;

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
};

loadCommands();
