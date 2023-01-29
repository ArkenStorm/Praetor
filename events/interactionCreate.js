const { Events } = require('discord.js');
const { logError } = require('../utils');

const handleError = async (interaction, error, message = 'There was an error executing this command') => {
	logError(interaction.client, error, interaction);
	console.error(error);
	if (interaction.isRepliable()) {
		await interaction.reply({ content: message, ephemeral: true });
	}
};

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			logError(interaction.client, `No command matching ${interaction.commandName} was found.`, interaction);
		}
		try {
			if (interaction.isChatInputCommand()) {
				await command.execute(interaction);
			} else if (interaction.isAutocomplete()) {
				await command.autocomplete(interaction);
			} else if (interaction.isStringSelectMenu()) {
				await interaction.update(`selected values: ${interaction.values.join(', ')}`);
			} else if (interaction.isModalSubmit()) {
				await command.onSubmit(interaction);
			}
		} catch (error) {
			handleError(interaction, error);
		}
	}
};