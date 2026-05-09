import { Client, type ClientOptions, Collection } from 'discord.js';
import { Low } from 'lowdb';
import type { CommandSetup } from './types/command.type.ts';
import type { Database } from './types/db.type.ts';

export class PraetorClient extends Client {
	commands: Collection<string, CommandSetup>;
	db!: Low<Database>;

	constructor(options: ClientOptions) {
		super(options);
		this.commands = new Collection<string, CommandSetup>();
	}
}
