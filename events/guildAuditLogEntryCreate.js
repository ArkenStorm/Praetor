const { AuditLogEvent, Events } = require('discord.js');
const { logError } = require('../utils');

const handleError = async (interaction, error, message = 'There was an error executing this command') => {
	logError(interaction.client, error, interaction);
	console.error(error);
};

module.exports = {
	name: Events.GuildAuditLogEntryCreate,
	async execute(auditLog) {
		try {
			const { action, executorId, targetId } = auditLog;

            if (action === AuditLogEvent.MessageDelete) {
                // do the stuff
            }
		} catch (error) {
			handleError(interaction, error);
		}
	}
};