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
		if (interaction.isChatInputCommand()) {
			try {
				await command.execute(interaction);
			} catch (error) {
				handleError(interaction, error);
			}
		} else if (interaction.isAutocomplete()) {
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				handleError(interaction, error);
			}
		}
	}
};