var db = require('../db.js');
var Song = require('../models/song');

var expect = require('chai').expect;

var song = {
	title: "Dylan's 88th Dream",
	release: "Bootlegs n stuff",
	url: "bobdylan.com/dylans88th",
	credit: "Written by Bobby-D",
	lyrics: "la lala lalalalalalalalalalla"
}

describe('Songs', function() {
	beforeEach(function() {
		return db('songs').del();
	})

	it('can add songs', function() {
		return Song.insert(song)
		.then(function(rows) {
			expect(rows).to.have.length(1);
			expect(rows[0]).to.equal(song.title);
		})
	})

	it('cannot add a song twice', function() {
		return Song.insert(song)
		.then(function() {
			return Song.insert(song);
		})
		.catch(function(err) {
			expect(err).to.equal(400);
		})
	})
})