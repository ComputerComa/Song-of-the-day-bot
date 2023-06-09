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
		// console.log(outrackID);
		return outrackID;
	},
	rebuildSongID: function rebuildSongID(input) {
		const BaseURI = 'https://open.spotify.com/track/';
		const out = BaseURI + input;
		return out;
	},
	parseNewFormat: function parseNewFormat(input) {
		const out_1 = input.split(':');
		const out_2 = out_1[2];
		return out_2;
	},
	reconvertURL: function reconvertURL(input) {
		const out_1 = this.parseNewFormat(input);
		const out_2 = this.rebuildSongID(out_1);
		return out_2;
	},
	validate_spotify_url: function validateURL(input) {
		const reg = /((open)\.spotify\.com\/)/;
		const out = input.match(reg);
		if (out > 0) {
			return true;
		}
		else {
			return false;
		}
	},
	remove_referer: function removeReferer(input) {
		if (input.includes('?si')) {
			const out_1 = input.split('?si');
			// console.log(out_1);
			const out_2 = out_1[0];
			return out_2;
		}
		else {
			return input;
		}

	},
};