var Song = require('../models/song');
var Show = require('../models/show');
var collections = require('../helpers/collections');
var count = require('../helpers/count');



var dataType = {
  song: {
    genArr: Song.byAlbum,
    total: count.allByAlbum,
    innerTotal: count.byAlbum
  },
  show: {
    genArr: Show.byAlbum
  }
}

var methods = {
  collection: collections.albums,
  toString: function(album) {
    return album;
  } 
}

return {
  dataType: dataType,
  methods: methods
}