const mongoose = require('mongoose');
const suggestion_History = new mongoose.Schema({
	guild_id: String,
	song_url: String,
	user_id: String,
	suggestion_id: String,
	used: Boolean,
});

module.exports = mongoose.model('suggestionHistory', suggestion_History);