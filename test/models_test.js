var db = require('../db.js');
var Song = require('../models/song');
var Show = require('../models/show');

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
		return db('songs').del();
	})

	it('can add songs', function() {
		return Song.insert(song1)
		.then(function(rows) {
			expect(rows).to.have.length(1);
			expect(rows[0]).to.equal(song1.title);
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
		return db('shows').del();
	})

	it('can add a show', function() {
		return Show.insert(show1)
		.then(function(rows) {
			expect(rows[0]).to.equal(show1.date);
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
			return db('shows').del();
		})

})