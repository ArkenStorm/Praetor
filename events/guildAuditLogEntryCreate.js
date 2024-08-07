import { AuditLogEvent, Events } from 'discord.js';
import { logError } from '../utils.js';

const handleError = async (interaction, error, message = 'There was an error executing this command') => {
	logError(interaction.client, error, interaction);
	console.error(error);
};

const name = Events.GuildAuditLogEntryCreate;
const execute = async (auditLog) => {
	try {
		const { action, executorId, targetId } = auditLog;

		if (action === AuditLogEvent.MessageDelete) {
			// do the stuff
		}
	} catch (error) {
		handleError(interaction, error);
	}
}

export {
	name,
	execute
};