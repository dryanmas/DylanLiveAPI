var All = require('../dataBuilder/all');
var populateDB = require('./data').populateDB;

var expect = require('chai').expect;

describe('All', function() {
  beforeEach(populateDB);

  it('can get all songs', function() {
    return All.songs().then(function(songs) {
      expect(songs.length).to.equal(7);
      expect(songs[0].title).to.equal('song1');
      expect(songs[0].count).to.equal(4);
    })
  })

  it('can get all shows', function() {
    return All.shows().then(function(shows) {
      expect(shows.length).to.equal(7);
      expect(shows[0].setlist.length).to.equal(3);
    })  
  })
})