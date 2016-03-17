var db = require('../db');
var Promise = require('bluebird');
var count = require('./helpers/count');
var helpers = require('./helpers/modelHelpers');

var Song = {};

/**
	returns a song with a given title
**/
Song.findByTitle = function(title) {
	return helpers.find(title, 'title', 'songs');
}

/**
	inserts an array of songs, returning an array of ids
**/
Song.insert = function(songs) {
	return Song.allUnique(songs)
	.then(function() {		
		return db('songs').insert(songs).returning('id'); 
	})
}

/**
	checks that a song is not already in the DB
**/
Song.checkUnique = function(song) {
	return Song.findByTitle(song.title)
	.then(function(exists) {
		if (exists) throw 'Duplicate song!';
	})
}

/**
	checks that none of the songs are already in the DB
**/
Song.allUnique = function(songs) {
	return Promise.all(songs.map(Song.checkUnique));
}

module.exports = Song;