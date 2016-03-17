var db = require('../db');
var dateBuilder = require('../dataBuilders/dateBuilder');
var locationBuilder = require('../dataBuilders/locationBuilder');
var albumBuilder = require('../dataBuilders/albumBuilder');

var songs = require('./data').songs;
var shows = require('./data').shows;
var populateDB = require('./data').populateDB;

var expect = require('chai').expect;

describe('Date Builder', function() {
	beforeEach(populateDB);

	it('should build by decade', function() {
		return dateBuilder.song('decade')
		.then(function(data) {
			expect(Object.keys(data).length).to.equal(6);
			expect(data['1990s'].all.length).to.equal(7);
			expect(data['1960s'].total).to.equal(6);

      return dateBuilder.show('decade')
		})
    .then(function(data) {
      expect(data['2010s'].length).to.equal(2);
      expect(data['1980s'].length).to.equal(0);
    })
	})

  it('should build by year', function() {
    return dateBuilder.song('year')
    .then(function(data) {
      expect(data['1969'].all.length).to.equal(3);
      expect(data['1980'].all.length).to.equal(0);
      expect(data['1990'].total).to.equal(7);

      return dateBuilder.show('year')
    })    
    .then(function(data) {
      expect(data['1966'].length).to.equal(1);
      expect(data['1992'].length).to.equal(0);
    })
  })

  it('should build by month', function() {
    return dateBuilder.song('month')
    .then(function(data) {
      expect(Object.keys(data).length).to.equal(7);
      expect(data['10-2015'].all.length).to.equal(4);
      expect(data['4-2015'].total).to.equal(2);

      return dateBuilder.show('month');
    })
    .then(function(data) {
      expect(Object.keys(data).length).to.equal(7);
      expect(data['6-1977'].length).to.equal(1);
    })
  })
})

describe('Location Builder', function() {
  beforeEach(populateDB);

  it('should build by venue', function() {
    return locationBuilder.song('venue')
    .then(function(data) {
      expect(Object.keys(data).length).to.equal(6);
      expect(data['USANA, Salt Lake City'].all.length).to.equal(7);
      expect(data['House show, Medford'].total).to.equal(3);

      return locationBuilder.show('venue');
    })
    .then(function(data) {
      expect(Object.keys(data).length).to.equal(6);
      expect(data['USANA, Salt Lake City'].length).to.equal(2);
    })
  })

  it('should build by city', function() {
    return locationBuilder.song('city')
    .then(function(data) {
      expect(Object.keys(data).length).to.equal(5);
      expect(data['Tukluck, Tennessee'].all.length).to.equal(4);

      return locationBuilder.show('city');
    })
    .then(function(data) {
      expect(data['Salt Lake City, Utah'].length).to.equal(2);
      expect(data['Madrid, Spain'].length).to.equal(1);
    })
  })

  it('should build by state', function() {
    return locationBuilder.song('state')
    .then(function(data) {
      expect(Object.keys(data).length).to.equal(3);
      expect(data['Utah'].all.length).to.equal(7);

      return locationBuilder.show('state')
    })
    .then(function(data) {
      expect(data['Oregon'].length).to.equal(1);
    })
  })

  it('should build by country', function() {
    return locationBuilder.song('country')
    .then(function(data) {
      expect(data['Spain'].total).to.equal(3);

      return locationBuilder.show('country');
    })
    .then(function(data) {
      expect(Object.keys(data).length).to.equal(2);
      expect(data['United States'].length).to.equal(6);
    })
  })

})

describe('Album Builder', function() {
  beforeEach(populateDB);

  it('should build by ablum', function() {

  })
})