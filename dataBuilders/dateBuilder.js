var Promise = require('bluebird');
var builder = require('./basicBuilder');
var dateMethods = require('./dateMethods').dateType;
var dataMethods = require('./dateMethods').dataType;
var count = require('../models/helpers/count');
var Song = require('../models/song');

var builder = Promise.coroutiner(function *(dateType, dataType) {
	var date = dateMethods[dateType];

	var arr = yield date.collection();
	arr = collection.map(function(item) {
		return {
			unit: function(){
				return [date.start(), date.end()]
			},
			key: date.toString
		}
	})

	//dependant on if we working with shows or songs
	var genArr = dataMethods[dataType];
	var total = dataMethods[dataType];
	var innerTotal = dataMethods[dataType];

	return builder(arr, genArr, total, innerTotal)
})

module.exports = {
	song: function(dateType) {
		return builder(dateType, 'song');
	},
	show: function(dateType) {
		return builder(dateType, 'show');
	}
}

