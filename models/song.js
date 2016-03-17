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
Song.byDate = function(range) {
	var start = range[0]
	var end = range[1] || Math.floor((Date.now()/1000)) + 1000000;

	return db.select('*').from('songs')
	.whereIn('songs.id', function() {
		this.select('song_id').from('shows')
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

/** ALL LOCATION BASED METHODS **/

Song.location = {}

/**
	returns all songs by venue/city
**/
Song.location.venue = function(location) {
	return db.select('*').from('songs')
	.whereIn('songs.id', function() {
		this.select('song_id').from('shows')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where({venue: location[0]})
		.andWhere({city: location[1]})
	})
	.orderBy('title')
}

/**
	returns all songs by city/state/country
**/
Song.location.city = function(location) {
	return db.select('*').from('songs')
	.whereIn('songs.id', function() {
		this.select('song_id').from('shows')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where({city: location[0]})
		.andWhere({state: location[1]})
		.andWhere({country: location[2]})
	})
	.orderBy('title')
}

/**
	returns all songs by state
**/
Song.location.state = function(state) {
	return db.select('*').from('songs')
	.whereIn('songs.id', function() {
		this.select('song_id').from('shows')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where({state: state})
	})
	.orderBy('title')
}

/**
	returns all songs by country
**/
Song.location.country = function(country) {
	return db.select('*').from('songs')
	.whereIn('songs.id', function() {
		this.select('song_id').from('shows')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where({country: country})
	})
	.orderBy('title')
}

module.exports = Song;