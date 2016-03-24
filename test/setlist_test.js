var db = require('../db');

var getSetlist = require('../dataBuilder/getSetlist');
var songs = require('./data').songs;
var shows = require('./data').shows;
var populateDB = require('./data').populateDB;

var expect = require('chai').expect;

describe('Setlists', function() {
  beforeEach(populateDB);

  it('can be generated for a show', function() {
    return getSetlist(shows[0].id)
    .then(function(setlist) {
      expect(setlist[0].title).to.equal('song1');
      expect(setlist[1].title).to.equal('song2');
    })
  })

})