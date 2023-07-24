const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
// eslint-disable-next-line prefer-const
const suggestionHistory = require('../models/suggestionHistory');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('mark_suggestion_used')
		.setDescription('Mark the suggestion as used')
		.addStringOption(option =>
			option.setName('id')
				.setDescription('The ID of the song suggestion to remove.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('confirm')
				.setDescription('Confirm change'))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const suggestion_id = interaction.options.getString('id');
		const confirm = interaction.options.getBoolean('confirm') ?? false;
		if (confirm) {
			try {
				await suggestionHistory.updateOne({ suggestion_id: suggestion_id, used: false }, { used: true }).then(result => {
					if (result.modifiedCount > 0) {
						interaction.editReply({ content: 'Update success.' });
					}
					else {
						interaction.editReply({ content: 'No matching suggestions found. Either this suggestion does not exist or it has already been marked as used! ', ephemeral: true });
					}
				});
			}
			catch (error) {
				await interaction.editReply({ content: 'There was an error updating this suggestion. Please Double check that the ID is correct and that this suggestion has not already been marked as used.', ephemeral: true });
			}

		}
		else {
			await interaction.editReply({ content: 'Command canceled because the "confirm" tag was not set to true. Plese set the "confirm" option to true to confirm updating of this entry. \n Please note: **__This Action is irreversible!__** ' });
		}

	} };