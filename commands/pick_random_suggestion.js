const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
// const SOTDHistory = require('../models/SOTDHistory');
const suggestion_History = require('../models/suggestionHistory');
const fetch = require('isomorphic-unfetch');
const { getData } = require('spotify-url-info')(fetch);
// eslint-disable-next-line prefer-const
async function buildEmbed(in_data) {

	// console.log(in_data);
	const embed_fields = [];
	await getData(in_data.song_url).then((spotifydata) => {
		const trackinfo = spotifydata;
		const name = trackinfo.name;
		const artist = trackinfo.artists[0].name;
		embed_fields.push({
			name: `${in_data.song_url} \n (${name} By ${artist})`,
			value: `Suggested By: ${in_data.user_id} \n Suggestion ID: ${in_data.suggestion_id}`,
		});
	});

	// console.log('end of loop');
	const randomEmbed = new EmbedBuilder()
		.setTitle('Random Song From Suggestions')
		.setTimestamp()
		.setFields(embed_fields);
	return randomEmbed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pick_random_suggestion')
		.setDescription('Run this command to be presented with a random song to use as Song of the Day!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild),
	async execute(interaction) {
		await interaction.deferReply();
		const guild_ID = interaction.guild.id;
		const history_count = await suggestion_History.countDocuments({ guild_id: guild_ID.toString() });
		if (history_count == 0) {
			interaction.editReply({ content: 'This server currently has no song suggestions! \nSomebody has to suggest a song first for this to work! ' });
		}
		else {
			const results = await suggestion_History.find({ guild_id: guild_ID.toString(), used:false });
			// console.log(results);
			const result = results[Math.floor(Math.random() * results.length)];
			// console.log(result);
			// await interaction.editReply({ content: 'This command is still under development', ephemeral: true });
			const RandomEmbed = await buildEmbed(result);
			await interaction.followUp({ embeds: [RandomEmbed] });
		}
	} };