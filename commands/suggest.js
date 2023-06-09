/* eslint-disable no-undef */
/* eslint-disable no-shadow */
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const suggestionHistory = require('../models/suggestionHistory');
const songHistory = require('../models/suggestionHistory');
const { randomUUID } = require('crypto');

async function hasHistory(serverID, song_url) {
	const suggestion_count = await suggestionHistory.count({ guild_id: serverID.toString(), song_url: song_url.toString() });
	const announced_count = await songHistory.count({ guild_id: serverID.toString(), song_url: song_url.toString() });
	if (announced_count > 0 || suggestion_count > 0) {
		return true;
	}
	else {
		return false;
	}
}
module.exports = {
	data: new SlashCommandBuilder().setName('suggest_song')
		.setDescription('Suggest a song to be announced')
		.addStringOption(option => option.setName('spotify-url')
			.setDescription('Spotify URL')
			.setRequired(true))
		.setDMPermission(false),


	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const spotify_url_to_parse = interaction.options.getString('spotify-url');
		const guild_ID = interaction.guild.id;
		const suggested = await hasHistory(guild_ID, spotify_url_to_parse);
		if (suggested) {
			const NoticeEmbed = new EmbedBuilder()
				.setColor([255, 0, 0])
				.setTitle('Notice')
				.setDescription('It appears this song has already been suggested or announced in this server before.');
			await interaction.editReply({ content: 'Cancelled!', ephemeral: true });
			await interaction.followUp({ ephemeral: true, embeds: [NoticeEmbed] });

		}
		else {
			const UUID = randomUUID();
			const suggestionentry = new suggestionHistory({ guild_id: interaction.guild.id, song_url: spotify_url_to_parse, user_id: interaction.user.tag, suggestion_id: UUID, used: false });
			suggestionentry.save();

			await interaction.editReply({ content: 'Suggestion Saved!', ephemeral: true }).then();
		}
	},
};