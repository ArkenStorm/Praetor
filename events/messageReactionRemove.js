import { Events } from 'discord.js';
import { execute as reactionBoardExecute } from '../behaviors/fun/reactionBoard.ts';

const name = Events.MessageReactionRemove;
const execute = async (reaction) => {
	if (reaction.partial) {
		const fullReaction = await reaction.fetch();
		reactionBoardExecute(fullReaction);
	} else {
		reactionBoardExecute(reaction);
	}
};

export { execute, name };
