var identity = function(arg) {
  return arg;
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

var dateValue = function(dateType) {
  return function(val) {
    var startStamp = start[dateType];
    var endStamp = end[dateType];
    return [startStamp(val), endStamp(val)];
  }
}

var toValue = {}

toValue.month = dateValue('month');
toValue.year = dateValue('year');
toValue.decade = dateValue('decade');

toValue.album = identity;
toValue.venue = identity;
toValue.city = identity;
toValue.state = identity;
toValue.country = identity;

module.exports = toValue;
