/// <reference path="./praetor.d.ts" />
import { Collection } from 'discord.js';

declare module 'discord.js' {
	interface PraetorClient extends Client {
		commands: Collection<string, Command>;
	}
}