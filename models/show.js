var db = require('../db');
var Promise = require('bluebird');
var Setlist = require('./setlist');
var Show = {};


// Show.all = function() {
// 	return db('shows').select('*')
// 	.then(function(shows) {
// 		return Promise.all(shows.map(function(show) {
// 			return Setlist.findByShow(show.id);
// 		}))
// 	})
// }

// Show.findByDate = function(date) {
// 	return findBy('date', date);
// }

Show.findByUrl = function(url) {
	return findBy('url', url);
}

Show.insert = function(shows, setlists) {
	return Promise.all(shows.map(function(show) {
		return Show.findByUrl(show.url)
		.then(function(exists) {
			if (exists) throw 'Duplicate show';
		})
	}))
	.then(function() {
		return db('shows').insert(shows).returning('id')
	})
	.then(function(ids) {	
		return Setlist.insertAll(setlists, ids);
	})
}

Show.mostRecent = function() {
	return db('shows').max('date')
	.then(function(rows) {
		var date = rows[0].max;
		return db('shows').select('*')
		.where({date: date})
	})
	.then(pluckFirst);
}

// Show.allBySong = function(songId) {
// 	return db('shows').select('*')
// 	.whereIn('id', function() {
// 		db('live_songs').select('show_id')
// 		.where({song_id: songId})
// 	})
// }

var pluckFirst = function(rows) {
	return rows[0];
}

var findBy = function(key, value) {
	var criteria = {};
	criteria[key] = value;

	return db('shows').select('*')
	.where(criteria)
	.then(pluckFirst)
}


module.exports = Show;