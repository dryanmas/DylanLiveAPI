var db = require('../db');
var count = require('../helpers/count');

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
		return count.all(songs[0].id)
		.then(function(amount) {
			expect(amount).to.equal(4);
			return count.all(songs[5].id)
		})
		.then(function(amount) {
			expect(amount).to.equal(2);
		})

	})

	it('by date', function() {
		var id = songs[0].id;
		var start = getTimestamp('Jan 1 1980');
		var end = getTimestamp('Jan 1 2000');

		return count.byDate(id, start, end)
		.then(function(amount) {
			expect(amount).to.equal(1);

			id = songs[1].id;
			start = getTimestamp('Oct 2 1990')
			return count.byDate(id, start);
		})
		.then(function(amount) {
			expect(amount).to.equal(3);
		})
	})

	it('all by date', function() {
		var start = getTimestamp('Jun 2 1991');
		return count.allByDate(start)
		.then(function(amount) {
			expect(amount).to.equal(9);
		})
	})

	it('by city', function() {
		return count.byCity(songs[1].id, 'Tukluck')
		.then(function(amount) {
			expect(amount).to.equal(2);
			return count.byCity(songs[0].id, 'Tukluck')
		})
		.then(function(amount){
			expect(amount).to.equal(1);
			return count.byCity(songs[0].id, 'Madrid')
		})
		.then(function(amount) {
			expect(amount).to.equal(1);
		})
	})

	it('all by city', function() {
		return count.allByCity('Salt Lake City')
		.then(function(amount) {
			expect(amount).to.equal(11);
		})
	})

	it('by state', function() {
		return count.byState(songs[0].id, 'Utah')
		.then(function(amount) {
			expect(amount).to.equal(2);
		})
	})

	it('all by state', function() {
		return count.allByState('Tennessee')
		.then(function(amount) {
			expect(amount).to.equal(5);
		})
	})

	it('by country', function() {
		return count.byCountry(songs[0].id, 'United States')
		.then(function(amount) {
			expect(amount).to.equal(3);
			return count.byCountry(songs[1].id, 'Spain')
		})
		.then(function(amount) {
			expect(amount).to.equal(0)
		})
	})

	it('all by country', function() {
		return count.allByCountry('Spain')
		.then(function(amount) {
			expect(amount).to.equal(3);
		})
	})

	it('by venue', function() {
		return count.byVenue(songs[0].id, 'USANA', 'Salt Lake City')
		.then(function(amount) {
			expect(amount).to.equal(1);
			return count.byVenue(songs[2].id, 'USANA', 'Salt Lake City')
		})
		.then(function(amount) {
			expect(amount).to.equal(2);
		})
	})

	it('all by venue', function() {
		return count.allByVenue('House show', 'Medford')
		.then(function(amount) {
			expect(amount).to.equal(3);
		})
	})

	it('all by album', function() {
		return count.allByAlbum('release2')
		.then(function(amount) {
			expect(amount).to.equal(3);
			return count.allByAlbum('release1')
		})
		.then(function(amount) {
			expect(amount).to.equal(16)
		})

	})
})
