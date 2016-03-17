var db = require('../../db');
var Promise = require('bluebird');
var count = require('./count');

var collections = {};

//TODO: might need to make the first two promises... 
//we'll see how yield works  

/**
	returns an array of the decades in which Dylan has been active
	heads up: not a promise
**/
collections.decades = function() {
	var decades = [];
	for (var year = 1960; year <= (new Date).getFullYear(); year+=10) {
		years.push(year);
	}
	return years;
}

/**
	returns an array of the years in which Dylan has been active
	heads up: not a promise
**/
collections.years = function() {
	var years = [];
	for (var year = 1960; year <= (new Date).getFullYear(); year++) {
		years.push(year)
	}
	return years;
}

/**
	returns an array of the months in which Dylan has played a show
	the return array contains tuples of the form [month, year]
	ex. [6, 1995] for June of 1995
**/
collections.months = Promise.coroutine(function *() {
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

			var amount = yield count.allByDate(startStamp, endStamp);
			if (amount) months.push([month+1, year]);
		}
	}

	return months;
})

/**
	maps an array of objects containing one key/value pair 
	to an array of the values themselves
**/
var rowMap = function(rows) {
	return rows.map(function(entry) {
		return entry[Object.keys(entry)[0]];
	})
}

/**
	gets all of a column type from a table, getting rid of 
	duplicate and null values and ordering by the column type
**/
var getAll = function(type, table) {
	return function() {
		return db(table).select(type)
		.whereNotNull(type)
		.distinct(type)
		.orderBy(type)
		.then(rowMap)
	}
}

/**
	gets all states in which Dylan has played
**/
collections.states = getAll('state', 'shows');

/**
	gets all countries in which Dylan has played
**/
collections.countries = getAll('country', 'shows');

/**
	gets all albums off of which Dylan has played a song live
**/
collections.albums = getAll('release', 'songs');

/**
	gets all venues in which Dylan has played
**/
collections.venues = function() {
	return db('shows').select('venue')
	.whereNotNull('venue')
	.distinct('venue', 'city')
	.orderBy('venue')
	.then(rowMap)
}

/**
	gets all cities in which Dylan has played
**/
collections.cities = function() {
	return db('shows').select('city')
	.whereNotNull('city')
	.distinct('city', 'state', 'country')
	.orderBy('city')
	.then(rowMap)
}

module.exports = collections;