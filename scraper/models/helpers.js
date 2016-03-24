var db = require('../../db');
var Promise = require('bluebird');

var helpers = {}

/**
	grabs the first value from an array
**/
helpers.pluckFirst = function(rows) {
	return rows[0];
}

/**
	finds an entry with a column value from a specified table
**/
helpers.find = function(value, column, table) {
	var criteria = {};
	criteria[column] = value;

	return db(table).select('*')
	.where(criteria)
	.then(helpers.pluckFirst)
}

/**
	maps an array of song titles to an array of setlits
	with proper foreign ids
**/
helpers.mapSetlist = function(titles, showId) {
	return Promise.all(titles.map(function(title, i) {
		return db('songs').select('id').where({title: title})
		.then(function(rows) {
			if(!rows.length) throw 'Could not insert setlist; songs do not exist';

			return {
				song_id: rows[0].id,
				show_id: showId,
				rank: i
			}
		})
	}))
}

module.exports = helpers;