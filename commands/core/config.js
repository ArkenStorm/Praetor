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

const execute = async interaction => {
	await interaction.reply({ content: 'Hello', ephemeral: true });
};

module.exports = {
	data,
	execute
};