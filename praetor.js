const path = require('node:path');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { token } = require('./auth.json');
const { getFilepaths, logError } = require('./utils');

const clientOptions = {
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
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
const eventsFiles = getFilepaths(eventsPath);
for (const filepath of eventsFiles) {
	const event = require(filepath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// default promise rejection handling
process.on('unhandledRejection', (err, promise) => logError(client, err, promise));

client.login(token);