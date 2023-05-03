const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong'),
	async execute(interaction) {
		const ping_string = `${interaction.client.ws.ping} ms.`;
		const pingEmbed = new EmbedBuilder()
			.setColor([100, 100, 0])
			.setTitle('Ping....')
			.setDescription('...Pong')
			.addFields({ name:'latency', value: ping_string });
		interaction.reply({ embeds: [pingEmbed], ephemeral: true });
	},
};