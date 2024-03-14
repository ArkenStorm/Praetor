const { Events } = require('discord.js');
const { logError } = require('../utils');
const { showTag } = require('../commands/fun/tag');

const handleError = async (interaction, error, message = 'There was an error executing this command') => {
	logError(interaction.client, error, interaction);
	console.error(error);
	if (interaction.isRepliable()) {
		await interaction.reply({ content: message, ephemeral: true });
	}
};

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (!message.content.startsWith('!')) { return; }
		if (message.inGuild()) {
			// get guild config, check if tags (and any other future necessary ones) are enabled, otherwise just return
			showTag(message);
		}
	}
};