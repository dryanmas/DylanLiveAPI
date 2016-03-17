var Promise = require('bluebird');
var builder = require('./basicBuilder');
var dateMethods = require('./dateMethods').dateType;
var dataMethods = require('./dateMethods').dataType;
var count = require('../helpers/count');
var Song = require('../models/song');

var dateBuilder = Promise.coroutine(function *(dateType, dataType) {
	var date = dateMethods[dateType];

	var arr = yield date.collection();
	arr = arr.map(function(item) {
		return {
			unit: function(){
				return [date.start(item), date.end(item)]
			},
			key: function() {
				return date.toString(item);	
			}
		}
	})
	
	//dependant on if we working with shows or songs
	var methods = dataMethods[dataType];

	var genArr = methods.genArr;
	var total = methods.total;
	var innerTotal = methods.innerTotal;

	return builder(arr, genArr, total, innerTotal)
})

module.exports = {
	song: function(dateType) {
		return dateBuilder(dateType, 'song');
	},
	show: function(dateType) {
		return dateBuilder(dateType, 'show');
	}
}

