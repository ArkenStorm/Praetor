import type { Interaction, SlashCommandBuilder } from 'discord.js';
import type { PraetorClient } from './praetorClient.ts';

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
