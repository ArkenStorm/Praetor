import { SlashCommandBuilder } from 'discord.js';

declare global {
	interface Command {
		name: string,
		data: SlashCommandBuilder,
		execute: Function,
		global?: boolean
	}
}

export {};