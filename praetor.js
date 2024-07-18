// const path = require('node:path');
import path from 'node:path';
// const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
// const { token } = require('./auth.json');
import { token } from './auth.json';
// const { getFiles, getFilepaths, logError } = require('./utils');
import { getFiles, getFilepaths, logError } from './utils';

const clientOptions = {
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildIntegrations,
		GatewayIntentBits.GuildWebhooks,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessageTyping,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.AutoModerationConfiguration,
		GatewayIntentBits.AutoModerationExecution
	],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction]
};

const client = new Client(clientOptions);

client.commands = new Collection();

// Set up commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getFilepaths(commandsPath);
for (const filepath of commandFiles) {
	const command = require(filepath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filepath} is missing a required "data" or "execute" property.`);
	}
}

// Set up event listeners
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = getFiles(eventsPath);
for (const event of eventsFiles) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// default promise rejection handling
process.on('unhandledRejection', err => logError(client, err));

// last ditch error handling
process.on('uncaughtException', err => logError(client, err));

client.login(token);