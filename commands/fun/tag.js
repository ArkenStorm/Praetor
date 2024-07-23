import { SlashCommandBuilder } from 'discord.js';
import { getGuild } from '../../utils.js';

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
			.addAttachmentOption(option =>
				option.setName('file')
					.setDescription('An optional image to display when the tag is invoked')
					.setRequired(true)
			)
			.addStringOption(option =>
				option.setName('caption')
					.setDescription('A caption to display with the tag')
					.setRequired(false)
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

const add = async interaction => {
	const guild = await getGuild(interaction);
	if (!guild?.config?.tag?.enabled) { return; }
	
	const addedTags = guild.config.tag.tags;
	const tags = addedTags || {};

	const tagName = interaction.options.getString('name');
	if (tagName in tags) {
		await interaction.editReply({ content: 'That tag already exists; if you would like to replace it, first remove it and then try adding again.' });
		return;
	} else {
		// add tag to db
		// should be { tagName: 'something' } but idk what that something should be yet
		// also make sure to take the file and write it to storage
	}
}

const remove = async (interaction) => {
	// make sure to remove the file from storage
}

const list = async (interaction) => {
	// just iterate over the keys of the guild's tags and display them in a pretty embed
}

const showTag = async message => {
	if (message.length < 2) { return; }
	const guild = await message.client.db.data.guilds[message.guildId];
	if (!guild?.config?.tag?.enabled) { return; }
}

const subcommandFunctions = {
	add,
	remove,
	list
};

const execute = async interaction => {
	await interaction.deferReply({ ephemeral: true });
	subcommandFunctions[interaction.options.getSubcommand()](interaction);
};

const autocomplete = async (interaction) => {
	// similar logic to getting the list of tags
	await interaction.respond(['You believe in the illusion of choice?']);
};

const global = false;
const name = 'tag';

export {
	data,
	execute,
	autocomplete,
	global,
	name,
	showTag
};