import { Low } from 'lowdb';
import type { Command, Database } from './types.ts';
import { Client, type ClientOptions, Collection } from 'discord.js';

export class PraetorClient extends Client {
	commands: Collection<string, Command>;
	db!: Low<Database>;

	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection<string, Command>();
	}
}