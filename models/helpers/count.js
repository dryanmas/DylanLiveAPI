var db = require('../../db');

var count = {}

var parse = function(rows) {
	return parseInt(rows[0].count);
}

var byDate = function(idCheck, start, end) {
	end = end || Math.floor((Date.now()/1000)) + 1000000;

	return db('shows').count('*')
	.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
 	.where(idCheck)
 	.andWhere('date', '>=', start)
 	.andWhere('date', '<', end)
	.then(parse)
}

var byVenue = function(idCheck, venue, city) {
		return db('shows').count('*')
		.leftJoin('live_songs', 'shows.id', 'live_songs.show_id')
		.where(idCheck)
		.andWhere({venue: venue})
		.andWhere({city: city})
		.then(parse)
}

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

var byCity = byLocation('city');
var byState = byLocation('state');
var byCountry = byLocation('country');

count.all = function(id) {
	return db('live_songs')
	.count('*')
	.where({song_id: id})
	.then(parse) 
}

count.byAlbum = count.all;

count.allByAlbum = function(album) {
	return db('songs').count('*')
	.leftJoin('live_songs', 'songs.id', 'live_songs.song_id')
	.where({release: album})
	.then(parse)
}

count.byDate = function(id, start, end) {
	return byDate({song_id: id}, start, end);
}

count.allByDate = function(start, end) {
	return byDate({}, start, end);
} 

count.byCity = function(id, city) {
	return byCity({song_id: id}, city);
}

count.allByCity = function(city) {
	return byCity({}, city);
} 

count.byState = function(id, state) {
	return byState({song_id: id}, state);
}

count.allByState = function(state) {
	return byState({}, state);
} 

count.byCountry = function(id, country) {
	return byCountry({song_id: id}, country);
}

count.allByCountry = function(country) {
	return byCountry({}, country);
} 

count.byVenue = function(id, venue, city) {
	return byVenue({song_id: id}, venue, city);
}

count.allByVenue = function(venue, city) {
	return byVenue({}, venue, city);
} 

module.exports = count; 