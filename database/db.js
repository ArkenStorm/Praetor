// const low = require('lowdb');
import { JSONFilePreset } from 'lowdb/node';
// const FileAsync = require('lowdb/adapters/FileAsync');

const startDatabase = async path => {
	// const adapter = new FileAsync(path);
	// const db = await low(adapter);
	const defaultData = {
		guilds: {},
		statistics: {}
	}
	const db = await JSONFilePreset(path, defaultData);
	console.log(`Connected successfully to db ${path}`);

	// db.defaults(
	// 	{
	// 		guilds: {},
	// 		statistics: {}
	// 	}
	// ).write();

	return db;
}

export {
	startDatabase
};