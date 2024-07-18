// const { Events } = require('discord.js');
import { Events } from 'discord.js';
// const { getGuild, logError } = require('../utils');
import { getGuild, logError } from '../utils';

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
		// get guild config, check if tags (and any other future necessary ones) are enabled, otherwise just return
		// console.log(message);
	}
};