var Song = require('../models/song');
var Show = require('../models/show');
var Count = require('../helpers/count').date;
var Collection = require('../helpers/collection').date;

var dataMethods = {
  
}

var decade = {
  collection: Collection.decade,
  start: function(decade) {
    return timestamp(new Date(decade, 0));
  },
  end: function(decade) {
    return timestamp(new Date(decade+10, 0));
  },
  toString: function(decade) {
    return decade+'s';
  }
}

var year = {
  collection: Collection.year,
  start: function(year) {
    return timestamp(new Date(year, 0));
  },
  end: function(year) {
    return timestamp(new Date(year+1, 0));
  },
  toString: function(year) {
    return year.toString();
  }
}

var month = {
  collection: Collection.month,
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
    return month+'-'+year;
  } 
}

var dateType = {
  decade: decade,
  year: year,
  month: month
}

var song = {
  makeArr: Song.byDate,
  countOne: Count.oneSong,
  countTotal: Count.total
}

var show = {
  makeArr: Show.byDate
}

var dataType = {
  song: song,
  show: show
}

module.exports = {
  dateType: dateType,
  dataType: dataType
}

