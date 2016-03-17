var Song = require('../models/song').location;
var Show = require('../models/show').location;
var Count = require('../helpers/count').location;
var Collection = require('../helpers/collection').location;
var ToString = require('../helpers/toString').location;

var locations = ['venue', 'city', 'state', 'country']

var methods = {}

locations.forEach(function(locationType) {
  var dataMethods = {
    song: {
      makeArr: Song[locationType],
      countOne: Count[locationType].oneSong,
      countTotal: Count[locationType].total
    },
    show: {
      makeArr: Show[locationType]
    }
  }

  methods[locationType] = {
    collection: Collection[locationType],
    toString: ToString[locationType],
    dataMethods: dataMethods,
  }
})

module.exports = methods;
