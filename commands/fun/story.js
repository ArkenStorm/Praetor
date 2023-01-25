const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { getGuild } = require('../../utils');

const data = new SlashCommandBuilder()
	.setName('story')
	.setDescription('Memorialize a short story with a fancy embed!')
    .addIntegerOption(option =>
        option.setName('lines')
            .setDescription('How many lines of dialogue? (max 5)')
            .setMinValue(1)
            .setMaxValue(5)
            .setRequired(true)
    );

const execute = async interaction => {
	const speakerOfTheQuote = interaction.options.getString('who');
	const quote = interaction.options.getString('quote');

	const quoteEmbed = new EmbedBuilder()
		.setColor('#2295d4')
		.addFields([{ name: '\u200b', value: quote }, { name: '\u200b', value: `- ${speakerOfTheQuote}` }])
		.setFooter({ text: `Provided by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() });

	const quoteChannelId = getGuild(interaction).value()?.config?.quoteChannelId;
	if (quoteChannelId) {
		const quoteChannel = await interaction.guild.channels.cache.get(quoteChannelId);
		await quoteChannel.send({ embeds: [quoteEmbed] });
	} else {
		await interaction.channel.send({ embeds: [quoteEmbed] });
	}
};

module.exports = {
	data,
	execute
};