// const { Events } = require('discord.js');
import { Events } from 'discord.js';
// const { execute: reactionBoardExecute } = require('../behaviors/reactionBoard');
import { execute as reactionBoardExecute } from '../behaviors/reactionBoard';
// const { execute: autoreactExecute } = require('../behaviors/autoreact');
// import { execute as autoreactExecute } from '../behaviors/autoreact';

// if reactionBoard is enabled, always do it
// if autoreact is enabled, check if the reaction is a reactionBoard emoji (moot if reactionBoard is disabled). If it is NOT, continue with business as usual
// if autoreact is enabled, make sure the reactedToMessage is not a bot message (no reactionBoard-ing bot messages)

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