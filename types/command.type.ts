import type { Interaction, MessageReaction, SlashCommandBuilder } from 'discord.js';
import type { PraetorClient } from '../praetorClient.ts';

export interface DataFile {
	name: string;
	execute: Function;
}

export interface CommandSetup extends DataFile {
	data: SlashCommandBuilder;
	global?: boolean;
	onSubmit?: (interaction: unknown) => Promise<void>;
	autocomplete?: (interaction: unknown) => Promise<void>;
}

export interface EventSetup extends DataFile {
	once: boolean;
}

export type PraetorInteraction = Interaction & {
	client: PraetorClient;
};

export type PraetorReaction = MessageReaction & {
	client: PraetorClient;
};
