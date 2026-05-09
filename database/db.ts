import type { PathLike } from 'fs';
import { JSONFilePreset } from 'lowdb/node';
import type { Database } from '../types/db.type.ts';

export const startDatabase = async (path: PathLike) => {
	const defaultData: Database = {
		guilds: {},
		statistics: {},
	};
	const db = await JSONFilePreset(path, defaultData);
	console.log(`Connected successfully to db ${path}`);

	return db;
};
