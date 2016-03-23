var Setlist = require('../models/setlist');
var db = require('../db');

var songs = require('./data').songs;
var shows = require('./data').shows;
var populateDB = require('./data').populateDB;

var expect = require('chai').expect;

describe('Setlists', function() {
  beforeEach(populateDB);

  it('can be generated for a show', function() {
    return Setlist.getOne(shows[0].id)
    .then(function(setlist) {
      expect(setlist[0].title).to.equal('song1');
      expect(setlist[1].title).to.equal('song2');
    })
  })

  xit('can be generated for many shows', function() {
    return Setlist.getAll([shows[0], shows[1], shows[2]])
    .then(function(setlists) {
      var setlist = setlists[1];
      expect(setlist[1].title).to.equal('song2');
      expect(setlist[2].title).to.equal('song5');
    })
  })

})