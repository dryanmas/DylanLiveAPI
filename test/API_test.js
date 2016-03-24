var request = require('supertest-promised');
var app = require('express')();
var songRouter = require('../routers/songRouter');
var showRouter = require('../routers/showRouter');

var populateDB = require('./data').populateDB;

var expect = require('chai').expect;

app.use('/songs', songRouter);
app.use('/shows', showRouter);

describe('The API', function() {
  beforeEach(populateDB);

  it('can get all songs', function() {
    return request(app)
    .get('/songs/')
    .expect(200)
    .expect(function(res) {
      var songs = res.body.songs;
      expect(songs.length).to.equal(7);
    })
  })

  it('can get songs by criteria', function() {
    return request(app)
    .get('/songs/state')
    .expect(200)
    .expect(function(res) {
      var states = res.body;
      expect(typeof states.Utah).to.equal('object');
    })
  })

})