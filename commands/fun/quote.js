import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getGuild, isValidHexCode } from '../../utils.js';

const data = new SlashCommandBuilder()
	.setName('quote')
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
	await interaction.deferReply({ ephemeral: true });
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

	const quoteChannelId = (await getGuild(interaction))?.config?.quoteChannelId;
	if (quoteChannelId) {
		const quoteChannel = await interaction.guild.channels.cache.get(quoteChannelId);
		await quoteChannel.send({ embeds: [quoteEmbed] });
	} else {
		await interaction.channel.send({ embeds: [quoteEmbed] });
	}
	await interaction.editReply('Quote recorded!');
};

const configOptions = {
	// <option i.e. 'embedColor'> -> { type: <Type i.e. String, Boolean, Color, etc.>, validation: <func> }
	embedColor: {
		type: 'Color',
		validator: isValidHexCode
	},
	channelId: {
		type: String
		// validator: val => val // test if it's a valid channelId or nah?
	}
};

const global = false;
const name = 'quote';

export {
	data,
	execute,
	configOptions,
	global,
	name
};