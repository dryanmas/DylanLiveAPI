var db = require('../db');

/** MISC COUNT HELPERS **/

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
var all = function(songId) {
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
var album = {
	oneSong: all,
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
var date = {
	oneSong: function(songId, range) {
		return byDate({song_id: songId}, range);
	},
	total: function(range) {
		return byDate({}, range);
	} 
} 

/**
	counts all performances in a specified venue/city
**/
var venue = {
	oneSong: function(songId, location) {
		return byVenue({song_id: songId}, location);
	},
	total: function(location) {
		return byVenue({}, location);
	}
}

/**
	counts all performances in a specified city/state/country
**/
var city = {
	oneSong: function(songId, location) {
		return byCity({song_id: songId}, location);
	},
	total: function(location) {
		return byCity({}, location);
	}
} 

/**
	counts all performances in a specified state
**/
var state = {
	oneSong: function(songId, state) {
		return byState({song_id: songId}, state)
	},
	total: function(state) {
		return byState({}, state);
	} 
}


/**
	counts all performances in a specified country
**/
var country = {
	oneSong: function(songId, country) {
		return byCountry({song_id: songId}, country);
	},
	total: function(country) {
		return byCountry({}, country);
	} 
}

/**
	all location based count functions
**/
var location = {
	venue: venue,
	city: city,
	state: state,
	country: country
} 

module.exports = {
	all: all,
	album: album,
	date: date,
	location: location
}; 