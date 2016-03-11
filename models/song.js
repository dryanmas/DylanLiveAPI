var db = require('../db');
var Song = {};

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
		
		return db('songs').insert(song).returning('title'); 
	})
}

var findBy = function(key, value) {
	var criteria = {};
	criteria[key] = value;

	return db('songs').select('*')
	.where(criteria)
	.then(function(rows){
		return rows[0];
	})
}

module.exports = Song;