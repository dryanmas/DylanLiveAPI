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
	.then(function(song) {
		if (song) throw 400;

		return db('songs').insert(song); 
	})
}

module.exports = Song;