var Song = require('../models/song');
var Show = require('../models/show');
var collections = require('../models/helpers/collections');
var count = require('../models/helpers/count');

var timestamp = function(date){
	return Math.floor(date.getTime()/1000);
}

var decade = {
	collection: collections.decades,
	start: function(decade) {
		return timestamp(new Date(decade));
	},
	end: function(decade) {
		return timestamp(new Date(decade+10));
	},
	toString: function(decade) {
		return decade+'s';
	}
}

var year = {
	collection: collections.years,
	start: function(year) {
		return timestamp(new Date(year));
	},
	end: function(year) {
		return timestamp(new Date(year));
	},
	toString: function(year) {
		return year.toString();
	}
}

var month = {
	collection: collections.months,
	start: function(pair) {
		var month = pair[0];
		var year = pair[1];
		return timestamp(new Date(year, month-1));
	},
	end: function(pair) {
		var month = pair[0];
		var year = pair[1];

		if (month === 12) {
			month = 0;
			year++;
		}

		return timestamp(new Date(year, month))
	},
	toString: function(pair) {
		var month = pair[0];
		var year = pair[1];
		return month+'/'+year;
	} 
}

var dateType = {
	decade: decade,
	year: year,
	month: month
}

var song = {
	genArr: function(range) {
		return Song.byDate(range[0], range[1]);
	},
	total: function(range) {
		return count.allByDate(range[0], range[1]);
	}, 
	innerTotal = function(song) {
		return count.byDate(song.id, range[0], range[1]);
	}
}

var show = {
	genArr: function(range) {
		return Show.byDate(range[0], range[1])
	}
}

var dataType = {
	song: song,
	show: show
}

module.exports = {
	dateType: dateType,
	dataType: dataType
}

