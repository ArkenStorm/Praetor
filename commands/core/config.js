// const { SlashCommandBuilder } = require('discord.js');
import { SlashCommandBuilder } from 'discord.js';
// const { getFunctionalities } = require('../../utils');
import { getFunctionalities } from '../../utils';

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

// the heck are overrides for?!
const defaultOptions = {
	embedColor: '#2295d4',
	channelId: '',
	percentChance: 10,
	minCount: 5,
	overrides: {},
	onlyUseOverrides: true,
	emojis: ['star']
};

// Requires every command/behavior to have a name
const applyFunctionalityOptions = (functionalities, config) => {
	functionalities.forEach(f => {
		const options = f.configOptions ?
			Object.keys(f.configOptions).reduce((acc, key) => acc[key] = defaultOptions[key], {}) :
			{};
		if (!config[f.name]) { // only initialize if it doesn't exist already
			config[f.name] = Object.assign({ enabled: false }, options);
		}
	});
};

const init = async interaction => {
	if (!interaction.inGuild()) {
		await interaction.editReply('Configs cannot exist in DMs.');
		return;
	}
	let guildConfig = await interaction.client.db.get(`guilds[${interaction.guild.id}]`).value();
	let botResponse = 'Config for this server has been initialized!';
	if (!guildConfig) {
		guildConfig = {
			defaults: { embedColor: '#2295d4' }
		}
	} else {
		botResponse = 'Config updated with new defaults!';
	}

	// TODO: CHECK PERMISSIONS!!!
	// only deal with non-global commands
	const commands = getFunctionalities('commands').filter(c => !c.global);
	const behaviors = getFunctionalities('behaviors').filter(b => !b.global);

	applyFunctionalityOptions(commands, guildConfig);
	applyFunctionalityOptions(behaviors, guildConfig);
	await interaction.client.db.update( ({ guilds }) => guilds[interaction.guild.id] = guildConfig );

	await interaction.editReply(botResponse);
};

const edit = async interaction => {
	// use validators from configOptions here

	// get the guild config
	// autocomplete the command/behavior names for the user
	// display an ephemeral card with the current config for the command/behavior
	// have buttons to edit the different options there (or maybe not buttons, idk yet)
	await interaction.editReply('Functionality not implemented yet');
};

const view = async interaction => {
	// add a button to provide the option to edit the config?
	await interaction.editReply('Functionality not implemented yet');
}

const subcommandFunctions = {
	init,
	edit,
	view
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