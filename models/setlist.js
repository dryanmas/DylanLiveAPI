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

Setlist.insertList = function(arr, show_id) {
	return Promise.all(arr.map(function(title, i) {
		return db('songs').select('id').where({title: title})
		.then(function(rows) {
			var liveSong = {
				song_id: rows[0].id,
				show_id: show_id,
				rank: i
			}

			return Setlist.insertSong(liveSong)
		})
	})) 
}

var pluckFirst = function(rows) {
	return rows[0];
}

module.exports = Setlist; 