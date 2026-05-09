import { Events } from 'discord.js';
import { startDatabase } from '../database/db.ts';
import { logMessage } from '../utils.ts';

const name = Events.ClientReady;
const once = true;
const execute = async (client: PraetorClient) => {
	console.log(`Ready! Logged in as ${client.user?.tag}. Awaiting database connection...`);
	const db = await startDatabase('./database/db.json');
	client.db = db;
	console.log('All systems go.');
	logMessage(client, 'Praetor is online.');
}

export {
	name,
	once,
	execute
};