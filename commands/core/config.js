const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('config')
	.setDescription('Manage your server\'s config')
	.addSubcommand(subcommand =>
		subcommand.setName('init')
			.setDescription('Initialize your server\'s config') // will start a lengthy process
	)
	.addSubcommand(subcommand =>
		subcommand.setName('edit')
			.setDescription('Edit your server\'s config')
	);

const init = async (interaction) => {
	const guildConfig = {
		defaults: {}
	}
	// create config options per command, with "enabled" always present
	// "color" option is just a string option with color validation, i.e. const isValidHexCode = (str) => /^#[0-9A-F]{6}$/i.test(str)
	// command select menus need to be paginated in 5s
};

const subcommandFunctions = {
	init
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
	global: true
};