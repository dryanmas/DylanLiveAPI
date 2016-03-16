var db = require('../db');
var Promise = require('bluebird');
var Setlist = {};

// Setlist.insertSong = function(liveSong) {
// 	return db('live_songs').insert(liveSong).returning('id')
// 	.then(pluckFirst)
// 	.catch(function() {
// 		throw 400; 
// 	})
// }

//Might want to turn this into a helper function
Setlist.insert = function(titles, showId) {
	return Promise.all(titles.map(function(title, i) {
		return db('songs').select('id').where({title: title})
		.then(function(rows) {
			return {
				song_id: rows[0].id,
				show_id: showId,
				rank: i
			}
		})
	}))
	.then(function(songs) {
		return db('live_songs').insert(songs).returning('id')
	})
	.catch(function() {
		throw 'Could not insert setlist';
	}) 
}

Setlist.insertAll = function(setlists, showIds){
	return Promise.all(setlists.map(function(setlist, i) {
		return Setlist.insert(setlist, showIds[i]);
	}))
	.then(function() {
		return showIds;
	})
}

//TODO Join with song name
// Setlist.findByShow = function(showId) {
// 	return db('songs').select('*')
// 	.leftJoin('live_songs', 'songs.id', 'live_songs.song_id')
//   .where({show_id: showId})
//   .orderBy('rank', 'inc')
// }

var pluckFirst = function(rows) {
	return rows[0];
}

module.exports = Setlist; 