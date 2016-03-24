var db = require('../db');
var Promise = require('bluebird');

/**
  random stand alone function that really doesnt belong anywhere else
  gets a setlist for a show
**/
module.exports = function(showId) {
  return db('songs').select('songs.*')
  .innerJoin('live_songs', 'songs.id', 'live_songs.song_id')
  .where({show_id: showId})
  .orderBy('rank')
}
