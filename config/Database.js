const mongoose = require('mongoose');
const config = require('../config.json');

class Database {
	constructor() {
		this.connection = null;
	}
	connect() {
		console.log('Connecting to database...');
		mongoose.connect(config.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}).then(() => {
			console.log('Connected to database');
			this.connection = mongoose.connection;
		}).catch(err => {
			console.error(err);
		});
	}
}
module.exports = Database;
