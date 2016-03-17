var db = require('../db');
var Promise = require('bluebird');
var Setlist = require('./setlist');
var helpers = require('./helpers/modelHelpers');

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
Show.byDate = function(start, end) {
	end = end || Math.floor((Date.now()/1000)) + 1000000;

	return db('shows').select('*')
	.andWhere('date', '>=', start)
 	.andWhere('date', '<', end)
 	.orderBy('date')
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