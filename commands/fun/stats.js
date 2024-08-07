import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';

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
					.setRequired(true)
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

// add /stats reset all:Boolean
const getUser = async interaction => interaction.client.db.data.statistics[interaction.user.id];

const track = async interaction => {
	const stat = interaction.options.getString('stat');
	const value = interaction.options.getNumber('value');

	const trackedUser = await getUser(interaction);
	if (!trackedUser) {
		await interaction.client.db.update( ({ statistics }) => statistics[interaction.user.id] = [] );
	}

	const user = await getUser(interaction);
	const statIsTracked = await user.find(s => s.stat.toLowerCase() === stat.toLowerCase());
	let message;

	if (statIsTracked) {
		message = 'I\'m already tracking that statistic for you.';
	} else {
		await interaction.client.db.update( ({ statistics }) => statistics[interaction.user.id].push({ stat, value: value || 0 }) );
		message = `Now tracking \`${stat}\` for you.`;
	}

	await interaction.editReply({ content: message });
};

const zeroTrackingMessage = 'I\'m not currently tracking anything for you. If you\'d like to change that, try `/stats track`.';

// Executes a predetermined function if the given stat exists in the DB
const executeIfStatExists = async interaction => {
	const stat = interaction.options.getString('stat');
	const user = await getUser(interaction);
	const subcommand = interaction.options.getSubcommand();

	if (user) {
		let message;
		const trackedStat = await user.find(s => s.stat === stat);

		if (trackedStat) {
			message = subcommand === 'untrack' ?
				await untrack(interaction, user, stat) :
				await update(interaction, user, stat, interaction.options.getNumber('value'));
		} else {
			message = `I'm not currently tracking \`${stat}\` for you.`;
		}

		await interaction.editReply({ content: message });
	} else {
		await interaction.editReply({ content: zeroTrackingMessage });
	}
};

const untrack = async (interaction, user, stat) => {
	await interaction.client.db.update( ({ statistics }) => statistics[interaction.user.id] = user.filter(s => s.stat !== stat) );
	return `No longer tracking \`${stat}\` for you.`;
};

const update = async (interaction, user, stat, updateVal) => {
	if (updateVal === 0) {
		return 'You need to provide a value other than zero.';
	}

	await interaction.client.db.update( ({ statistics }) => {
		const userStats = statistics[interaction.user.id];
		const statIndex = userStats.findIndex(s => s.stat === stat);
		userStats[statIndex].value += updateVal;
	});
	return `\`${stat}\` has been updated.`;
};

const view = async interaction => {
	const user = await getUser(interaction);

	if (user?.length) {
		const title = interaction.channel.isDMBased() ? 'Your statistics' : `${interaction?.member.displayName}'s statistics`;
		const fields = user.map(entry => ({ name: entry.stat, value: entry.value.toString() }));
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

const leaderboard = async interaction => {
	if (!interaction.guild) {
		await interaction.editReply('A leaderboard doesn\'t really make sense here...');
		return;
	}
	await interaction.editReply('Determining Leaderboard...');
	const stat = interaction.options.getString('stat').toLowerCase();

	const trackedUserIdsObj = await interaction.client.db.data.statistics;
	const allTrackedUserIds = Object.keys(trackedUserIdsObj).map(key => ({ id: key, stats: trackedUserIdsObj[key] }));
	const guildTrackedUserIds = allTrackedUserIds.filter(u => interaction.guild.members.cache.has(u.id));
	const competingUsers = await guildTrackedUserIds.reduce(async (acc, u) => {
		const userStat = u.stats.find(entry => entry.stat.toLowerCase() === stat);
		if (userStat) {
			const displayName = (await interaction.guild.members.cache.get(u.id))?.displayName;
			(await acc).push({
				name: displayName,
				value: userStat.value.toString()
			});
		}
		return acc;
	}, []);

	competingUsers.sort((a, b) => b.value - a.value);
	const fields = competingUsers.length ? competingUsers : [{ name: `Nobody is tracking \`${stat}\` yet!`, value: 'Maybe you can be the first...' }];

	const leaderboardEmbed = new EmbedBuilder()
		.setColor('#2295d4')
		.setTitle(`Leaderboard for ${stat}`)
		.addFields(fields)
		.setFooter({ text: `Requested by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() });

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
	const focusedValue = interaction.options.getFocused().toLowerCase();
	const user = await getUser(interaction);
	let choices = [];
	if (user) {
		choices = user.map(entry => ({ name: entry.stat, value: entry.stat }));
	}
	const filtered = choices.filter(c => c.name.toLowerCase().startsWith(focusedValue));
	await interaction.respond(filtered);
};

const global = true;
const name = 'stats';

export {
	data,
	execute,
	autocomplete,
	global,
	name
};