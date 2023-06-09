const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const fetch = require('isomorphic-unfetch');
const { getData } = require('spotify-url-info')(fetch);
const SOTDHistory = require('../models/SOTDHistory');
const { PermissionFlagsBits } = require('discord.js');
const utils = require('../etc/utils');
// eslint-disable-next-line prefer-const
const sort = { date_announced: -1 };
async function buildHistoryEmbed(in_data, page_s, page_e, gid_Name) {

	// console.log(in_data);
	const embed_fields = [];
	// .log('start of loop');
	// console.log(embed_fields);
	for (const song of in_data) {
		// console.log('loop');
		const url = utils.reconvertURL(song.song_ID);
		await getData(url).then((spotifydata) => {
			const trackinfo = spotifydata;
			const name = trackinfo.name;
			const artist = trackinfo.artists[0].name;
			const ann_date = new Date(song.date_announced);
			const ann_month = ann_date.getMonth() + 1;
			const ann_day = ann_date.getDate();
			const ann_year = ann_date.getFullYear();
			embed_fields.push({
				name: `${name} - ${artist}`,
				value: `${ann_month}-${ann_day}-${ann_year}`,
			});
		});
	}
	// console.log('end of loop');
	const historyEmbed = new EmbedBuilder()
		.setTitle(`History for ${gid_Name}`)
		.setDescription(`Page ${page_s} of ${page_e}`)
		.setTimestamp()
		.setFields(embed_fields);
	return historyEmbed;
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_announcement_history')
		.setDescription('Gets the announcement history for the server')
		.addIntegerOption(option =>
			option.setName('page')
				.setDescription('The page of history to view.'))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild | PermissionFlagsBits.ManageEvents),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const guild_ID = interaction.guild.id;
		const guild_Name = interaction.guild.name;
		const page_to_query = interaction.options.getInteger('page') ?? 1;
		const history_count = await SOTDHistory.count({ guild_id: guild_ID.toString() });
		if (history_count == 0) {
			interaction.editReply({ content: 'This server has never had a SOTD announcement!', ephemeral: true });
		}
		else {
			const total_pages = parseInt((history_count / 10)) + 1;
			if (page_to_query > total_pages) {
				interaction.editReply({ content: `${page_to_query} is greater than the number of available pages (${total_pages})`, ephemeral: true });
			}
			else if (page_to_query == 1) {
				const page_result = await SOTDHistory.find({ guild_id: guild_ID.toString() }, null, { limit : 10, sort: sort });
				// console.log(page_result);
				const history_Embed = await buildHistoryEmbed(page_result, page_to_query, total_pages, guild_Name);
				interaction.editReply({ content: `Page ${page_to_query} of ${total_pages} sent! \n to see another page please use the \`page\` option`, ephemeral: true });
				interaction.channel.send({ embeds: [history_Embed] });
			}
			else {
			// const guild_history = await SOTDHistory.find({ guild_id: guild_ID.toString() });
				const limit_op = (page_to_query - 1) * 10;
				// console.log(limit_op);
				const page_result = await SOTDHistory.find({ guild_id: guild_ID.toString() }, null, { limit : 10, skip: limit_op, sort: sort });
				// console.log(page_result);
				const history_Embed = await buildHistoryEmbed(page_result, page_to_query, total_pages, guild_Name);
				interaction.editReply({ content: `Page ${page_to_query} of ${total_pages} sent! \n to see another page please use the \`page\` option`, ephemeral: true });
				interaction.channel.send({ embeds: [history_Embed] });
			}
		}

	} };