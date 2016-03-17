var db = require('../db');
var Collection = require('../helpers/collection');

var songs = require('./data').songs;
var shows = require('./data').shows;
var populateDB = require('./data').populateDB;

var expect = require('chai').expect;

describe('Collections', function() {
	beforeEach(populateDB);

	it('should get all months', function() {
		return Collection.date.month()
		.then(function(months) {
			expect(months.length).to.equal(7);
			expect(months[0][0]).to.equal(9);
			expect(months[0][1]).to.equal(1966);
		})
	})

	it('should get all venues', function() {
		return Collection.location.venue()
		.then(function(venues) {
			expect(venues.length).to.equal(6)
			expect(venues[0][0]).to.equal('Another venue');
			expect(venues[0][1]).to.equal('Tukluck');
		})
	})

	it('should get all cities', function() {
		return Collection.location.city()
		.then(function(cities) {
			expect(cities.length).to.equal(5)
			expect(cities[0][0]).to.equal('Clearfield');
			expect(cities[0][1]).to.equal('Utah');
			expect(cities[1][2]).to.equal('Spain');
		})
	})

	it('should get all states', function() {
		return Collection.location.state()
		.then(function(states) {
			expect(states.length).to.equal(3);
			expect(states[0]).to.equal('Oregon');
		})
	})

	it('should get all countries', function() {
		return Collection.location.country()
		.then(function(countries) {
			expect(countries.length).to.equal(2);
			expect(countries[0]).to.equal('Spain');
		})
	})

	it('should get all albums', function() {
		return Collection.album()
		.then(function(albums) {
			expect(albums.length).to.equal(4);
			expect(albums[0]).to.equal('release1');
		})
	})

})