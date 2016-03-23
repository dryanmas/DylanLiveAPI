var db = require('../db');
var where = require('../models/where');
/** MISC COUNT HELPERS **/


var countBy = function(type, criteria, idCheck) {
	var query = db('shows').count('*')
	.leftJoin('live_songs', 'shows.id', 'live_songs.show_id');

	return where[type](criteria, query)
	.andWhere(idCheck)
	.then(parse)
}
/**
	helper function to grab and parse counts
**/
var parse = function(rows) {
	return parseInt(rows[0].count);
}


var Count = {};

/**
	counts all performances of a specified song
**/
Count.all = function(songId) {
	return db('live_songs')
	.count('*')
	.where({song_id: songId})
	.then(parse) 
}

/** 
	COUNT FUNCTIONS
 	for each type there will be a 'oneSong' function to count
 	all type of one specified song and a 'total' function
 	to count that type for all songs
**/

/**
	counts all performances of off a specified album
**/
Count.album = {
	oneSong: Count.all,
	total: function(album) {
		return db('songs').count('*')
		.leftJoin('live_songs', 'songs.id', 'live_songs.song_id')
		.where({release: album})
		.then(parse)
	}
}

/**
	counts all performances between a start and optional end date
	expects start and end to be timestamps
**/

Count.date = {
	oneSong: function(songId, range) {
		return countBy('date', range, {song_id: songId});
	},
	total: function(range) {
		return countBy('date', range, {});	
	} 
} 

/**
	counts all performances in a specified venue/city
**/
Count.venue = {
	oneSong: function(songId, location) {
		return countBy('venue', location, {song_id: songId});
	},
	total: function(location) {
		return countBy('venue', location, {});
	}
}

/**
	counts all performances in a specified city/state/country
**/
Count.city = {
	oneSong: function(songId, location) {
		return countBy('city', location, {song_id: songId});
	},
	total: function(location) {
		return countBy('city', location, {});
	}
} 

/**
	counts all performances in a specified state
**/
Count.state = {
	oneSong: function(songId, state) {
		return countBy('state', state, {song_id: songId});
	},
	total: function(state) {
		return countBy('state', state, {});
	} 
}


/**
	counts all performances in a specified country
**/
Count.country = {
	oneSong: function(songId, country) {
		return countBy('country', country, {song_id: songId});
	},
	total: function(country) {
		return countBy('country', country, {});
	} 
}


module.exports = Count;