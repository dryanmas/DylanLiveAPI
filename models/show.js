var db = require('../db');
var Promise = require('bluebird');
var Setlist = require('./setlist');
var helpers = require('./helpers');

var Show = {};

/**
	inserts an array of shows and each coresponding setlist
**/
Show.insert = function(shows, setlists) {
	return Show.allUnique(shows)
	.then(function() {
		return db('shows').insert(shows).returning('id')
	})
	.then(function(ids) {	
		return Setlist.insert(setlists, ids);
	})
}

/**
	returns the most recently performed show
**/
Show.mostRecent = function() {
	return db('shows').max('date')
	.then(function(rows) {
		var date = rows[0].max;
		return db('shows').select('*')
		.where({date: date})
	})
	.then(helpers.pluckFirst);
}

/**
	returns all shows within a date range
	start inclusive, end exclusive and optional
	expects start and end to be timestamps

	TODO: all setlist!
**/
Show.byDate = function(range) {
	var start = range[0]
	var end = range[1] || Math.floor((Date.now()/1000)) + 1000000;

	return db('shows').select('*')
	.where('date', '>=', start)
 	.andWhere('date', '<', end)
 	.orderBy('date')
}

/**
	returns all shows by venue/city
**/
Show.byVenue = function(location) {
	return db('shows').select('*')
	.where({venue: location[0]})
	.andWhere({city: location[1]})
	.orderBy('venue')
}

/**
	returns all shows by city/state/country
**/
Show.byCity = function(location) {
	return db('shows').select('*')
	.where({city: location[0]})
	.andWhere({state: location[1]})
	.andWhere({country: location[2]})
	.orderBy('city')
}

/**
	returns all shows by state
**/
Show.byState = function(state) {
	return db('shows').select('*')
	.where({state: state})
	.orderBy('state')
}

/**
	returns all shows by country
**/
Show.byCountry = function(country) {
	return db('shows').select('*')
	.andWhere({country: country})
	.orderBy('country')
}

/**
	finds a show based on url
**/
Show.byUrl = function(url) {
	return helpers.find(url, 'url', 'shows');
}

/**
	checks that a show is not already in the DB
**/
Show.checkUnique = function(show) {
	return Show.byUrl(show.url)
	.then(function(exists) {
		if (exists) throw 'Duplicate show!';
	})
}

/**
	checks that none of the shows are already in the DB
**/
Show.allUnique = function(shows) {
	return Promise.all(shows.map(Show.checkUnique));
}


module.exports = Show;