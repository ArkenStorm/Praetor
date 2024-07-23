// const { Events } = require('discord.js');
import { Events } from 'discord.js';
// const { startDatabase } = require('../database/db');
import { startDatabase } from '../database/db';
// const { logMessage } = require('../utils');
import { logMessage } from '../utils';

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