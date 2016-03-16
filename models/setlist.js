var db = require('../db');
var Promise = require('bluebird');
var Setlist = {};

Setlist.insertSong = function(liveSong) {
	return db('live_songs').insert(liveSong).returning('id')
	.then(pluckFirst)
	.catch(function() {
		throw 400; 
	})
}

Setlist.insertList = function(titles, showId) {
	return Promise.all(titles.map(function(title, i) {
		return db('songs').select('id').where({title: title})
		.then(function(rows) {
			var liveSong = {
				song_id: rows[0].id,
				show_id: showId,
				rank: i
			}

			return Setlist.insertSong(liveSong)
		})
	})) 
}

//TODO Join with song name
Setlist.findByShow = function(showId) {
	return db('songs').select('*')
	.leftJoin('live_songs', 'songs.id', 'live_songs.song_id')
  .where({show_id: showId})
  .orderBy('rank', 'inc')
}

var pluckFirst = function(rows) {
	return rows[0];
}

module.exports = Setlist; 