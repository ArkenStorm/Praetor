const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./auth.json');
const { getFilepaths } = require('./utils');
const path = require('node:path');
const guildId = '383889230704803851';
// does clientId need to be dynamic with sharding?

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = getFilepaths(commandsPath);
const commands = commandFiles.map(filepath => require(filepath).data.toJSON());

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const cliArgs = process.argv.slice(2);
		const route = (cliArgs.includes('-g') || cliArgs.includes('--global')) ?
			Routes.applicationCommands(clientId) :
			Routes.applicationGuildCommands(clientId, guildId);
		const data = await rest.put(
			route,
			{ body: commands }
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();