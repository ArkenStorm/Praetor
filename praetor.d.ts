import type { Client, Collection, Interaction, SlashCommandBuilder } from 'discord.js';
import type { Low } from 'lowdb';

declare global {
	interface DataFile {
		name: string;
		execute: Function;
	}

	interface Command extends DataFile {
		data: SlashCommandBuilder;
		global?: boolean;
	}

	interface Event extends DataFile {
		once: boolean;
	}

	interface PraetorClient extends Client {
		commands: Collection<string, Command>;
		db: Low<any>;
	}

	type PraetorInteraction = Interaction & {
		client: PraetorClient;
	};
}

export {};