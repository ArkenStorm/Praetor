import { JSONFilePreset } from 'lowdb/node';

export const startDatabase = async path => {
	const defaultData = {
		guilds: {},
		statistics: {}
	}
	const db = await JSONFilePreset(path, defaultData);
	console.log(`Connected successfully to db ${path}`);

	return db;
}