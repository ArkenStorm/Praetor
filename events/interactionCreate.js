const { Events } = require('discord.js');
const { logError } = require('../utils');

const handleError = async (interaction, error, message = 'There was an error executing this command') => {
	logError(interaction.client, error, interaction);
	console.error(error);

	if (interaction.deferred) {
		await interaction.editReply(message);
	} else if (interaction.isRepliable()) {
		await interaction.reply({ content: message, ephemeral: true });
	}
};

const handleCommandInteraction = async interaction => {
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		logError(interaction.client, `No command matching ${interaction.commandName} was found.`, interaction);
	}

	if (interaction.isChatInputCommand()) {
		await command.execute(interaction);
	} else if (interaction.isAutocomplete()) {
		await command.autocomplete(interaction);
	}
};

const handleComponentInteraction = async interaction => {
	if (interaction.isStringSelectMenu()) {
		await interaction.update(`Selected values: ${interaction.values.join(', ')}`);
	}
}

const customIdCommands = {
	'storyModal': 'story'
}

const handleModalSubmitInteraction = async interaction => {
	const command = interaction.client.commands.get(customIdCommands[interaction.customId]);
	await command.onSubmit(interaction);
}

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		try {
			if (interaction.isCommand()) {
				handleCommandInteraction(interaction);
			} else if (interaction.isMessageComponent()) {
				handleComponentInteraction(interaction);
			} else if (interaction.isModalSubmit()) {
				handleModalSubmitInteraction(interaction);
			} else {
				logError(interaction, `No handler for ${interaction.type} interactions.`);
			}
		} catch (error) {
			handleError(interaction, error);
		}
	}
};