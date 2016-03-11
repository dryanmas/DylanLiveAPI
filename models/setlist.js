var db = require('../db');
var Setlist = {};

Setlist.insert = function(liveSong) {
	return db('live_songs').select('*').where({
		show_id: liveSong.show_id,
		song_id: liveSong.song_id	
	})
	.orWhere({show_id: liveSong.show_id})
	.andWhere({rank: liveSong.rank})
	.then(function(rows) {
		if (rows.length) throw 400;

		return db('live_songs').insert(liveSong).returning('id')
	})
	.then(pluckFirst)
	.catch(function() {
		throw 400;
	})
}

var pluckFirst = function(rows) {
	return rows[0];
}

module.exports = Setlist; 