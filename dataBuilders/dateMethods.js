var Song = require('../models/song');
var Show = require('../models/show');
var Count = require('../helpers/count').date;
var Collection = require('../helpers/collection').date;
var ToString = require('../helpers/toString').date;

var dataMethods = {
	song: {
		makeArr: Song.byDate,
		countOne: Count.oneSong,
		countTotal: Count.total
	},
	show: {
		makeArr: Show.byDate
	}
}

var timestamp = function(date){
	return Math.floor(date.getTime()/1000);
}

var start = {
	decade: function(decade) {
		return timestamp(new Date(decade, 0));
	},
	year: function(year) {
		return timestamp(new Date(year, 0));
	},
	month: function(pair) {
		var month = pair[0];
		var year = pair[1];
		return timestamp(new Date(year, month-1));
	}
}

var end = {
	decade: function(decade) {
		return timestamp(new Date(decade+10, 0));
	},
	year: function(year) {
		return timestamp(new Date(year+1, 0));
	},
	month: function(pair) {
		var month = pair[0];
		var year = pair[1];

		if (month === 12) {
			month = 0;
			year++;
		}

		return timestamp(new Date(year, month))
	}
}

var methods = {};
var intervals = ['decade', 'year', 'month']

intervals.forEach(function(type) {
	methods[type] = {
		collection: Collection[type],
		start: start[type],
		end: end[type],
		toString: ToString[type],
		dataMethods: dataMethods
	}
})

module.exports = methods;