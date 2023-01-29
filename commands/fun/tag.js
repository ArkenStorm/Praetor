const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('tag')
	.setDescription('Custom commands for your server!')
	.setDMPermission(false)
	.addSubcommand(subcommand =>
		subcommand.setName('add')
			.setDescription('Add a tag')
			.addStringOption(option =>
				option.setName('name')
					.setDescription('The name of the tag')
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('remove')
			.setDescription('Remove a tag')
			.addStringOption(option =>
				option.setName('name')
					.setDescription('The tag you want to remove')
					.setAutocomplete(true)
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('list')
			.setDescription('View all the tags for this server')
	);

const subcommandFunctions = {

};

const execute = async interaction => {
	await interaction.deferReply({ ephemeral: true });
	subcommandFunctions[interaction.options.getSubcommand()](interaction);
};

const autocomplete = async interaction => {
	await interaction.respond(['You believe in the illusion of choice?']);
};

module.exports = {
	data,
	execute,
	autocomplete,
	name: 'tag'
};