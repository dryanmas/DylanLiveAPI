var Song = require('../models/song');
var Show = require('../models/show');
var Count = require('../helpers/count').album;
var Collection = require('../helpers/collection').album;

var dataMethods = {
  song: {
    makeArr: Song.byAlbum,
    countOne: Count.oneSong,
    countTotal: Count.total
  },
  show: {
    makeArr: Show.byAlbum
  }
}
//TODO: decide if i want toString in hurrr
module.exports = {
  collection: Collection,
  // toString: ToString,
  dataMethods: dataMethods
}
