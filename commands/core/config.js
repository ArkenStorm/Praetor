const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('config')
	.setDescription('Manage your server\'s config')
	.addSubcommand(subcommand =>
		subcommand.setName('init')
			.setDescription('Initialize your server\'s config') // add options
			.addStringOption(option =>
				option.setName('stat')
					.setDescription('The statistic you want to start tracking')
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('edit')
			.setDescription('Edit your server\'s config')
	);

const init = async () => {
	// stuff
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
 * 		channels: {
 * 			quoteChannelId
 * 			starChannelId
 * 		},
 * 		embedColors: {
 * 			default
 * 			star
 * 		},
 * 		commands: []
 * 		functionality: [starboard, autoreaction]
 * 		starEmoji
 * 	}
 */

module.exports = {
	data,
	execute
};