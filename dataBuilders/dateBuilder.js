var Promise = require('bluebird');
var builder = require('./basicBuilder');
var dateMethods = require('./dateMethods').dateType;
var dataMethods = require('./dateMethods').dataType;
var count = require('../helpers/count');
var Song = require('../models/song');

var dateBuilder = Promise.coroutine(function *(dateType, dataType) {
	var date = dateMethods[dateType];

	var collection = (yield date.collection()).map(function(item) {
		return {
			value: function(){
				return [date.start(item), date.end(item)]
			},
			toString: function() {
				return date.toString(item);	
			}
		}
	})
	
	//dependant on if we working with shows or songs
	var methods = dataMethods[dataType];

	var makeArr = methods.makeArr;
	var countOne = methods.countOne;
	var countTotal = methods.countTotal;

	return builder(collection, makeArr, countOne, countTotal)
})

module.exports = {
	song: function(dateType) {
		return dateBuilder(dateType, 'song');
	},
	show: function(dateType) {
		return dateBuilder(dateType, 'show');
	}
}

