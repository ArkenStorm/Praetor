import { Events, type Message } from 'discord.js';
import { showTag } from '../commands/fun/tag.ts';
import type { PraetorClient } from '../praetorClient.ts';

const name = Events.MessageCreate;
const execute = async (message: Message<boolean> & { client: PraetorClient }) => {
	if (!message.content.startsWith('!')) return;
	if (message.inGuild()) {
		// get guild config, check if tags (and any other future necessary ones) are enabled, otherwise just return
		showTag(message);
	}
};

export { execute, name };
