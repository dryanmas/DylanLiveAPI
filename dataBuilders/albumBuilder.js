var Promise = require('bluebird');
var builder = require('./basicBuilder');
var albumMethods = require('./albumMethods');

var albumBuilder = Promise.coroutine(function *(dataType) {
  var album = albumMethods;

  var collection = (yield album.collection()).map(function(item) {
    return {
      value: function(){
        return item
      },
      toString: function() {
        return item; 
      }
    }
  })
  
  //dependant on if we working with shows or songs
  var methods = album.dataMethods[dataType];

  var makeArr = methods.makeArr;
  var countOne = methods.countOne;
  var countTotal = methods.countTotal;
 
  return builder(collection, makeArr, countOne, countTotal)
})

module.exports = {
  song: function() {
    return albumBuilder('song');
  },
  show: function() {
    return albumBuilder('show');
  }
}

