import { Events } from 'discord.js';
import { startDatabase } from '../database/db.js';
import { logMessage } from '../utils.js';

const name = Events.ClientReady;
const once = true;
const execute = (client) => {
	console.log(`Ready! Logged in as ${client.user.tag}. Awaiting database connection...`);
	startDatabase('./database/db.json').then(db => {
		client.db = db;
		console.log('All systems go.');
		logMessage(client, 'Praetor is online.');
	});
}

export {
	name,
	once,
	execute
};