const fs = require('node:fs');
const path = require('node:path');
const { EmbedBuilder, PermissionsBitField  } = require('discord.js');


const getFiles = dir => getFilepaths(dir).map(p => require(p));

const getFilepaths = dir => {
	const files = fs.readdirSync(dir, { withFileTypes: true });
	const paths = files.map(file => {
		const filepath = path.join(dir, file.name);
		if (file.isDirectory()) {
			return getFilepaths(filepath);
		}
		// Shouldn't need to worry about any non-js files here
		return filepath;
	});

	return paths.flat(Infinity);
};

const getFunctionalities = functionality => getFiles(path.join(__dirname, functionality));

// general permission checking function; use permission bitfield?
const checkPermission = (interaction, permission) => {
	if (!interaction.member) {
		return false; // not in a guild, not allowed
	}
	if (!PermissionsBitField.Flags.hasOwnProperty(permission)) {
		console.error(`${permission} is not a valid DiscordJS permission.`);
		return false;
	}
	if (interaction.member.permissionsIn(interaction.channel).has(permission)) {
		console.log('idk yet')
	}
}

// always allow my user id
// fp.split('/').at(-1).slice(0, -3); // for file names

const logError = (client, err, interaction) => {
	console.error(err);
	const fields = [];

	if (interaction) {
		if (interaction.isCommand()) {
			fields.push({ name: 'Command:', value: interaction.commandName });
		}
		fields.push(
			{ name: 'Guilty User:', value: interaction.member?.displayName || interaction.user.username },
			{ name: 'Channel:', value: interaction.channel.name },
			{ name: 'Guild:', value: interaction.guild.name || 'DM' },
			{ name: 'Created At:', value: createTimecode(interaction.createdTimestamp, 'datetime') }
		);
	}
	fields.push({ name: 'Error:', value: err.stack || err });

	const errorEmbed = new EmbedBuilder()
		.setColor('#bf260b')
		.setTitle('Glitch in the Matrix')
		.addFields(fields);

	// create abstracted function for getting channels (and other things), including error handling with partials and fetching and stuff?
	const errorChannel = client.guilds.cache.get('383889230704803851').channels.cache.get('1058289461357727785');
	errorChannel.send({ embeds: [errorEmbed] });
};

const logMessage = async (client, message) => {
	const messageEmbed = new EmbedBuilder()
		.setColor('#19a83f')
		.setTitle('System Notification')
		.addFields({ name: 'Info:', value: message });

	// create abstracted function for getting channels (and other things), including error handling with partials and fetching and stuff?
	const errorChannel = client.guilds.cache.get('383889230704803851').channels.cache.get('1058289461357727785');
	errorChannel.send({ embeds: [messageEmbed] });
};

// function to create a timecode
const timecodeFormats = {
	'date': 'd',
	'longdate': 'D',
	'time': 't',
	'longtime': 'T', // with seconds
	'datetime': 'f',
	'longdatetime': 'F',
	'dynamic': 'R'
};

const createTimecode = (timestamp, format) => `<t:${Math.floor(timestamp / 1000)}:${timecodeFormats[format]}>`;
const isValidHexCode = str => /^#[0-9A-F]{6}$/i.test(str);

// instead of interaction, destructure the client from a generic object? It would only work with things that have a client property, but that's fine
const getGuild = async interaction => await interaction.client.db.get(`guilds[${interaction.guildId}]`);

module.exports = {
	getFiles,
	getFilepaths,
	getFunctionalities,
	logError,
	logMessage,
	createTimecode,
	isValidHexCode,
	getGuild
};