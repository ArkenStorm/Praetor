import { Events } from 'discord.js';
import { logError } from '../utils.js';
import { showTag } from '../commands/fun/tag.js';

const handleError = async (interaction, error, message = 'There was an error executing this command') => {
	logError(interaction.client, error, interaction);
	console.error(error);
	if (interaction.isRepliable()) {
		await interaction.reply({ content: message, ephemeral: true });
	}
};

const name = Events.MessageCreate;
const execute = async (message) => {
	if (!message.content.startsWith('!')) { return; }
	if (message.inGuild()) {
		// get guild config, check if tags (and any other future necessary ones) are enabled, otherwise just return
		showTag(message);
	}
}

export {
	name,
	execute
};