/// <reference path="./praetor.d.ts" />
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import type { ClientOptions } from 'discord.js';
import { Low } from 'lowdb';

import { getFiles, getFilepaths, logError } from './utils.ts';
import auth from './auth.json' with { type: 'json' };

class PraetorClient extends Client {
	commands: Collection<string, Command>;
	db!: Low<any>;

	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection<string, Command>();
	}
}

const clientOptions: ClientOptions = {
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildExpressions,
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

const client = new PraetorClient(clientOptions);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Set up commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getFilepaths(commandsPath);
for (const filepath of commandFiles) {
	const command = await import(pathToFileURL(filepath).toString());
	client.commands.set(command.data.name, command);
}

// Set up event listeners
const eventsPath = path.join(__dirname, 'events');
const eventsFiles = await getFiles(eventsPath) as Event[];
for (const event of eventsFiles) {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// default promise rejection handling
process.on('unhandledRejection', (err: Error) => logError(client, err));

// last ditch error handling
process.on('uncaughtException', (err: Error) => logError(client, err));

client.login(auth.token);