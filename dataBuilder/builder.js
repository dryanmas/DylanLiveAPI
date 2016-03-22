var Promise = require('bluebird');
var Criteria = require('./criteria');  
/** an abstract as fuck tool for building out the shape of my data **/

/**
	builds out an indiviudal unit of songs
**/
var buildSongs = Promise.coroutine(function *(value, methods) {	
	var songs = yield methods.getSongs(value);

	for (var i = 0; i < songs.length; i++) {
		songs[i].count = yield methods.count.oneSong(songs[i].id, value);
	}

	return songs;
})

/**
	builds out full collection of data 
**/
var builder = Promise.coroutine(function *(type, methods) {
	var data = {};
	var collection = yield methods.getCollection();

	for (var i = 0; i < collection.length; i++) {
		var value = methods.toValue(collection[i]);
		var key = methods.toString(collection[i]);

		//data shape with be different in songs vs shows
		if (type === 'song') {
			var entry = {
				all: yield buildSongs(value, methods),
				total: yield methods.count.total(value) 
			} 
		}	else {
			var entry = yield methods.getShows(value);
		}

		data[key] = entry; 
	}

	return data; 
})

module.exports = {
	song: function(criterion) {
		return builder('song', Criteria[criterion]); 
	},
	show: function(criterion) {
		return builder('show', Criteria[criterion]); 
	}
};
