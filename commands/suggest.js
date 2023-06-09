/* eslint-disable no-undef */
/* eslint-disable no-shadow */
const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const suggestionHistory = require('../models/suggestionHistory');
const songHistory = require('../models/SOTDHistory');
const { randomUUID } = require('crypto');
const { remove_referer } = require('../etc/utils');

async function hasHistory(serverID, song_url) {
	const suggestion_count = await suggestionHistory.count({ guild_id: serverID.toString(), song_url: song_url.toString() });
	const announced_count = await songHistory.count({ guild_id: serverID.toString(), song_url: song_url.toString() });
	const total_count = suggestion_count + announced_count;
	console.log(total_count);
	if (total_count >= 1) {
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
		const spotify_url = remove_referer(spotify_url_to_parse);
		const guild_ID = interaction.guild.id;
		const suggested = await hasHistory(guild_ID, spotify_url);
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
			const suggestionentry = new suggestionHistory({ guild_id: interaction.guild.id, song_url: spotify_url, user_id: interaction.user.tag, suggestion_id: UUID, used: false });
			suggestionentry.save();

			await interaction.editReply({ content: 'Suggestion Saved!', ephemeral: true }).then();
		}
	},
};
