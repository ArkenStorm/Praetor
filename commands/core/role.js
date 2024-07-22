// const { SlashCommandBuilder } = require('discord.js');
import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('role')
	.setDescription('Manage your roles')
	.addSubcommand(subcommand =>
		subcommand.setName('add')
			.setDescription('Add a role')
			.addRoleOption(option =>
				option.setName('role')
					.setDescription('The role you want to add')
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('remove')
			.setDescription('Remove a role')
			.addRoleOption(option =>
				option.setName('role')
					.setDescription('The role you want to remove')
					.setRequired(true)
			)
	);

const execute = async interaction => {
	await interaction.reply({ content: 'Hello', ephemeral: true });
};

const configOptions = {
	// <option i.e. 'embedColor'> -> { type: <Type i.e. String, Boolean, Color, etc.>, validation: <func> }
};

module.exports = {
	data,
	execute,
	configOptions,
	global: false,
	name: 'role'
};