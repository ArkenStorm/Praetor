const { SlashCommandBuilder } = require('discord.js');
const { getFiles } = require('../../utils');
const path = require('node:path');

const data = new SlashCommandBuilder()
	.setName('config')
	.setDescription('Manage your server\'s config')
	.addSubcommand(subcommand =>
		subcommand.setName('init')
			.setDescription('Initialize your server\'s config') // will start a lengthy process
	)
	.addSubcommand(subcommand =>
		subcommand.setName('edit')
			.setDescription('Edit your server\'s config') // have a list of all command names
	)
	.addSubcommand(subcommand =>
		subcommand.setName('view')
			.setDescription('View your server\'s config')
	);

const getFunctionalities = functionality => getFiles(path.join(__dirname, functionality));

const defaultOptions = {
	embedColor: '#2295d4',
	channelId: null,
	percentChance: 10,
	minCount: 5,
	overrides: {},
	onlyUseOverrides: true
};

// Requires every command/behavior to have a name
const applyFunctionalityOptions = (functionalities, config) => {
	functionalities.forEach(f => {
		const options = Object.keys(f.configOptions).reduce((acc, key) => acc[key] = defaultOptions[key], {});
		config[f.name] = Object.assign({ enabled: false }, options);
	});
};

const init = async interaction => {
	if (!interaction.inGuild()) {
		await interaction.reply('Configs cannot exist in DMs.');
	}
	// TODO: CHECK PERMISSIONS!!!
	await interaction.deferReply({ ephemeral: true });
	const guildConfig = {
		defaults: { embedColor: '#2295d4' }
	};

	// only deal with non-global commands
	const commands = getFunctionalities('commands').filter(c => !Object.hasOwn(c, 'global'));
	const behaviors = getFunctionalities('behaviors');

	applyFunctionalityOptions(commands, guildConfig);
	applyFunctionalityOptions(behaviors, guildConfig);
	// write to database here
	await interaction.editReply('Config for this server has been initialized!');
};

const edit = async interaction => {
	// use validators from configOptions here
	console.log(interaction);
};

const subcommandFunctions = {
	init,
	edit
};

const execute = async interaction => {
	await interaction.deferReply({ ephemeral: true });
	subcommandFunctions[interaction.options.getSubcommand()](interaction);
};
/**
 * 	config = {
 * 		defaults: {
 * 			embedColor: #ffffff
 * 		},
 * 		<Functionality (command/behavior/etc.)>: {
 * 			enabled: true,
 * 			embedColor: #123456, // if applicable
 * 			channelId: "8345702836578", // if applicable
 * 		}
 * 	}
 */

module.exports = {
	data,
	execute,
	global: true,
	name: 'config'
};