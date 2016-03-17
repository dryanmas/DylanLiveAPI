var db = require('../db');
var Count = require('../helpers/count');

var songs = require('./data').songs;
var shows = require('./data').shows;
var populateDB = require('./data').populateDB;

var expect = require('chai').expect;

var getTimestamp = function(date) {
	return Math.floor(new Date(date).getTime()/1000);
}

describe('Count', function() {
	//This clusterfuck populates the database
	beforeEach(populateDB);

	it('all', function() {
		var counter = Count.all;

		return counter(songs[0].id)
		.then(function(amount) {
			expect(amount).to.equal(4);
			return counter(songs[5].id)
		})
		.then(function(amount) {
			expect(amount).to.equal(2);
		})

	})

	it('by date', function() {
		var counter = Count.date.oneSong;

		var id = songs[0].id;
		var start = getTimestamp('Jan 1 1980');
		var end = getTimestamp('Jan 1 2000');

		return counter(id, [start, end])
		.then(function(amount) {
			expect(amount).to.equal(1);

			id = songs[1].id;
			start = getTimestamp('Oct 2 1990')
			return counter(id, [start]);
		})
		.then(function(amount) {
			expect(amount).to.equal(3);
		})
	})

	it('total by date', function() {
		var counter = Count.date.total;

		var start = getTimestamp('Jun 2 1991');
		return counter([start])
		.then(function(amount) {
			expect(amount).to.equal(9);
		})
	})

	it('by venue', function() {
		var counter = Count.location.venue.oneSong;

		return counter(songs[0].id, ['USANA', 'Salt Lake City'])
		.then(function(amount) {
			expect(amount).to.equal(1);
			return counter(songs[2].id, ['USANA', 'Salt Lake City'])
		})
		.then(function(amount) {
			expect(amount).to.equal(2);
		})
	})

	it('total by venue', function() {
		var counter = Count.location.venue.total;

		return counter(['House show', 'Medford'])
		.then(function(amount) {
			expect(amount).to.equal(3);
		})
	})

	it('by city', function() {
		var counter = Count.location.city.oneSong;

		return counter(songs[1].id, ['Tukluck', 'Tennessee', 'United States'])
		.then(function(amount) {
			expect(amount).to.equal(2);
			return counter(songs[0].id, ['Tukluck', 'Tennessee', 'United States'])
		})
		.then(function(amount){
			expect(amount).to.equal(1);
			return counter(songs[0].id, ['Madrid', null, 'Spain'])
		})
		.then(function(amount) {
			expect(amount).to.equal(1);
		})
	})

	it('total by city', function() {
		var counter = Count.location.city.total;

		return counter(['Salt Lake City', 'Utah', 'United States'])
		.then(function(amount) {
			expect(amount).to.equal(11);
		})
	})

	it('by state', function() {
		var counter = Count.location.state.oneSong;

		return counter(songs[0].id, 'Utah')
		.then(function(amount) {
			expect(amount).to.equal(2);
		})
	})

	it('total by state', function() {
		var counter = Count.location.state.total;

		return counter('Tennessee')
		.then(function(amount) {
			expect(amount).to.equal(5);
		})
	})

	it('by country', function() {
		var counter = Count.location.country.oneSong;

		return counter(songs[0].id, 'United States')
		.then(function(amount) {
			expect(amount).to.equal(3);
			return counter(songs[1].id, 'Spain')
		})
		.then(function(amount) {
			expect(amount).to.equal(0)
		})
	})

	it('total by country', function() {
		var counter = Count.location.country.total;

		return counter('Spain')
		.then(function(amount) {
			expect(amount).to.equal(3);
		})
	})

	it('total by album', function() {
		var counter = Count.album.total;

		return counter('release2')
		.then(function(amount) {
			expect(amount).to.equal(3);
			return counter('release1')
		})
		.then(function(amount) {
			expect(amount).to.equal(16)
		})

	})
})
