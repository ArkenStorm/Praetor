// const { EmbedBuilder } = require('discord.js');
import { EmbedBuilder } from 'discord.js';

const processAttachment = a => {
	const mediaLink = a.split('.');
	const mediaType = mediaLink[mediaLink.length - 1];
	const media = /(jpg|jpeg|png|gif|webp|mov|mp4|mp3|webm|ogg|avi|mpg|mpeg|flv|wmv|flac|wav)/gi.test(mediaType);
	return media ? a : null;
}

const generateEmbed = async (reaction, message) => {
	let image = message.attachments.size > 0 ? processAttachment(message.attachments.first().url) : null;
	if (!image && message.embeds.length > 0) {
		image = message.embeds[0].image?.url || message.embeds[0].thumbnail?.url;
	}

	if (!image && message.cleanContent.length === 0) { return null; } // no reaction stuff for empty messages

	return new EmbedBuilder()
		.setColor('#f1c40f')
		.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
		.setDescription(message.cleanContent)
		.setImage(image)
		.addFields(
			{ name: `:${reaction.emoji.name}: Count`, value: `${reaction.count}`, inline: true },
			{ name: 'Channel', value: message.channel, inline: true },
			{ name: ':arrow_heading_up: Jump', value: `[Tally Ho!](${message.url})`, inline: true }
		)
		.setTimestamp(new Date());
}

const applyReactionBoardMessage = async (reaction, config) => {
	// do I need to fetch the reaction? is it always a partial?
	const message = reaction.message;
	const reactChannelId = config[reaction.emoji.name].channelId;
	const reactChannel = await message.guild.channels.fetch(reactChannelId);
	if (!reactChannel) { return; }
	
	const embed = await generateEmbed(reaction, message);
	if (!embed) { return; }

	// if the message is already in the reactionBoard, edit it
	// if the messageId is in the db, fetch it
	const oldEmbedMessageId = await reaction.client.db.get(`reactionBoard[${message.guildId}][${reaction.emoji.name}][${message.id}]`)?.value();
	if (oldEmbedMessageId) {
		const oldMessage = await reactChannel.message.fetch(oldEmbedMessageId);
		if (reaction.count < config[reaction.emoji.name].threshold) {
			await oldMessage.delete();
			await reaction.client.db.remove(`reactionBoard[${message.guildId}][${reaction.emoji.name}][${message.id}]`).write();
		} else {
			await oldMessage.edit({ embeds: [embed] });
		}
	} else {
		const sentMessage = await reactChannel.send({ embeds: [embed] });
		// key: reactedMessageId, value: reactBoardMessageId
		await reaction.client.db.set(`reactionBoard[${message.guildId}][${reaction.emoji.name}][${message.id}]`, sentMessage.id).write();
	}
}

const execute = async reaction => {
	const config = await reaction.client.db.get(`guilds[${reaction.message.guildId}].reactionBoard`)?.value();
	if (!config.enabled ||
		!reaction.emoji.name in config.emojis ||
		reaction.count < config[reaction.emoji.name].threshold) { return; }
	applyReactionBoardMessage(reaction, config);
}

const configOptions = {
	// <option i.e. 'embedColor'> -> { type: <Type i.e. String, Boolean, Color, etc.>, validation: <func> }
	threshold: {
		type: Number,
		validator: val => val > 1
	},
	channelId: {
		type: String
		// validator: val => val // test if it's a valid channelId or nah?
	},
	emojis: {
		type: Array
	}
}

const global = false;
const name = 'reactionBoard';

export {
	execute,
	configOptions,
	global,
	name
};