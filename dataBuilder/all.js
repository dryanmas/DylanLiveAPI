var db = require('../db');
var Promise = require('bluebird');

var getSetlist = require('./getSetlist');
var songCount = require('./count').all;

var getShows = function() {
  return db('shows').select('*')
  .orderBy('date')
  .then(function(shows) {
    return Promise.all(shows.map(addSetlist));
  })
}

var addSetlist = function(show) {
  return getSetlist(show.id)
  .then(function(setlist) {
    show.setlist = setlist;
    return show; 
  })
}

var getSongs = function() {
  return db('songs').select('*')
  .orderBy('title')
  .then(function(songs) {
    return Promise.all(songs.map(addCount))
  })
}

var addCount = function(song) {
  return songCount(song.id)
  .then(function(count) {
    song.count = count;
    return song;
  })
}

module.exports = {
  songs: getSongs,
  shows: getShows
}

