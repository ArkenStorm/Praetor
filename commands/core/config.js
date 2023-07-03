const { SlashCommandBuilder } = require('discord.js');
const { getFunctionalities } = require('../../utils');

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

const defaultOptions = {
	embedColor: '#2295d4',
	channelId: null,
	percentChance: 10,
	minCount: 5,
	overrides: {},
	onlyUseOverrides: true
};

// Requires every command/behavior to have a name
const applyFunctionalityOptions = (functionalities, config) => {
	functionalities.forEach(f => {
		const options = f.configOptions ? 
			Object.keys(f.configOptions).reduce((acc, key) => acc[key] = defaultOptions[key], {}) :
			{};
		config[f.name] = Object.assign({ enabled: false }, options);
	});
};

const init = async interaction => {
	if (!interaction.inGuild()) {
		await interaction.editReply('Configs cannot exist in DMs.');
	}
	const hasConfig = await interaction.client.db.get(`guilds[${interaction.guild.id}]`).value();
	if (hasConfig) {
		await interaction.editReply('This server already has a config initialized!');
		return;
	}

	// TODO: CHECK PERMISSIONS!!!
	const guildConfig = {
		defaults: { embedColor: '#2295d4' }
	};

	// only deal with non-global commands
	const commands = getFunctionalities('commands').filter(c => !c.global);
	// const behaviors = getFunctionalities('behaviors');

	applyFunctionalityOptions(commands, guildConfig);
	// TODO: implement behaviors
	// applyFunctionalityOptions(behaviors, guildConfig);
	await interaction.client.db.set(`guilds[${interaction.guild.id}]`, guildConfig).write();

	await interaction.editReply('Config for this server has been initialized!');
};

const edit = async interaction => {
	// use validators from configOptions here
	await interaction.editReply('Functionality not implemented yet');
};

const view = async interaction => {
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