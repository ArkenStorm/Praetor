// const { Events } = require('discord.js');
import { Events } from 'discord.js';

const name = Events.MessageReactionRemoveAll;
const execute = async (reaction) => {
	// probably won't just be a simple reactionBoardExecute
}

export {
	name,
	execute
};