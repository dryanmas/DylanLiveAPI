var db = require('../db');
var Promise = require('bluebird');
var count = require('../dataBuilder/count');

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
Song.date = function(range) {
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
Song.city = function(location) {
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
Song.state = function(state) {
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
Song.country = function(country) {
	return db.select('*').from('songs')
	.whereIn('songs.id', function() {
		this.select('song_id').from('shows')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where({country: country})
	})
	.orderBy('title')
}

module.exports = Song;