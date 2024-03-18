const { Events } = require('discord.js');
const { execute: reactionBoardExecute } = require('../behaviors/reactionBoard');
// const { execute: autoreactExecute } = require('../behaviors/autoreact');

// if reactionBoard is enabled, always do it
// if autoreact is enabled, check if the reaction is a reactionBoard emoji (moot if reactionBoard is disabled). If it is NOT, continue with business as usual
// if autoreact is enabled, make sure the reactedToMessage is not a bot message (no reactionBoard-ing bot messages)

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction) {
		if (reaction.partial) {
			const fullReaction = await reaction.fetch();
			reactionBoardExecute(fullReaction);
		} else {
			reactionBoardExecute(reaction);
		}
	}
};