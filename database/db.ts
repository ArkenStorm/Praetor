import type { PathLike } from 'fs';
import { JSONFilePreset } from 'lowdb/node';

export const startDatabase = async (path: PathLike) => {
	const defaultData = {
		guilds: {},
		statistics: {}
	}
	const db = await JSONFilePreset(path, defaultData);
	console.log(`Connected successfully to db ${path}`);

	return db;
}