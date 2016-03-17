var db = require('../db');
var Promise = require('bluebird');
var count = require('../helpers/count');
var helpers = require('./helpers');

var Song = {};

/**
	returns all songs ordered alphabetically
	TODO: modularize the count logic 
**/
Song.all = function() {
	return db('songs').select('*')
	.orderBy('title')
}

/**
	adds count to an array of songs
**/
Song.addCount = function(songs) {
	return Promise.all(songs.map(function(song) {
		return count.all(song.id)
		.then(function(amount) {
			song.count = amount;
			return song;
		})
	}))
}


/**
	returns a song with a given title
**/
Song.byTitle = function(title) {
	return helpers.find(title, 'title', 'songs');
}

/**
	returns all songs within a date range
	start inclusive, end exclusive and optional
	expects start and end to be timestamps
**/
Song.byDate = function(start, end) {
	end = end || Math.floor((Date.now()/1000)) + 1000000;

	return db('songs').select('*')
	.whereIn('id', function() {
		return db('shows').select('song_id')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
 		.andWhere('date', '>=', start)
 		.andWhere('date', '<', end)
	})
	.orderBy('title')
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
	return Song.byTitle(song.title)
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