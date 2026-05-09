import type { Interaction, SlashCommandBuilder } from 'discord.js';
import type { PraetorClient } from '../praetorClient.ts';

export interface DataFile {
	name: string;
	execute: Function;
}

export interface CommandSetup extends DataFile {
	data: SlashCommandBuilder;
	global?: boolean;
}

export interface EventSetup extends DataFile {
	once: boolean;
}

export type PraetorInteraction = Interaction & {
	client: PraetorClient;
};
