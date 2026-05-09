import { Events, MessageReaction, PartialMessageReaction } from 'discord.js';
import { execute as reactionBoardExecute } from '../behaviors/fun/reactionBoard.ts';
import type { PraetorReaction } from '../types/command.type.ts';

const name = Events.MessageReactionRemove;
const execute = async (reaction: MessageReaction | PartialMessageReaction) => {
	if (reaction.partial) {
		const fullReaction = await reaction.fetch();
		reactionBoardExecute(fullReaction as PraetorReaction);
	} else {
		reactionBoardExecute(reaction as PraetorReaction);
	}
};

export { execute, name };
