var Promise = require('bluebird');
var builder = require('./basicBuilder');
var locationMethods = require('./locationMethods')
var count = require('../helpers/count');
var Song = require('../models/song');

var dateBuilder = Promise.coroutine(function *(locationType, dataType) {
  var location = locationMethods[locationType];

  var arr = yield location.collection();
  arr = arr.map(function(item) {
    return {
      value: function(){
        return item;
      },
      toString: function() {
        return location.toString(item); 
      }
    }
  })
  
  //dependant on if we working with shows or songs
  var methods = location.dataType[dataType];

  var buildArr = methods.buildArr;
  var countOne = methods.countOne;
  var countTotal = methods.countTotal;

  return builder(arr, buildArr, countOne, countTotal)
})

module.exports = {
  song: function(locationType) {
    return dateBuilder(locationType, 'song');
  },
  show: function(locationType) {
    return dateBuilder(locationType, 'show');
  }
}

