import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { getGuild } from '../../utils.ts';

const name = 'quote';
const global = false;

const data = new SlashCommandBuilder()
	.setName(name)
	.setDescription('Memorialize a quote with a fancy embed!')
	.addStringOption(option =>
		option.setName('who')
			.setDescription('Whoever said the thing')
			.setMaxLength(256)
			.setRequired(true)
	)
	.addStringOption(option =>
		option.setName('quote')
			.setDescription('What was said?')
			.setMaxLength(4096)
			.setRequired(true)
	);

const execute = async interaction => {
	await interaction.deferReply({ flags: MessageFlags.Ephemeral });
	const speakerOfTheQuote = interaction.options.getString('who');
	let quote = interaction.options.getString('quote');
	if (!quote.startsWith('"')) {
		quote = '"' + quote;
	}
	if (!quote.endsWith('"')) {
		quote += '"';
	}

	const quoteEmbed = new EmbedBuilder()
		.setColor('#2295d4') // get color from config
		.setAuthor({ name: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL() })
		.setDescription(quote)
		.setFooter({ text: `-${speakerOfTheQuote}` });

	const quoteChannelId = (await getGuild(interaction))?.commands?.quote?.channelId;
	if (quoteChannelId) {
		const quoteChannel = await interaction.guild.channels.cache.get(quoteChannelId);
		await quoteChannel.send({ embeds: [quoteEmbed] });
	} else {
		await interaction.channel.send({ embeds: [quoteEmbed] });
	}
	await interaction.editReply('Quote recorded!');
};

export { data, execute, global, name };
