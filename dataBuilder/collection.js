var db = require('../db');
var Promise = require('bluebird');
var Count = require('./count');

var Collection = {};

/** ALL DATE BASED COLLECTIONS **/

/**
	returns an array of the decades in which Dylan has been active
**/
Collection.decade = function() {
	return new Promise(function(resolve) {
		var decades = [];
		for (var year = 1960; year <= (new Date).getFullYear(); year+=10) {
			decades.push(year);	
		}
		resolve(decades);
	});
}

/**
	returns an array of the years in which Dylan has been active
**/
Collection.year = function() {
	return new Promise(function(resolve) {
		var years = [];
		for (var year = 1960; year <= (new Date).getFullYear(); year++) {
			years.push(year)
		}
		resolve(years);
	})
}

/**
	returns an array of the months in which Dylan has played a show
	the return array contains tuples of the form [month, year]
	ex. [6, 1995] for June of 1995
**/
Collection.month = Promise.coroutine(function *() {
	var months = [];
	for (var year = 1960; year <= (new Date).getFullYear(); year++) {
		for (var month = 0; month < 12; month++ ) {
			
			var start = new Date(year, month);
			
			if (month < 11) {
				var end = new Date(year, month+1);
			} else {
				var end = new Date(year+1, 0);
			}

			var startStamp = Math.floor(start.getTime()/1000); 
			var endStamp = Math.floor(end.getTime()/1000);

			var amount = yield Count.date.total([startStamp, endStamp]);
			if (amount) months.push([month+1, year]);
		}
	}

	return months;
})


/**
	Helper: gets all of a column type from a table, getting rid 
	of duplicate and null values and ordering by the column type
**/
var getAll = function(type, table) {
	return function() {
		return db(table).select(type)
		.whereNotNull(type)
		.distinct(type)
		.orderBy(type)
		.then(function(rows) {
			return rows.map(function(entry) {
				return entry[Object.keys(entry)[0]];
			})
		})
	}
}

/** ALL LOCATION BASED COLLECTIONS **/

/**
	gets all venues in which Dylan has played
	returns an array of tuples of the form [venue, city]
**/
Collection.venue = function() {
	return db('shows').select('venue', 'city')
	.whereNotNull('venue')
	.distinct('venue', 'city')
	.orderBy('venue')
	.then(function(rows) {
		return rows.map(function(row) {
			return [row.venue, row.city];
		})
	})
}

/**
	gets all cities in which Dylan has played
	returns an array of arrays of the form [city, state, country]
**/
Collection.city = function() {
	return db('shows').select('city', 'state', 'country')
	.whereNotNull('city')
	.distinct('city', 'state', 'country')
	.orderBy('city')
	.then(function(rows) {
		return rows.map(function(row) {
			return [row.city, row.state, row.country];
		})
	})
}

/**
	gets all states in which Dylan has played
**/
Collection.state = getAll('state', 'shows');

/**
	gets all countries in which Dylan has played
**/
Collection.country = getAll('country', 'shows');

/**
	gets all albums off of which Dylan has played a song live
**/
Collection.album = getAll('release', 'songs');


module.exports = Collection;