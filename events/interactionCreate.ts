import { Events, type Interaction } from 'discord.js';
import type { PraetorClient } from '../praetorClient.ts';
import { logError } from '../utils.ts';

type PraetorInteractionEvent = Interaction & { client: PraetorClient };

const handleError = async (
	interaction: PraetorInteractionEvent,
	error: Error,
	message = 'There was an error executing this command',
) => {
	logError(interaction.client, error, interaction);
	console.error(error);

	if ('deferred' in interaction && interaction.deferred) {
		await (interaction as any).editReply(message);
	} else if (interaction.isRepliable()) {
		await interaction.reply({ content: message, ephemeral: true });
	}
};

const customIdCommands: Record<string, string> = {
	storyModal: 'story',
};

const name = Events.InteractionCreate;
const execute = async (interaction: PraetorInteractionEvent) => {
	try {
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				logError(interaction.client, new Error(`Command ${interaction.commandName} not found.`), interaction);
				return;
			}
			await command.execute(interaction);
		} else if (interaction.isStringSelectMenu()) {
			await interaction.update(`Selected values: ${interaction.values.join(', ')}`);
		} else if (interaction.isMessageComponent()) {
			// TODO: handleComponentInteraction(interaction);
		} else if (interaction.isModalSubmit()) {
			const command = interaction.client.commands.get(customIdCommands[interaction.customId]);
			if (!command) {
				logError(
					interaction.client,
					new Error(`No command for modal customId: ${interaction.customId}`),
					interaction,
				);
				return;
			}
			await command.onSubmit?.(interaction);
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);
			if (!command) {
				logError(interaction.client, new Error(`Command ${interaction.commandName} not found.`), interaction);
				return;
			}
			await command.autocomplete?.(interaction);
		}
		// All interaction handler types are currently handled.
		// else { logError(interaction.client, new Error(`No handler for ${interaction.type} interactions.`), interaction); }
	} catch (error) {
		handleError(interaction, error as Error);
	}
};

export { execute, name };
