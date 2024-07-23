import { SlashCommandBuilder } from 'discord.js';

const data = new SlashCommandBuilder()
	.setName('gift')
	.setDescription('Manage gifts and gift lists')
	.addSubcommand(subcommand =>
		subcommand.setName('add')
			.setDescription('Adds an item to your gift list')
			.addStringOption(option =>
				option.setName('name')
					.setDescription('The item you want to add')
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('remove')
			.setDescription('Removes an item from your gift list')
			.addStringOption(option =>
				option.setName('name')
					.setDescription('The item you want to remove')
					.setAutocomplete(true)
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('view')
			.setDescription('View all the items on a gift list; Will default to your own list if no user is provided. ')
			.addUserOption(option =>
				option.setName('user')
					.setDescription('The user whose gift list you want to view')
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('claim')
			.setDescription('Anonymously remove an item from another user\'s list, setting yourself as the gifter.')
			.addUserOption(option =>
				option.setName('user')
					.setDescription('The user whose gift list you want to claim from')
					.setRequired(true)
			)
			.addStringOption(option =>
				option.setName('item')
					.setDescription('The item you want to claim')
					.setAutocomplete(true)
					.setRequired(true)
			)
	);

const add = async interaction => {};
const remove = async interaction => {};
const view = async interaction => {};
const claim = async interaction => {};

const subcommandFunctions = {
	add,
	remove,
	view,
	claim
};

const execute = async interaction => {
	const subcommand = interaction.options.getSubcommand();
	subcommandFunctions[subcommand](interaction);
};

const autocomplete = async interaction => {};

const global = false;
const name = 'gift';

export {
	data,
	execute,
	autocomplete,
	global,
	name
};