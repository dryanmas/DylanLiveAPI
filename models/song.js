var db = require('../db');
var Song = {};

Song.findByTitle = function(title) {
	return db('songs').select('*')
	.where({title: title})
	.then(function(rows){
		return rows[0];
	})
}

Song.insert = function(song) {
	return Song.findByTitle(song.title)
	.then(function(exists) {
		if (exists) throw 400;

		return db('songs').insert(song).returning('title'); 
	})
}

module.exports = Song;