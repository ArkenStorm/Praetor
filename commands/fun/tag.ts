import {
	type AutocompleteInteraction,
	ChatInputCommandInteraction,
	InteractionContextType,
	type Message,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import type { PraetorClient } from '../../praetorClient.ts';
import type { PraetorInteraction } from '../../types/command.type.ts';
import { getGuild } from '../../utils.ts';

type TagInteraction = ChatInputCommandInteraction & { client: PraetorClient };

const data = new SlashCommandBuilder()
	.setName('tag')
	.setDescription('Custom commands for your server!')
	.setContexts(InteractionContextType.Guild)
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
					.setRequired(false)
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

const add = async (interaction: TagInteraction) => {
	const guild = await getGuild(interaction as unknown as PraetorInteraction);
	if (!guild?.commands?.tag?.enabled) return;

	const addedTags = (guild.commands.tag as any).tags;
	const tags = addedTags || {};

	const tagName = interaction.options.getString('name', true);
	if (tagName in tags) {
		await interaction.editReply({
			content:
				'That tag already exists; if you would like to replace it, first remove it and then try adding again.',
		});
		return;
	} else {
		// add tag to db
		// should be { tagName: 'something' } but idk what that something should be yet
		// also make sure to take the file and write it to storage
	}
};

const remove = async (interaction: TagInteraction) => {
	// make sure to remove the file from storage
};

const list = async (interaction: TagInteraction) => {
	// just iterate over the keys of the guild's tags and display them in a pretty embed
};

export const showTag = async (message: Message & { client: PraetorClient }) => {
	if (message.content.length < 2) return;
	const guild = message.client.db.data.guilds[message.guildId!];
	if (!guild?.commands?.tag?.enabled) return;
};

const subcommandFunctions = {
	add,
	remove,
	list,
};

const execute = async (interaction: TagInteraction) => {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });
	const subcommand = interaction.options.getSubcommand() as keyof typeof subcommandFunctions;
	subcommandFunctions[subcommand](interaction);
};

const autocomplete = async (interaction: AutocompleteInteraction) => {
	// similar logic to getting the list of tags
	await interaction.respond([{ name: 'You believe in the illusion of choice?', value: 'illusion' }]);
};

const global = false;
const name = 'tag';

export { autocomplete, data, execute, global, name };
