const fs = require('fs');

// Require the necessary discord.js classes
const Database = require('./config/Database');
const db = new Database();
db.connect();

const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Create a new client instance
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
});


// Loading commands from the commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Loading the token from config file
const config = require('./config.json');
const TOKEN = config.TOKEN;
const commands = [];

// Creating a collection for commands in client
client.commands = new Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, commands));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, commands));
	}
}


client.login(TOKEN);
