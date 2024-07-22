const { Events } = require('discord.js');
const { execute: reactionBoardExecute } = require('../behaviors/reactionBoard');

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