const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('../config.json');
const TOKEN = config.TOKEN;


module.exports = {
	name: 'ready',
	once: true,
	execute(client, commands) {
		client.user.setPresence({
			activities: [{
				name: 'With the spotify Mixtape',
			}],
		});
		client.user.setStatus('idle');
		console.log(`Logged in as ${client.user.id}`);
		let rest = null;
		// Registering the commands in the client
		const CLIENT_ID = client.user.id;
		// console.log(CLIENT_ID)

		rest = new REST().setToken(TOKEN);

		(async () => {
			try {

				/* await rest.put(Routes.applicationCommands(CLIENT_ID), {
                        body: []
                    },)*/
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: commands,
				});
				console.log('Successfully registered application commands globally');

			}
			catch (error) {
				if (error) {console.error(error);}
			}
		})();

	},
};
console.log('Bot ready');
