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

var show1 = {
	date: 'Apr 2 2015',
	url: 'bobdylan.com/showshowshow',
	location: 'Tukluck, TN',
	venue: 'Some venue'
}

var show2 = {
	date: 'Sep 8 2009',
	url: 'bobdylan.com/blahblah',
	location: 'Clearfield, UT',
	venue: 'House show'
}

describe('Songs', function() {
	beforeEach(function() {
		return db('live_songs').del()
		.then(function() {
			return db('songs').del();
		})
	})

	it('can add songs', function() {
		return Song.insert(song1)
		.then(function(id) {
			expect(typeof id).to.equal('number');
		})
	})

	it('cannot add a song twice', function() {
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
})

describe('Shows', function() {
	beforeEach(function() {
		return db('live_songs').del()
		.then(function() {
			return db('shows').del();
		})	
	})

	it('can add a show', function() {
		return Show.insert(show1)
		.then(function(id) {
			expect(typeof id).to.equal('number');
		})
	})

	it('cannot add a show twice', function() {
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

	})

	it('can find the most recent show', function() {
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
				return db('songs').del()
			})
			.then(function() {
				return Song.insert(song1)
			})
			.then(function(id) {
				song1.id = id;
				return Song.insert(song2)
			})
			.then(function(id) {
				song2.id = id;
				return Show.insert(show1)
			})
			.then(function(id) {
				show1.id = id;
			})
		})

		it('can add a song', function() {
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

		it('must have valid show and song ids', function() {
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

		it('can insert a full setlist', function() {
			return Setlist.insertList([song1.title, song2.title], show1.id)
		})

})