var db = require('../db');
var Promise = require('bluebird');

Setlist = {};

Setlist.getOne = function(showId) {
  return db('songs').select('songs.*')
  .innerJoin('live_songs', 'songs.id', 'live_songs.song_id')
  .where({show_id: showId})
  .orderBy('rank')
}

//this is probably unnecessary 
// Setlist.getAll = function(shows) {
//   return Promise.all(shows.map(Setlist.getOne));
// }

module.exports = Setlist;