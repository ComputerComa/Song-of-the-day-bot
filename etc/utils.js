module.exports = {
	zeropad: function zeropad(number) {
		if (number < 10) {
			number = '0' + number;
			return number.toString();
		}
		else {
			return number.toString();
		}
	},
	getSongID: function getSongID(spotifyurl, newURL) {
		const BaseURI = 'spotify:track:';
		const split_url = spotifyurl.split('/');
		const len = split_url.length;
		let trackid = split_url[len - 1];
		if (newURL) {
			const NewTrackid = trackid.split('?');
			trackid = NewTrackid[0];
		}
		const outrackID = BaseURI + trackid;
		console.log(outrackID);
		return outrackID;
	},
};