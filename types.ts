import type { Interaction, SlashCommandBuilder } from 'discord.js';
import type { PraetorClient } from './praetorClient.ts';

export interface StatEntry {
	stat: string;
	value: number;
}

export interface GuildConfig {
	defaults: { embedColor: string };
	reactionBoard?: Record<string, Record<string, string>>;
	[key: string]: unknown;
}

export interface Database {
	guilds: Record<string, GuildConfig>;
	statistics: Record<string, StatEntry[]>;
}

export interface DataFile {
	name: string;
	execute: Function;
}

export interface Command extends DataFile {
	data: SlashCommandBuilder;
	global?: boolean;
}

export interface Event extends DataFile {
	once: boolean;
}

export type PraetorInteraction = Interaction & {
	client: PraetorClient;
};
