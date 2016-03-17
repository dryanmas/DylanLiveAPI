var db = require('../db');
var Setlist = require('../models/setlist');
var Promise = require('bluebird');

var songs = [ 
	{	
		title: "song1",
		release: "release1",
		url: "bobdylan.com/song1",
		credit: "Written by Bobby-D",
		lyrics: "la lala lalalalalalalalalalla"
	},
 	{
		title: "song2",
		release: "release1",
		url: "",
		credit: "",
		lyrics: ""
	},
	{
		title: "song3",
		release: "release1",
		url: "",
		credit: "",
		lyrics: ""
	},	
	{
		title: "song4",
		release: "release2",
		url: "",
		credit: "",
		lyrics: ""
	},
	{
		title: "song5",
		release: "release3",
		url: "",
		credit: "",
		lyrics: ""
	},
	{
		title: "song6",
		release: "release4",
		url: "",
		credit: "",
		lyrics: ""
	},
	{
		title: "song7",
		release: "release1",
		url: "",
		credit: "",
		lyrics: ""
	}
]

var getTimestamp = function(date) {
	return Math.floor(new Date(date).getTime()/1000);
}


var shows = [
	{
		date: getTimestamp('Apr 2 2015'),
		url: 'bobdylan.com/showshowshow',
		city: 'Tukluck',
		state: 'Tennessee',
		country: 'United States',
		venue: 'Some venue'
	},
	{
		date: getTimestamp('Sep 8 2009'),
		url: 'bobdylan.com/blahblah',
		city: 'Clearfield',
		state: 'Utah',
		country: 'United States', 
		venue: 'House show'
	},
	{
		date: getTimestamp('Sep 10 1966'),
		url: '',
		city: 'Medford',
		state: 'Oregon',
		country: 'United States', 
		venue: 'House show'
	},
	{
		date: getTimestamp('Aug 16 1969'),
		url: 'bobdylan.com/showshowshow',
		city: 'Tukluck',
		state: 'Tennessee',
		country: 'United States',
		venue: 'Another venue'
	},
	{
		date: getTimestamp('Jun 30 1977'),
		url: 'bobdylan.com/blahblah',
		city: 'Madrid',
		country: 'Spain', 
		venue: 'The Bullfighting rink'
	},
	{
		date: getTimestamp('Oct 2 2015'),
		url: 'bobdylan.com/asdf',
		city: 'Salt Lake City',
		state: 'Utah',
		country: 'United States', 
		venue: 'USANA'
	},
	{
		date: getTimestamp('Oct 2 1990'),
		url: '',
		city: 'Salt Lake City',
		state: 'Utah',
		country: 'United States', 
		venue: 'USANA'
	}
]

var setlists = [
	[songs[0].title, songs[1].title],
	[songs[0].title, songs[1].title, songs[4].title],
	[songs[1].title, songs[2].title, songs[6].title],
	[songs[1].title, songs[5].title, songs[6].title],
	[songs[0].title, songs[3].title, songs[4].title],
	[songs[2].title, songs[3].title, songs[4].title, songs[6].title],
	songs.map(function(song) {return song.title})
]

//clears and populates database
var populateDB = function() {
	songs.forEach(function(song) {
		delete song.id;
	});

	shows.forEach(function(show) {
		delete show.id;
	});

	return db('live_songs').del()
	.then(function() {
		return db('shows').del()
	})
	.then(function() {
		return db('songs').del();
	})
	.then(function() {
		return db('songs').insert(songs).returning('id')
		.then(function(ids) {
			songs.forEach(function(song, i) {
				song.id = ids[i];
			})
		})
	})
	.then(function() {
		return db('shows').insert(shows).returning('id')
		.then(function(ids) {
			shows.forEach(function(show, i) {
				show.id = ids[i];
			})
		})
	})
	.then(function() {
		return Setlist.insert(setlists, shows.map(function(show) {
			return show.id;
		}))
	})
}

module.exports = {
	songs: songs,
	shows: shows,
	setlists: setlists,
	populateDB: populateDB
}
