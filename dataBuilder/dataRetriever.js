var db = require('../db');
var Promise = require('bluebird');
var where = require('./where');

var getSongs = function(type, criteria) {
  var innerQuery = function() {
    var that = this;
    var query = that.select('song_id').from('shows')
    .leftJoin('live_songs', 'shows.id', 'live_songs.show_id');
    
    return where[type](criteria, query);
  }

  return db.select('*').from('songs')
  .whereIn('songs.id', innerQuery)
  .orderBy('title')
}

var getShows = function(type, criteria) {
  var query = db('shows').select('*');

  return where[type](criteria, query)
  .orderBy(type);
}

var getBy = {
  song: getSongs,
  show: getShows
}


var byDate = function(type, range) {
  return getBy[type]('date', range);
}

/**
  this one's a special snowflake so it cant use the getBy function
**/
var songsByAlbum = function(album) {
  return db('songs').select('*')
  .where({release: album})
  .orderBy('title')
}

var showsByAlbum = function(album) {
  return db.select('*').from('shows')
  .whereIn('shows.id', function() {
    this.select('show_id').from('songs')
    .leftJoin('live_songs', 'songs.id', 'song_id')
    .where({release: album})
  })
  .orderBy('date');
}

var byAlbum = {
  song: songsByAlbum,
  show: showsByAlbum
}

var DataBy = {}

DataBy.month = byDate;
DataBy.year = byDate;
DataBy.decade = byDate;

DataBy.album = function(type, album) {
  return byAlbum[type](album);
}

DataBy.venue = function(type, location) {
  return getBy[type]('venue', location);
}

DataBy.city = function(type, location) {
  return getBy[type]('city', location);
}

DataBy.state = function(type, state) {
  return getBy[type]('state', state);
}

DataBy.country = function(type, country) {
  return getBy[type]('country', country);
}

module.exports = DataBy;