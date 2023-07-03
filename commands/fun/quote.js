const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getGuild, isValidHexCode } = require('../../utils');

const data = new SlashCommandBuilder()
	.setName('quote')
	.setDescription('Memorialize a quote with a fancy embed!')
	.addStringOption(option =>
		option.setName('who')
			.setDescription('Whoever said the thing')
			.setRequired(true)
	)
	.addStringOption(option =>
		option.setName('quote')
			.setDescription('What was said?')
			.setRequired(true)
	);

const execute = async interaction => {
	const speakerOfTheQuote = interaction.options.getString('who');
	const quote = interaction.options.getString('quote');

	const quoteEmbed = new EmbedBuilder()
		.setColor('#2295d4') // get color from config
		.addFields([{ name: '\u200b', value: quote }, { name: '\u200b', value: `- ${speakerOfTheQuote}` }])
		.setFooter({ text: `Quoted by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() });

	const quoteChannelId = getGuild(interaction).value()?.config?.quoteChannelId;
	if (quoteChannelId) {
		const quoteChannel = await interaction.guild.channels.cache.get(quoteChannelId);
		await quoteChannel.send({ embeds: [quoteEmbed] });
	} else {
		await interaction.channel.send({ embeds: [quoteEmbed] });
	}
};

const configOptions = {
	// <option i.e. 'embedColor'> -> { type: <Type i.e. String, Boolean, Color, setc.>, validation: <func> }
	embedColor: {
		type: 'Color',
		validator: isValidHexCode
	},
	channelId: {
		type: String
		// validator: val => val // test if it's a valid channelId or nah?
	}
};

module.exports = {
	configOptions,
	data,
	execute,
	global: false,
	name: 'quote'
};