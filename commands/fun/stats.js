const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('stats')
	.setDescription('Manage your statistics')
	.addSubcommand(subcommand =>
		subcommand.setName('track')
			.setDescription('Start tracking a statistic')
			.addStringOption(option =>
				option.setName('stat')
					.setDescription('The statistic you want to start tracking')
					.setRequired(true)
			)
			.addNumberOption(option =>
				option.setName('value')
					.setDescription('An initial value for this statistic')
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('untrack')
			.setDescription('Stop tracking a statistic')
			.addStringOption(option =>
				option.setName('stat')
					.setDescription('The statistic you want to stop tracking')
					.setAutocomplete(true)
					.setRequired(true)
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('update')
			.setDescription('Update one of your tracked statistics')
			.addStringOption(option =>
				option.setName('stat')
					.setDescription('Which statistic you want to update')
					.setAutocomplete(true)
					.setRequired(true)
			)
			.addNumberOption(option =>
				option.setName('value')
					.setDescription('Alter the statistic value by this number')
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('view')
			.setDescription('View all your tracked statistics')
			.addBooleanOption(option =>
				option.setName('private')
					.setDescription('If you want your stats to be private or not')
			)
	)
	.addSubcommand(subcommand =>
		subcommand.setName('leaderboard')
			.setDescription('Check how you compare against others in your server!')
			.addStringOption(option =>
				option.setName('stat')
					.setDescription('Which statistic you want to view the leaderboard for')
					.setRequired(true)
			)
	);

const track = async (interaction) => {
	const stat = interaction.options.getString('stat');
	const value = interaction.options.getNumber('value');

	const trackedUser = await getUser(interaction);
	if (!trackedUser.value()) {
		await interaction.client.db.set(`statistics[${interaction.user.id}]`, []).write();
	}

	const user = await getUser(interaction);
	const statIsTracked = await user.find({ stat }).value();
	let message;

	if (statIsTracked) {
		message = 'I\'m already tracking that statistic for you.';
	} else {
		await user.push({ stat, value: value || 0 }).write();
		message = `Now tracking \`${stat}\` for you.`;
	}

	await interaction.editReply({ content: message });
};

const getUser = async (interaction) => await interaction.client.db.get(`statistics[${interaction.user.id}]`);
const zeroTrackingMessage = 'I\'m not currently tracking anything for you. If you\'d like to change that, try `/stats track`.';

// Executes a predetermined function if the given stat exists in the DB
const executeIfStatExists = async (interaction) => {
	const stat = interaction.options.getString('stat');
	const user = await getUser(interaction);
	const subcommand = interaction.options.getSubcommand();

	if (user) {
		let message;
		const trackedStat = await user.find({ stat });

		if (trackedStat.value()) {
			message = subcommand === 'untrack' ?
				await untrack(user, stat) :
				await update(user, stat, interaction.getNumber('value'));
		} else {
			message = `I'm not currently tracking \`${stat}\` for you.`;
		}

		await interaction.editReply({ content: message });
	} else {
		await interaction.editReply({ content: zeroTrackingMessage });
	}
};

const untrack = async (user, stat) => {
	await user.remove({ stat }).write();
	return `No longer tracking \`${stat}\` for you.`;
};

const update = async (user, statString, updateVal) => {
	const statObj = await user.find({ statString });
	await statObj.assign({ 'value': statObj.value().value + updateVal }).write();
	return `\`${statString}\` has been updated.`;
};

const view = async (interaction) => {
	const user = await getUser(interaction);

	if (user?.value()?.length) {
		const title = interaction.channel.isDMBased() ? 'Your statistics' : `${interaction?.member.displayName}'s statistics`;
		const fields = user.value().map(entry => ({ name: entry.stat, value: entry.value.toString() }));
		fields.sort((a, b) => a.name.localeCompare(b.name));

		const statsEmbed = new EmbedBuilder()
			.setColor('#2295d4')
			.setTitle(title)
			.addFields(fields);

		if (interaction.options.getBoolean('private')) {
			await interaction.editReply({ embeds: [statsEmbed] });
		} else {
			await interaction.editReply('Stats sending...');
			await interaction.channel.send({ embeds: [statsEmbed] });
			await interaction.editReply('Stats sent!');
		}
	} else {
		await interaction.editReply({ content: zeroTrackingMessage });
	}
};

const leaderboard = async (interaction) => {
	if (!interaction.guild) {
		await interaction.editReply('A leaderboard doesn\'t really make sense here...');
		return;
	}
	await interaction.editReply('Determining Leaderboard...');
	const stat = interaction.options.getString('stat');

	const trackedUserIdsObj = await interaction.client.db.get('statistics').value();
	const allTrackedUserIds = Object.keys(trackedUserIdsObj).map(key => ({ id: key, stats: trackedUserIdsObj[key] }));
	const guildTrackedUserIds = allTrackedUserIds.filter(u => interaction.guild.members.cache.has(u.id));
	const competingUsers = guildTrackedUserIds.reduce((acc, u) => {
		const userStat = u.stats.find(entry => entry.stat === stat);
		if (userStat) {
			acc.push({
				name: interaction.guild.members.cache.get(u.id).displayName,
				value: userStat.value
			});
		}
	}, []);

	competingUsers.sort((a, b) => a.value - b.value);
	const fields = competingUsers.length ? competingUsers : [{ name: `Nobody is tracking \`${stat}\` yet!`, value: 'Maybe you can be the first...' }];

	const leaderboardEmbed = new EmbedBuilder()
		.setColor('#2295d4')
		.setTitle(`Leaderboard for ${stat}`)
		.addFields(fields)
		.setFooter(`Requested by ${interaction.member.displayName}`);

	await interaction.channel.send({ embeds: [leaderboardEmbed] });
	await interaction.editReply('Leaderboard posted!');
};

const subcommandFunctions = {
	track,
	'untrack': executeIfStatExists,
	'update': executeIfStatExists,
	view,
	leaderboard
};

const execute = async interaction => {
	await interaction.deferReply({ ephemeral: true });
	subcommandFunctions[interaction.options.getSubcommand()](interaction);
};

const autocomplete = async interaction => {
	// Only the "stat" option is autocomplete-enabled for the stats commands
	const focusedValue = interaction.options.getFocused();
	const user = await getUser(interaction);
	let choices = [];
	if (user) {
		choices = user.value().map(entry => ({ name: entry.stat, value: entry.stat }));
	}
	const filtered = choices.filter(c => c.name.startsWith(focusedValue));
	await interaction.respond(filtered);
};

module.exports = {
	data,
	execute,
	autocomplete
};