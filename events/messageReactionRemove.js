import { Events } from 'discord.js';
import { execute as reactionBoardExecute } from '../behaviors/fun/reactionBoard.js';

const name = Events.MessageReactionAdd;
const execute = async (reaction) => {
	if (reaction.partial) {
		const fullReaction = await reaction.fetch();
		reactionBoardExecute(fullReaction);
	} else {
		reactionBoardExecute(reaction);
	}
}

export {
	name,
	execute
};