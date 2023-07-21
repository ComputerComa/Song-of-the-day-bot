const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
// const SOTDHistory = require('../models/SOTDHistory');
const suggestion_History = require('../models/suggestionHistory');
const fetch = require('isomorphic-unfetch');
const { getData } = require('spotify-url-info')(fetch);
// eslint-disable-next-line prefer-const
const sort = { date_announced: -1 };
async function buildHistoryEmbed(in_data, page_s, page_e, gid_Name) {

	console.log(in_data);
	const embed_fields = [];
	console.log('start of loop');
	console.log(embed_fields);
	for (const suggestion of in_data) {
		await getData(suggestion.song_url).then((spotifydata) => {
			const trackinfo = spotifydata;
			const name = trackinfo.name;
			const artist = trackinfo.artists[0].name;
			embed_fields.push({
				name: `${suggestion.song_url} \n (${name} By ${artist})`,
				value: `Suggested By: ${suggestion.user_id} \n Suggestion ID: ${suggestion.suggestion_id}`,
			});
		});
	}
	console.log('end of loop');
	const historyEmbed = new EmbedBuilder()
		.setTitle(`Suggestion list for ${gid_Name}`)
		.setDescription(`Page ${page_s} of ${page_e}`)
		.setTimestamp()
		.setFields(embed_fields);
	return historyEmbed;
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_suggestion_history')
		.setDescription('Gets the suggestion list for the server')
		.addIntegerOption(option =>
			option.setName('page')
				.setDescription('The page of suggestions to view.')),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const guild_ID = interaction.guild.id;
		const guild_Name = interaction.guild.name;
		const page_to_query = interaction.options.getInteger('page') ?? 1;
		const history_count = await suggestion_History.count({ guild_id: guild_ID.toString() });
		if (history_count == 0) {
			interaction.editReply({ content: 'This server currently has no song suggestions!', ephemeral: true });
		}
		else {
			const total_pages = parseInt((history_count / 10)) + 1;
			if (page_to_query > total_pages) {
				interaction.editReply({ content: `${page_to_query} is greater than the number of available pages (${total_pages})`, ephemeral: true });
			}
			else if (page_to_query == 1) {
				const page_result = await suggestion_History.find({ guild_id: guild_ID.toString(), used: false }, null, { limit : 10, sort: sort });
				console.log(page_result);
				const history_Embed = await buildHistoryEmbed(page_result, page_to_query, total_pages, guild_Name);
				interaction.editReply({ content: `Page ${page_to_query} of ${total_pages} sent! \n to see another page please use the \`page\` option`, ephemeral: true });
				interaction.channel.send({ embeds: [history_Embed] });
			}
			else {
			// const guild_history = await SOTDHistory.find({ guild_id: guild_ID.toString() });
				const limit_op = (page_to_query - 1) * 10;
				// console.log(limit_op);
				const page_result = await suggestion_History.find({ guild_id: guild_ID.toString(), used: false }, null, { limit : 10, skip: limit_op, sort: sort });
				// console.log(page_result);
				const history_Embed = await buildHistoryEmbed(page_result, page_to_query, total_pages, guild_Name);
				interaction.editReply({ content: `Page ${page_to_query} of ${total_pages} sent! \n to see another page please use the \`page\` option`, ephemeral: true });
				interaction.channel.send({ embeds: [history_Embed] });
			}
		}
	} };