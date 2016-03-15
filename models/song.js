var db = require('../db');
var Promise = require('bluebird');
var Song = {};

Song.all = function() {
	return db('songs').select('*');
}

Song.allByCount = function() {
	return Song.all()
	.then(function(songs) {
		return Promise.all(songs.map(function(song) {
			return Song.count(song.id)
			.then(function(count) {
				song.count = count;
				return song; 
			})
		}))
	})
	.then(function(songs) {
		return songs.sort(function(x, y) {
			return y.count - x.count;
		})
	})
}

Song.count = function(id) {
	return db('live_songs').count('*')
	.where({song_id: id})
	.then(function(rows){
		return parseInt(rows[0].count); 
	}) 
}

Song.findByTitle = function(title) {
	return findBy('title', title);
}

Song.findByUrl = function(url) {
	return findBy('url', url);
}

Song.insert = function(song) {
	return Song.findByUrl(song.url)
	.then(function(exists) {
		if (exists) throw 400;
		
		return db('songs').insert(song).returning('id'); 
	})
	.then(pluckFirst)
}

var pluckFirst = function(rows) {
	return rows[0];
}

var findBy = function(key, value) {
	var criteria = {};
	criteria[key] = value;

	return db('songs').select('*')
	.where(criteria)
	.then(pluckFirst)
}

module.exports = Song;