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
var byDate = function(idCheck, start, end) {
	end = end || Math.floor((Date.now()/1000)) + 1000000;

	return db('shows').count('*')
	.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
 	.where(idCheck)
 	.andWhere('date', '>=', start)
 	.andWhere('date', '<', end)
	.then(parse)
}

/**
	counts songs performed at a specified venue in a specified city
**/
var byVenue = function(idCheck, venue, city) {
		return db('shows').count('*')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where(idCheck)
		.andWhere({venue: venue})
		.andWhere({city: city})
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
	counts songs by city performed
**/
var byCity = byLocation('city');

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
count.byDate = function(id, start, end) {
	return byDate({song_id: id}, start, end);
}

/**
	counts all performances of all songs between a start and
	optional end date
	expects start and end to be timestamps
**/
count.allByDate = function(start, end) {
	return byDate({}, start, end);
} 

/**
	counts all performances of a specified song in a specified city
**/
count.byCity = function(id, city) {
	return byCity({song_id: id}, city);
}

/**
	counts all performances of all songs in a specified city
**/
count.allByCity = function(city) {
	return byCity({}, city);
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
	counts all performances of a specified songs in a specified venue 
	in a specified city
	(excuse the excessive use of 'specified')
**/
count.byVenue = function(id, venue, city) {
	return byVenue({song_id: id}, venue, city);
}

/**
	counts all performances of all songs in a specified venue 
	in a specified city
**/
count.allByVenue = function(venue, city) {
	return byVenue({}, venue, city);
} 

module.exports = count; 