var db = require('../../db');

var helpers = {};

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

helpers.months = function() {
	var months = [];
	//db nonsense 
	return months;
}

helpers.cities = function() {
	db('shows').select('city')
	.distinct('city')
	.orderBy('city')
}

helpers.states = function() {

}

helpers.countries = function() {

}

helpers.albums = function() {

}

helpers.venues = function() {

}


module.exports = helpers;