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

// error sending function
const logError = (client, err, promise) => {
	console.error(err);
	console.log(promise); // what details can I get here?
	// send the error
	const errorEmbed = new EmbedBuilder()
		.setColor('#bf260b')
		.setTitle('Glitch in the Matrix')
		.addFields(
			{ name: 'Message:', value: 'Not implemented yet' },
			{ name: 'Guilty User:', value: 'Not implemented yet' },
			{ name: 'Channel:', value: 'Not implemented yet' },
			{ name: 'Guild:', value: 'Not implemented yet' },
			{ name: 'Error:', value: err.stack || err }
		);

	const errorChannel = client.guilds.cache.get('383889230704803851');
	errorChannel.send(errorEmbed);
};

module.exports = {
	getFilepaths,
	logError
};