const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { exec } = require('child_process');
const { logError } = require('../../utils');

const data = new SlashCommandBuilder()
	.setName('git')
	.setDescription('Performs git interactions')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(subcommand =>
		subcommand.setName('pull')
			.setDescription('Updates the bot everywhere via the git repository')
	);

module.exports = {
	data,
	async execute(interaction) {
		if (interaction.user.id !== '358333674514677760') {
			await interaction.reply({ content: 'Sorry, this command is reserved for the bot owner only', ephemeral: true });
			return;
		}
		await interaction.reply({ content: 'Git process started; Praetor will be online again shortly.', ephemeral: true });
		exec('git pull && npm install && npm run restart',
			async error => {
				if (error) {
					logError(interaction.client, error, interaction);
				}
			});
	},
	global: false,
	name: 'git'
};