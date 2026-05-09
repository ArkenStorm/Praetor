import { EmbedBuilder, type Message, type MessageReaction } from 'discord.js';
import type { PraetorClient } from '../../praetorClient.ts';
import type { ReactionBoardConfig } from '../../types/db.type.ts';

type PraetorReaction = MessageReaction & { client: PraetorClient };

const processAttachment = (a: string): string | null => {
	const mediaLink = a.split('.');
	const mediaType = mediaLink[mediaLink.length - 1];
	const media = /(jpg|jpeg|png|gif|webp|mov|mp4|mp3|webm|ogg|avi|mpg|mpeg|flv|wmv|flac|wav)/gi.test(mediaType);
	return media ? a : null;
};

const generateEmbed = (reaction: PraetorReaction, message: Message): EmbedBuilder | null => {
	let image: string | null = message.attachments.size > 0
		? processAttachment(message.attachments.first()!.url)
		: null;
	if (!image && message.cleanContent.length === 0) return null; // no reaction stuff for empty messages

	if (!image && message.embeds.length > 0) {
		image = message.embeds[0].image?.url || message.embeds[0].thumbnail?.url || null;
	}

	return new EmbedBuilder()
		.setColor('#f1c40f')
		.setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
		.setDescription(message.cleanContent)
		.setImage(image)
		.addFields(
			{ name: `:${reaction.emoji.name}: Count`, value: `${reaction.count}`, inline: true },
			{ name: 'Channel', value: message.channel.toString(), inline: true },
			{ name: ':arrow_heading_up: Jump', value: `[Tally Ho!](${message.url})`, inline: true },
		)
		.setTimestamp(new Date());
};

const applyReactionBoardMessage = async (reaction: PraetorReaction, config: ReactionBoardConfig) => {
	const message = reaction.message as Message;
	const emojiName = reaction.emoji.name!;
	const emojiConfig = config.emojis?.[emojiName];
	if (!emojiConfig) return;

	const reactChannel = await message.guild?.channels.fetch(emojiConfig.channelId);
	if (!reactChannel?.isTextBased()) return;

	const embed = generateEmbed(reaction, message);
	if (!embed) return;

	const oldEmbedMessageId = reaction.client.db.data.guilds[message.guildId!]?.commands?.reactionBoard?.board
		?.[emojiName]
		?.[message.id];

	if (oldEmbedMessageId) {
		if (reaction.count < emojiConfig.threshold) {
			const oldMessage = await reactChannel.messages.fetch(oldEmbedMessageId);
			await oldMessage.delete();
			await reaction.client.db.update(({ guilds }) => {
				const board = guilds[message.guildId!]?.commands?.reactionBoard?.board;
				if (board?.[emojiName]) {
					delete board[emojiName][message.id];
				}
			});
		} else {
			const oldMessage = await reactChannel.messages.fetch(oldEmbedMessageId);
			await oldMessage.edit({ embeds: [embed] });
		}
	} else {
		const sentMessage = await reactChannel.send({ embeds: [embed] });
		await reaction.client.db.update(({ guilds }) => {
			const guild = guilds[message.guildId!];
			if (!guild?.commands?.reactionBoard?.board) return;
			guild.commands.reactionBoard.board[emojiName] ??= {};
			guild.commands.reactionBoard.board[emojiName][message.id] = sentMessage.id;
		});
	}
};

const execute = async (reaction: PraetorReaction) => {
	const config = reaction.client.db.data.guilds[reaction.message.guildId!]?.commands?.reactionBoard;
	const emojiName = reaction.emoji.name;
	if (!config?.enabled || !emojiName || !config.emojis?.[emojiName]) return;
	applyReactionBoardMessage(reaction, config);
};

const global = false;
const name = 'reactionBoard';

export { execute, global, name };
