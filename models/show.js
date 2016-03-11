var db = require('../db');
var Show = {};


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
		
		return db('shows').insert(show).returning('date');
	})
}

Show.mostRecent = function() {
	return db('shows').select('id', 'date')
	.where({date: 'Apr 2 2015'})
	.then(function(rows) {
		if (!rows.length) return;

		var mostRecent = rows[0];

		rows.forEach(function(show) {
			if (compare(show.date, mostRecent.date)) {
				mostRecent = show;
			}
		})

		return db('shows').select('*').where({id: mostRecent.id})
	})
	.then(function(rows) {
		return rows[0];
	})
}

var findBy = function(key, value) {
	var criteria = {};
	criteria[key] = value;

	return db('shows').select('*')
	.where(criteria)
	.then(function(rows){
		return rows[0];
	})
}

var compare = function(d1, d2) {
	d1 = new Date(d1).getTime();
	d2 = new Date(d2).getTime();

	return d1 > d2
}

module.exports = Show;