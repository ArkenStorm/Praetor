const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const command = interaction.client.commands.get(interaction.commandName);
		if (!command) {
			// send to bot error channel
			console.error(`No command matching ${interaction.commandName} was found.`);
		}
		if (interaction.isChatInputCommand()) {
			try {
				await command.execute(interaction);
			} catch (error) {
				// send to bot error channel
				console.error(error);
				await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
			}
		} else if (interaction.isAutocomplete()) {
			// nothing yet
		}
	},
};