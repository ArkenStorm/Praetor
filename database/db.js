const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const startDatabase = async path => {
	const adapter = new FileAsync(path);
	const db = await low(adapter);
	console.log(`Connected successfully to db ${path}`);

	db.defaults(
		{
			guilds: {},
			statistics: {}
		}
	).write();

	return db;
};

module.exports = {
	startDatabase
};