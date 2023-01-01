const fs = require('node:fs');
const path = require('node:path');
const { EmbedBuilder } = require('discord.js');

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

// general permission checking function
// always allow my user id

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

const createTimecode = (timestamp, format) => `<t:${timestamp / 1000}:${timecodeFormats[format]}>`;

module.exports = {
	getFilepaths,
	logError,
	logMessage,
	createTimecode
};