import { exec } from 'child_process';
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { ARKEN_ID } from '../../constants/arken.ts';
import { logError } from '../../utils.ts';

const data = new SlashCommandBuilder()
	.setName('git')
	.setDescription('Performs git interactions')
	.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
	.addSubcommand(subcommand =>
		subcommand.setName('pull')
			.setDescription('Updates the bot everywhere via the git repository')
	);

const execute = async (interaction) => {
	if (interaction.user.id !== ARKEN_ID) {
		await interaction.reply({
			content: 'Sorry, this command is reserved for the bot owner only',
			flags: MessageFlags.Ephemeral,
		});
		return;
	}
	await interaction.reply({
		content: 'Git process started; Praetor will be online again shortly.',
		flags: MessageFlags.Ephemeral,
	});
	exec('git pull && npm install && npm run restart', async error => {
		if (error) {
			logError(interaction.client, error, interaction);
		}
	});
};

const global = false;
const name = 'git';

export { data, execute, global, name };
