var db = require('../db');
var Promise = require('bluebird');
var count = require('../dataBuilder/count');
var where = require('./where');

var Song = {};

/**
	returns all songs ordered alphabetically
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

var findBy = function(type, criteria) {
	var innerQuery = function() {
		var that = this;
		var query = that.select('song_id').from('shows')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id');
 	 	
 	 	return where[type](criteria, query);
	}

	return db.select('*').from('songs')
	.whereIn('songs.id', innerQuery)
	.orderBy('title')
}

/**
	returns all songs within a date range
	start inclusive, end exclusive and optional
	expects start and end to be timestamps
**/
Song.date = function(range) {
	return findBy('date', range);
}

/**
	returns all songs off of an album 
**/
Song.album = function(album) {
	return db('songs').select('*')
	.where({release: album})
	.orderBy('title')
}

/**
	returns all songs by venue/city
**/
Song.venue = function(location) {
	return findBy('venue', location);
}

/**
	returns all songs by city/state/country
**/
Song.city = function(location) {
	return findBy('city', location);
}

/**
	returns all songs by state
**/
Song.state = function(state) {
	return findBy('state', state);
}

/**
	returns all songs by country
**/
Song.country = function(country) {
	return findBy('country', country);
}

module.exports = Song;