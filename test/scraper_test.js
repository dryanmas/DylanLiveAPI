var db = require('../db.js');
var Song = require('../models/song');
var Show = require('../models/show');
var Setlist = require('../models/setlist');

var songs = require('./data').songs;
var shows = require('./data').shows;
var setlists = require('./data').setlists;

var expect = require('chai').expect;

var getTimestamp = function(date) {
	return Math.floor(new Date(date).getTime()/1000);
}

describe('Scraper', function() {
	beforeEach(function() {
		return db('live_songs').del()
		.then(function() {
			return db('shows').del()
		})
		.then(function() {
			return db('songs').del();
		})
	})

	it('can add songs', function() {
		return Song.insert(songs)
		.then(function(ids) {
			ids.forEach(function(id) {
				expect(typeof id).to.equal('number');
			})
		})
	})

	it('cannot add a song twice', function() {
		return Song.insert(songs)
		.then(function() {
			return Song.insert(songs);
		})
		.then(function(rows) {
			expect(rows).to.equal(undefined);
		})
		.catch(function(err) {
			expect(err).to.equal("Duplicate song!");
		})
	})

	it('can find a song by title', function() {
		return Song.insert(songs)
		.then(function() {
			return Song.findByTitle('song1');
		})
		.then(function(song) {
			expect(song.title).to.equal('song1');
			return Song.findByTitle('song88');
		})	
		.then(function(song) {
			expect(song).to.equal(undefined);
		})
	})

	it('can insert shows', function() {
		return Song.insert(songs)
		.then(function() {
			return Show.insert(shows, setlists);
		})
		.then(function(ids) {
			ids.forEach(function(id) {
				expect(typeof id).to.equal('number');
			})
		})
	})

	it('cannot insert shows twice', function() {
		return Song.insert(songs)
		.then(function() {
			return Show.insert(shows, setlists);
		})
		.then(function() {
			return Show.insert(shows, setlists);
		})
		.then(function(rows) {
			expect(rows).to.equal(undefined);
		})
		.catch(function(err) {
			expect(err).to.equal("Duplicate show!")
		})
	})

	it('cannot insert a shoddy setlist', function() {
		return Show.insert(shows, setlists)
		.then(function(rows){
			expect(rows).to.be.undefined;
		})
		.catch(function(err) {
			expect(err).to.equal('Could not insert setlist');
		})
	})

	it('can find the most recent show', function() {
		return Song.insert(songs)
		.then(function() {
			return Show.insert(shows, setlists)
		})
		.then(function() {
			return Show.mostRecent()
		})
		.then(function(show){
			expect(show.url).to.equal('bobdylan.com/asdf');
		})
	})

})
