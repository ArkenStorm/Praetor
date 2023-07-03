const { ActionRowBuilder, EmbedBuilder, ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { getGuild } = require('../../utils');

const data = new SlashCommandBuilder()
	.setName('story')
	.setDescription('Memorialize a short story with a fancy embed!')
	.addIntegerOption(option =>
		option.setName('lines')
			.setDescription('How many lines of dialogue? (max 5)')
			.setMinValue(2)
			.setMaxValue(5)
			.setRequired(true)
	);

const execute = async interaction => {
	const numLines = interaction.options.getInteger('lines');
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
			.setMaxLength(1024)
			.setRequired(true);
		allInputRows.push(new ActionRowBuilder().addComponents(line));
	}
	storyModal.addComponents(allInputRows);
	await interaction.showModal(storyModal);
};

const onSubmit = async interaction => {
	// TODO: This embed formatting is going to need to change
	const embedFields = [];
	for (let i = 0; i < interaction.fields.size(); i++) {
		const lineText = interaction.fields.getTextInputValue(`line${i}`);
		embedFields.push({ name: '\u200b', value: lineText });
	}

	const quoteEmbed = new EmbedBuilder()
		.setColor('#2295d4')
		.addFields(embedFields)
		.setFooter({ text: `Provided by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() });

	const quoteChannelId = (await getGuild(interaction))?.value()?.config?.quoteChannelId;
	if (quoteChannelId) {
		const quoteChannel = await interaction.guild.channels.cache.get(quoteChannelId);
		await quoteChannel.send({ embeds: [quoteEmbed] });
	} else {
		await interaction.channel.send({ embeds: [quoteEmbed] });
	}
	await interaction.editReply('Story recorded!');
};

module.exports = {
	data,
	execute,
	onSubmit,
	global: false,
	name: 'story'
};