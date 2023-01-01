const { Events } = require('discord.js');
const { startDatabase } = require('../database/db');
const { logMessage } = require('../utils');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}. Awaiting database connection...`);
		startDatabase('./database/db.json').then(db => {
			client.db = db;
			console.log('All systems go.');
			logMessage(client, 'Praetor is online.');
		});
	}
};