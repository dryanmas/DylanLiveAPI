var db = require('../db');
var Promise = require('bluebird');

var Show = {};

//	TODO: all setlist!
/**
	returns all shows within a date range
	start inclusive, end exclusive and optional
	expects start and end to be timestamps
**/
Show.date = function(range) {
	var start = range[0]
	var end = range[1] || Math.floor((Date.now()/1000)) + 1000000;

	return db('shows').select('*')
	.where('date', '>=', start)
 	.andWhere('date', '<', end)
 	.orderBy('date')
}

/**
	returns all shows where at least one song was played 
	off a specified album 
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

/** ALL LOCATION BASED METHODS **/

/**
	returns all shows by venue/city
**/
Show.venue = function(location) {
	return db('shows').select('*')
	.where({venue: location[0]})
	.andWhere({city: location[1]})
	.orderBy('venue')
}

/**
	returns all shows by city/state/country
**/
Show.city = function(location) {
	return db('shows').select('*')
	.where({city: location[0]})
	.andWhere({state: location[1]})
	.andWhere({country: location[2]})
	.orderBy('city')
}

/**
	returns all shows by state
**/
Show.state = function(state) {
	return db('shows').select('*')
	.where({state: state})
	.orderBy('state')
}

/**
	returns all shows by country
**/
Show.country = function(country) {
	return db('shows').select('*')
	.andWhere({country: country})
	.orderBy('country')
}


module.exports = Show;