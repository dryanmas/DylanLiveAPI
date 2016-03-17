var db = require('../db');

var count = {}

/**
	helper function to grab and parse counts
**/
var parse = function(rows) {
	return parseInt(rows[0].count);
}

/**
	counts songs between start and optional end date
	expects start and end to be timestamps
**/
var byDate = function(idCheck, range) {
	var start = range[0]
	end = range[1] || Math.floor((Date.now()/1000)) + 1000000;

	return db('shows').count('*')
	.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
 	.where(idCheck)
 	.andWhere('date', '>=', start)
 	.andWhere('date', '<', end)
	.then(parse)
}

/**
	counts songs performed at a specified venue/city
**/
var byVenue = function(idCheck, location) {
		return db('shows').count('*')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where(idCheck)
		.andWhere({venue: location[0]})
		.andWhere({city: location[1]})
		.then(parse)
}

/**
	counts songs by city performed
**/
var byCity = function(idCheck, location) {
	return db('shows').count('*')
	.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
	.where(idCheck)
	.andWhere({city: location[0]})
	.andWhere({state: location[1]})
	.andWhere({country: location[2]})
	.then(parse)
}

/**
	counts songs by location performed
**/
var byLocation = function(locationType) {
	return function(idCheck, location) {
		var locationCheck = {}
		locationCheck[locationType] = location;

		return db('shows').count('*')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where(idCheck)
		.andWhere(locationCheck)
		.then(parse)
	}
}

/**
	counts songs by state performed
**/
var byState = byLocation('state');

/**
	counts songs by country performed
**/
var byCountry = byLocation('country');

/**
	counts all performances of a specified song
**/
count.all = function(id) {
	return db('live_songs')
	.count('*')
	.where({song_id: id})
	.then(parse) 
}

/**
	counts all performances of a specified song off a specified album
**/
count.byAlbum = count.all;

/**
	counts all performances of all songs off a specified album
**/
count.allByAlbum = function(album) {
	return db('songs').count('*')
	.leftJoin('live_songs', 'songs.id', 'live_songs.song_id')
	.where({release: album})
	.then(parse)
}

/**
	counts all performances of a specified song between a start and
	optional end date
	expects start and end to be timestamps
**/
count.byDate = function(id, range) {
	return byDate({song_id: id}, range);
}

/**
	counts all performances of all songs between a start and
	optional end date
	expects start and end to be timestamps
**/
count.allByDate = function(range) {
	return byDate({}, range);
} 

/**
	counts all performances of a specified song in a specified city/state/country
**/
count.byCity = function(id, location) {
	return byCity({song_id: id}, location);
}

/**
	counts all performances of all songs in a specified city
**/
count.allByCity = function(location) {
	return byCity({}, location);
} 

/**
	counts all performances of a specified song in a specified state
**/
count.byState = function(id, state) {
	return byState({song_id: id}, state);
}

/**
	counts all performances of all songs in a specified state
**/
count.allByState = function(state) {
	return byState({}, state);
} 

/**
	counts all performances of a specified song in a specified country
**/
count.byCountry = function(id, country) {
	return byCountry({song_id: id}, country);
}

/**
	counts all performances of all songs in a specified country
**/
count.allByCountry = function(country) {
	return byCountry({}, country);
} 

/**
	counts all performances of a specified songs in a specified venue/city
	(excuse the excessive use of 'specified')
**/
count.byVenue = function(id, location) {
	return byVenue({song_id: id}, location);
}

/**
	counts all performances of all songs in a specified venue/city
**/
count.allByVenue = function(location) {
	return byVenue({}, location);
} 

module.exports = count; 