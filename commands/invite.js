const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const url = 'https://discord.com/api/oauth2/authorize?client_id=1133450129148481638&permissions=414464735296&scope=bot+applications.commands';
module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Invite the bot to your server'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });
		const inviteEmbed = new EmbedBuilder()
			.setColor([255, 255, 0])
			.setTitle('Add me to your server!')
			.setDescription('Share your love of music')
			.addFields({ name:'URL', value: `${url}`, inline: true });
		await interaction.editReply({ embeds: [inviteEmbed], ephemeral: true });
	},
};