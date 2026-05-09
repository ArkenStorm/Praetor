import { type APIEmbedField, EmbedBuilder, GuildMember, PermissionsBitField } from 'discord.js';
import { type PathLike, readdirSync } from 'fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ARKEN_ASYLUM_ERROR_CHANNEL_ID, ARKEN_ASYLUM_GUILD_ID } from './constants/arken.ts';
import type { PraetorClient } from './praetorClient.ts';
import type { DataFile, PraetorInteraction } from './types.ts';

export const getFiles = async (dir: PathLike): Promise<DataFile[]> =>
	await Promise.all(
		getFilepaths(dir).map(async (p: PathLike) => await import(pathToFileURL(p.toString()).toString())),
	);

export const getFilepaths = (dir: PathLike): string[] => {
	const files = readdirSync(dir, { withFileTypes: true });
	const paths: (string | string[])[] = files.map(file => {
		const filepath = path.join(dir.toString(), file.name);
		if (file.isDirectory()) {
			return getFilepaths(filepath);
		}
		// Shouldn't need to worry about any non-ts files here
		return filepath;
	});

	return paths.flat(Infinity) as string[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const getFunctionalities = (functionality: string) => getFiles(path.join(__dirname, functionality));

// general permission checking function; use permission bitfield?
export const checkPermission = (
	interaction: PraetorInteraction,
	permission: keyof typeof PermissionsBitField.Flags,
) => {
	if (!interaction.member) {
		return false; // not in a guild, not allowed
	}
	if (!PermissionsBitField.Flags.hasOwnProperty(permission)) {
		console.error(`${permission} is not a valid DiscordJS permission.`);
		return false;
	}
	if (
		interaction.channel
		&& !interaction.channel.isDMBased()
		&& (interaction.member as GuildMember).permissionsIn(interaction.channel).has(permission)
	) {
		console.log('idk yet');
	}
};

// always allow my user id
// fp.split('/').at(-1).slice(0, -3); // for file names

export const logError = (client: PraetorClient, err: Error, interaction?: PraetorInteraction) => {
	console.error(err);
	const fields: APIEmbedField[] = [];

	if (interaction) {
		if (interaction.isCommand()) {
			fields.push({ name: 'Command:', value: interaction.commandName });
		}
		fields.push(
			{
				name: 'Guilty User:',
				value: interaction.member && 'displayName' in interaction.member
					? interaction.member.displayName
					: (interaction.member?.nick ?? interaction.user.username),
			},
			{
				name: 'Channel:',
				value: (interaction.channel && 'name' in interaction.channel ? interaction.channel.name : null) ?? 'DM',
			},
			{ name: 'Guild:', value: interaction.guild?.name || 'DM' },
			{ name: 'Created At:', value: createTimecode(interaction.createdTimestamp, 'datetime') },
		);
	}
	fields.push({ name: 'Error:', value: err.stack || err.message });

	const errorEmbed = new EmbedBuilder()
		.setColor('#bf260b')
		.setTitle('Glitch in the Matrix')
		.addFields(fields);

	// create abstracted function for getting channels (and other things), including error handling with partials and fetching and stuff?
	const errorChannel = client.guilds.cache
		.get(ARKEN_ASYLUM_GUILD_ID)?.channels.cache
		.get(ARKEN_ASYLUM_ERROR_CHANNEL_ID);
	if (errorChannel?.isTextBased()) {
		errorChannel.send({ embeds: [errorEmbed] });
	}
};

export const logMessage = async (client: PraetorClient, message: string) => {
	const messageEmbed = new EmbedBuilder()
		.setColor('#19a83f')
		.setTitle('System Notification')
		.addFields({ name: 'Info:', value: message });

	// create abstracted function for getting channels (and other things), including error handling with partials and fetching and stuff?
	const errorChannel = client.guilds.cache
		.get(ARKEN_ASYLUM_GUILD_ID)?.channels.cache
		.get(ARKEN_ASYLUM_ERROR_CHANNEL_ID);
	if (errorChannel?.isTextBased()) {
		errorChannel.send({ embeds: [messageEmbed] });
	}
};

// function to create a timecode
export const timecodeFormats = {
	date: 'd',
	longdate: 'D',
	time: 't',
	longtime: 'T', // with seconds
	datetime: 'f',
	longdatetime: 'F',
	dynamic: 'R',
};

type TimecodeFormat = keyof typeof timecodeFormats;

export const createTimecode = (timestamp: number, format: TimecodeFormat) =>
	`<t:${Math.floor(timestamp / 1000)}:${timecodeFormats[format]}>`;
export const isValidHexCode = (str: string) => /^#[0-9A-F]{6}$/i.test(str);

// instead of interaction, destructure the client from a generic object? It would only work with things that have a client property, but that's fine
export const getGuild = async (interaction: PraetorInteraction) =>
	interaction.client.db.data.guilds[interaction.guildId!];
