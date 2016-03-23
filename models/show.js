var db = require('../db');
var Promise = require('bluebird');
var where = require('./where');

var Show = {};


var getBy = function(type, criteria) {
	var query = db('shows').select('*');

	return where[type](criteria, query)
	.orderBy(type);
}

/**
	returns all shows within a date range
	start inclusive, end exclusive and optional
	expects start and end to be timestamps
**/
Show.date = function(range) {
	return getBy('date', range);
}

/**
	this one's a special snowflake so it cant use the getBy function
**/
Show.album = function(album) {
	return db.select('*').from('shows')
	.whereIn('shows.id', function() {
		this.select('show_id').from('songs')
		.leftJoin('live_songs', 'songs.id', 'song_id')
	 	.where({release: album})
	})
	.orderBy('date');
}

/**
	returns all shows by venue/city
**/
Show.venue = function(location) {
	return getBy('venue', location);
}

/**
	returns all shows by city/state/country
**/
Show.city = function(location) {
	return getBy('city', location);
}

/**
	returns all shows by state
**/
Show.state = function(state) {
	return getBy('state', state);
}

/**
	returns all shows by country
**/
Show.country = function(country) {
	return getBy('country', country);
}


module.exports = Show;