var db = require('../db');
var collections = require('../helpers/collections');

var songs = require('./data').songs;
var shows = require('./data').shows;
var populateDB = require('./data').populateDB;

var expect = require('chai').expect;

describe('Collections', function() {
	beforeEach(populateDB);

	it('should get all months', function() {
		return collections.months()
		.then(function(months) {
			expect(months.length).to.equal(7);
			expect(months[0][0]).to.equal(9);
			expect(months[0][1]).to.equal(1966);
		})
	})

	it('should get all cities', function() {
		return collections.cities()
		.then(function(cities) {
			expect(cities.length).to.equal(5)
			expect(cities[0]).to.equal('Clearfield');
		})
	})

	it('should get all states', function() {
		return collections.states()
		.then(function(states) {
			expect(states.length).to.equal(3);
			expect(states[0]).to.equal('Oregon');
		})
	})

	it('should get all countries', function() {
		return collections.countries()
		.then(function(countries) {
			expect(countries.length).to.equal(2);
			expect(countries[0]).to.equal('Spain');
		})
	})

	it('should get all albums', function() {
		return collections.albums()
		.then(function(albums) {
			expect(albums.length).to.equal(4);
			expect(albums[0]).to.equal('release1');
		})
	})

	it('should get all venues', function() {
		return collections.venues()
		.then(function(venues) {
			expect(venues.length).to.equal(6)
			expect(venues[0]).to.equal('Another venue');
		})
	})
})