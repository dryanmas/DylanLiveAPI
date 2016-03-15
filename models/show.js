var db = require('../db');
var Setlist = require('./setlist');
var Show = {};


Show.all = function() {
	return db('shows').select('*')
	.then(function(shows) {
		return Promise.all(shows.map(function(show) {
			return Setlist.findByShow(show.id);
		}))
	})
}

Show.findByDate = function(date) {
	return findBy('date', date);
}

Show.findByUrl = function(url) {
	return findBy('url', url);
}

Show.insert = function(show) {
	return Show.findByUrl(show.url)
	.then(function(exists) {
		if (exists) throw 400;
		
		return db('shows').insert(show).returning('id');
	})
	.then(pluckFirst);
}

Show.mostRecent = function() {
	return db('shows').select('id', 'date')
	.then(function(rows) {
		if (!rows.length) return;

		var mostRecent = rows[0];

		rows.forEach(function(show) {
			if (compare(show.date, mostRecent.date)) {
				mostRecent = show;
			}
		})

		return db('shows').select('*').where({id: mostRecent.id})
		.then(pluckFirst);
	})
}

Show.allBySong = function(songId) {
	return db('shows').select('*')
	.whereIn('id', function() {
		db('live_songs').select('show_id')
		.where({song_id: songId})
	})
}

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

var compare = function(d1, d2) {
	d1 = new Date(d1).getTime();
	d2 = new Date(d2).getTime();

	return d1 > d2
}

module.exports = Show;