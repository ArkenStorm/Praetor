import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import type { PraetorClient } from '../../praetorClient.ts';
import type { CommandSetup } from '../../types/command.type.ts';
import type { GuildConfig } from '../../types/db.type.ts';
import { getFunctionalities } from '../../utils.ts';

type ConfigInteraction = ChatInputCommandInteraction & { client: PraetorClient };

const data = new SlashCommandBuilder()
	.setName('config')
	.setDescription("Manage your server's config")
	.addSubcommand(subcommand =>
		subcommand.setName('init')
			.setDescription("Initialize your server's config") // will start a lengthy process
	)
	.addSubcommand(subcommand =>
		subcommand.setName('edit')
			.setDescription("Edit your server's config") // have a list of all command names
	)
	.addSubcommand(subcommand =>
		subcommand.setName('view')
			.setDescription("View your server's config")
	);

// Requires every command/behavior to have a name
const applyFunctionalityOptions = (functionalities: CommandSetup[], commands: NonNullable<GuildConfig['commands']>) => {
	functionalities.forEach(f => {
		const key = f.name as keyof typeof commands;
		commands[key] ??= { enabled: false } as never;
	});
};

const init = async (interaction: ConfigInteraction) => {
	if (!interaction.inGuild() || !interaction.guild) {
		await interaction.editReply('Configs cannot exist in DMs.');
		return;
	}
	let guildConfig = interaction.client.db.data.guilds[interaction.guild.id];
	let botResponse = 'Config for this server has been initialized!';
	if (!guildConfig) {
		guildConfig = {
			defaults: { embedColor: '#2295d4' },
			commands: {},
		};
	} else {
		guildConfig.commands ??= {};
		botResponse = 'Config updated with new defaults!';
	}

	// TODO: CHECK PERMISSIONS!!!
	// only deal with non-global commands
	const commandsList = (await getFunctionalities('commands') as CommandSetup[]).filter(c => !c.global);
	const behaviors = (await getFunctionalities('behaviors') as CommandSetup[]).filter(b => !b.global);

	applyFunctionalityOptions(commandsList, guildConfig.commands!);
	applyFunctionalityOptions(behaviors, guildConfig.commands!);
	await interaction.client.db.update(({ guilds }) => guilds[interaction.guild!.id] = guildConfig);

	await interaction.editReply(botResponse);
};

const edit = async (interaction: ConfigInteraction) => {
	// use validators from configOptions here

	// get the guild config
	// autocomplete the command/behavior names for the user
	// display an ephemeral card with the current config for the command/behavior
	// have buttons to edit the different options there (or maybe not buttons, idk yet)
	await interaction.editReply('Functionality not implemented yet');
};

const view = async (interaction: ConfigInteraction) => {
	// add a button to provide the option to edit the config?
	await interaction.editReply('Functionality not implemented yet');
};

const subcommandFunctions = {
	init,
	edit,
	view,
};

const execute = async (interaction: ConfigInteraction) => {
	await interaction.deferReply({ ephemeral: true });
	const subcommand = interaction.options.getSubcommand() as keyof typeof subcommandFunctions;
	subcommandFunctions[subcommand](interaction);
};
/**
 * 	The config is the value of the object stored under the guildId key.
 *
 *  config = {
 * 		defaults: {
 * 			embedColor: #ffffff
 * 		},
 * 		commands: {
 * 			<Functionality (command/behavior/etc.)>: {
 * 				enabled: true,
 * 				embedColor: #123456, // if applicable
 * 				channelId: "8345702836578", // if applicable
 * 			}
 * 		}
 * 	}
 */

const global = true;
const name = 'config';

export { data, execute, global, name };
