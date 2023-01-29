const { ActionRowBuilder, EmbedBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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
	const numLines = interaction.options.getNumber('lines');
	const storyModal = new ModalBuilder()
		.setCustomId('storyModal')
		.setTitle('New Story');

	const allInputRows = [];
	for (let i = 0; i < numLines; i++) {
		const line = new TextInputBuilder()
			.setCustomId(`line${i}`)
			.setLabel(`Line ${i}`)
			.setStyle(TextInputStyle.Short)
			.setPlaceholder('<Name>: "The thing they said"')
			.setRequired(true);
		allInputRows.push(new ActionRowBuilder().addComponents(line));
	}
	storyModal.addComponents(allInputRows);
	await interaction.showModal(storyModal);
};

const onSubmit = async interaction => {
	const embedFields = [];
	for (let i = 0; i < 5; i++) {
		const lineText = interaction.fields.getTextInputValue(`line${i}`);
		if (!lineText) {
			i = 5; // end the loop
		} else {
			embedFields.push({ name: '\u200b', value: lineText });
		}
	}

	const quoteEmbed = new EmbedBuilder()
		.setColor('#2295d4')
		.addFields(embedFields)
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
	execute,
	onSubmit,
	name: 'story'
};