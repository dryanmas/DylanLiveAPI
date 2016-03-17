var Song = require('../models/song').location;
var Show = require('../models/show').location;
var Count = require('../helpers/count').location;
var Collection = require('../helpers/collection').location;
var ToString = require('../helpers/toString').location;

var methods = {}
var locations = ['venue', 'city', 'state', 'country'];

locations.forEach(function(type) {
  var dataMethods = {
    song: {
      makeArr: Song[type],
      countOne: Count[type].oneSong,
      countTotal: Count[type].total
    },
    show: {
      makeArr: Show[type]
    }
  }

  methods[type] = {
    collection: Collection[type],
    toString: ToString[type],
    dataMethods: dataMethods,
  }
})

module.exports = methods;
