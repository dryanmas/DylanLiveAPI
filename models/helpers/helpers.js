var db = require('../../db');
var Promise = require('bluebird');
var count = require('./count');

var helpers = {};

//TODO: promisify the first two to make them consistent?

//TODO: fix this so its not hard coded
helpers.decades = function() {
	return ['60s', '70s', '80s', '90s', '00s', '10s'];
}

helpers.years = function() {
	var years = [];
	for (var year = 1960; year <= (new Date).getFullYear(); year++) {
		years.push(year)
	}
	return years;
}

helpers.months = Promise.coroutine(function *() {
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

var rowMap = function(rows) {
	return rows.map(function(entry) {
		return entry[Object.keys(entry)[0]];
	})
}

var getAll = function(type, table) {
	return function() {
		return db(table).select(type)
		.whereNotNull(type)
		.distinct(type)
		.orderBy(type)
		.then(rowMap)
	}
}

helpers.states = getAll('state', 'shows');
helpers.countries = getAll('country', 'shows');
helpers.albums = getAll('release', 'songs');

helpers.venues = function() {
	return db('shows').select('venue')
	.whereNotNull('venue')
	.distinct('venue', 'city')
	.orderBy('venue')
	.then(rowMap)
}

helpers.cities = function() {
	return db('shows').select('city')
	.whereNotNull('city')
	.distinct('city', 'state', 'country')
	.orderBy('city')
	.then(rowMap)
}

module.exports = helpers;