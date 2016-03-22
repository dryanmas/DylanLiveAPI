var db = require('../db');
var Promise = require('bluebird');

Setlist = {};

Setlist.getOne = function(show) {
  return db('songs').select('songs.*')
  .innerJoin('live_songs', 'songs.id', 'live_songs.song_id')
  .where({show_id: show.id})
  .orderBy('rank')
}

Setlist.getAll = function(shows) {
  return Promise.all(shows.map(Setlist.getOne));
}

module.exports = Setlist;