var db = require('../../db');
var Promise = require('bluebird');
var helpers = require('./helpers');

var Setlist = {};

/**
	inserts one setlists, with coresponding show id
**/
Setlist.insertOne = function(titles, showId) {
	return helpers.mapSetlist(titles, showId)
	.then(function(songs) {

		return db('live_songs').insert(songs).returning('id')
	})
}

/**
	inserts an array of setlists, with coresponding show ids
**/
Setlist.insert = function(setlists, showIds){
	return Promise.all(setlists.map(function(setlist, i) {
		return Setlist.insertOne(setlist, showIds[i]);
	}))
	.then(function() {
		return showIds;
	})
}

module.exports = Setlist; 