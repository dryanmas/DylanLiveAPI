var db = require('../db.js');
var Song = require('../models/song');
var Show = require('../models/show');
var Setlist = require('../models/setlist');

var expect = require('chai').expect;

var song1 = {
	title: "Dylan's 88th Dream",
	release: "Bootlegs n stuff",
	url: "bobdylan.com/dylans88th",
	credit: "Written by Bobby-D",
	lyrics: "la lala lalalalalalalalalalla"
}

var song2 = {
	title: "Tangled up in Blonde",
	release: "The Other Side of Bob Dylan",
	url: "bobdylan.com/tangeled",
	credit: "",
	lyrics: ""
}

var getTimestamp = function(date) {
	return Math.floor(new Date(date).getTime()/1000);
}

var show1 = {
	date: getTimestamp('Apr 2 2015'),
	url: 'bobdylan.com/showshowshow',
	city: 'Tukluck',
	state: 'Tennessee',
	country: 'United States',
	venue: 'Some venue'
}

var show2 = {
	date: getTimestamp('Sep 8 2009'),
	url: 'bobdylan.com/blahblah',
	city: 'Clearfield',
	state: 'Utah',
	country: 'United States', 
	venue: 'House show'
}

describe('Songs', function() {
	beforeEach(function() {
		return db('live_songs').del()
		.then(function() {
			return db('songs').del();
		})
	})

	xit('can add songs', function() {
		return Song.insert(song1)
		.then(function(id) {
			expect(typeof id).to.equal('number');
		})
	})

	xit('cannot add a song twice', function() {
		return Song.insert(song1)
		.then(function() {
			return Song.insert(song1);
		})
		.then(function(rows) {
			expect(rows).to.equal(undefined);
		})
		.catch(function(err) {
			expect(err).to.equal(400);
		})
	})

	xit('can retrieve all songs', function() {
		return Song.insert(song1)
		.then(function() {
			return Song.insert(song2);
		})
		.then(function() {
			return Song.all();
		})
		.then(function(songs) {
			expect(songs.length).to.equal(2);
			expect(songs[0].title).to.equal(song1.title);
			expect(songs[1].title).to.equal(song2.title);
		})
	})
})

describe('Shows', function() {
	beforeEach(function() {
		return db('live_songs').del()
		.then(function() {
			return db('shows').del();
		})	
	})

	xit('can add a show', function() {
		return Show.insert(show1)
		.then(function(id) {
			expect(typeof id).to.equal('number');
		})
	})

	xit('cannot add a show twice', function() {
		return Show.insert(show1)
		.then(function() {
			return Show.insert(show1)
		})
		.then(function(rows) {
			expect(rows).to.equal(undefined);
		})
		.catch(function(err) {
			expect(err).to.equal(400);
		})

		xit('can get all shows', function() {
			return Show.insert(show1)
			.then(function() {
				return Show.insert(show2);
			})
			.then(function(id) {
				Setlist.insertList([song1.title, song2.title], id)
			})
		})

	})

	xit('can find the most recent show', function() {
		return Show.insert(show1)
		.then(function() {
			return Show.insert(show2);
		})
		.then(function() {
			return Show.mostRecent()
		})
		.then(function(show) {
			expect(show.url).to.equal(show1.url)
		})
	})
})

describe('Setlists', function() {
		beforeEach(function() {
			return db('live_songs').del()
			.then(function() {
				return db('shows').del()
			})
			.then(function() {
				return db('songs').del();
			})
			.then(function() {
				return Song.insert(song1);
			})
			.then(function(id) {
				song1.id = id;
				return Song.insert(song2);
			})
			.then(function(id) {
				song2.id = id;
				return Show.insert(show1);
			})
			.then(function(id) {
				show1.id = id;
				return Show.insert(show2);
			})
			.then(function(id) {
				show2.id = id;
			})
		})

		xit('can add a song', function() {
			var live_song = {
				song_id: song1.id,
				show_id: show1.id,
				rank: 1
			}

			return Setlist.insertSong(live_song)
			.then(function(id) {
				expect(typeof id).to.equal('number');
			})
		})

		xit('must have valid show and song ids', function() {
			var live_song = {
				song_id: 6.5,
				show_id: show1.id,
				rank: 1
			}

			return Setlist.insertSong(live_song)
			.then(function(id) {
				expect(id).to.equal(undefined)
			})
			.catch(function(err) {
				expect(err).to.equal(400)

				live_song.song_id = song1.id
				live_song.show_id = 77
				return Setlist.insertSong(live_song)
			})
			.then(function(id) {
				expect(id).to.equal(undefined)
			})
			.catch(function(err) {
				expect(err).to.equal(400)
			})
		})

		xit('can insert a full setlist', function() {
			return Setlist.insertList([song1.title, song2.title], show1.id)
		})

		xit('can retrieve a setlist', function() {
			return Setlist.insertList([song1.title, song2.title], show1.id)
			.then(function() {
				return Setlist.insertList([song2.title, song1.title], show2.id);
			})
			.then(function() {
				return Setlist.findByShow(show1.id)
			})
			.then(function(setlist) {
				expect(setlist.length).to.equal(2);
				expect(setlist[0].title).to.equal(song1.title);
				expect(setlist[1].title).to.equal(song2.title);
			})
		})

	xit('can retrieve songs with play counts', function() {
		return Setlist.insertList([song1.title, song2.title], show1.id)
		.then(function() {
			return Setlist.insertList([song2.title], show2.id);
		})
		.then(function() {
			return Song.count(song2.id) 
		})
		.then(function(count) {
			expect(count).to.equal(2);
			return Song.allByCount()
		})
		.then(function(songs) {
			expect(songs.length).to.equal(2);
			expect(songs[0].title).to.equal(song2.title);
			expect(songs[1].title).to.equal(song1.title);			
		})
	})

})