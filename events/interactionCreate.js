import { Events } from 'discord.js';
import { logError } from '../utils.js';

const handleError = async (interaction, error, message = 'There was an error executing this command') => {
	logError(interaction.client, error, interaction);
	console.error(error);

	if (interaction.deferred) {
		await interaction.editReply(message);
	} else if (interaction.isRepliable()) {
		await interaction.reply({ content: message, ephemeral: true });
	}
};

const customIdCommands = {
	'storyModal': 'story'
}

const name = Events.InteractionCreate;
const execute = async (interaction) => {
	try {
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			await command.execute(interaction);
		} else if (interaction.isMessageComponent()) {
			handleComponentInteraction(interaction);
		} else if (interaction.isModalSubmit()) {
			const command = interaction.client.commands.get(customIdCommands[interaction.customId]);
			await command.onSubmit(interaction);
		} else if (interaction.isStringSelectMenu()) {
			await interaction.update(`Selected values: ${interaction.values.join(', ')}`);
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			await command.autocomplete(interaction);
		} else {
			logError(interaction, `No handler for ${interaction.type} interactions.`);
		}
	} catch (error) {
		handleError(interaction, error);
	}
}

export {
	name,
	execute
};