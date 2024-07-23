const { Events } = require('discord.js');
const { execute: reactionBoardExecute } = require('../behaviors/reactionBoard');

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