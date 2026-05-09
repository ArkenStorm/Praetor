import { Events, MessageReaction, PartialMessageReaction } from 'discord.js';
import { execute as reactionBoardExecute } from '../behaviors/fun/reactionBoard.ts';
import type { PraetorReaction } from '../types/command.type.ts';
// import { execute as autoreactExecute } from '../behaviors/fun/autoreact';

// if reactionBoard is enabled, always do it
// if autoreact is enabled, check if the reaction is a reactionBoard emoji (moot if reactionBoard is disabled). If it is NOT, continue with business as usual
// if autoreact is enabled, make sure the reactedToMessage is not a bot message (no reactionBoard-ing bot messages)

const name = Events.MessageReactionAdd;
const execute = async (reaction: MessageReaction | PartialMessageReaction) => {
	if (reaction.partial) {
		const fullReaction = await reaction.fetch();
		reactionBoardExecute(fullReaction as PraetorReaction);
	} else {
		reactionBoardExecute(reaction as PraetorReaction);
	}
};

export { execute, name };
