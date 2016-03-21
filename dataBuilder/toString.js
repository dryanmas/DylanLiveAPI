var toString = {};

toString.decade = function(decade) {
  return decade+'s';
};

toString.year = function(year) {
  return year.toString();
};

toString.month = function(pair) {
  var month = pair[0];
  var year = pair[1];
  return month+'-'+year;
} 

toString.venue = function(location) {
  return location.join(', ');
};

toString.city = function(location) {
  var city = location[0];
  var state = location[1];
  var country = location[2];

  if (state) {
    return city + ', ' + state;
  } else {
    return city + ', ' + country;
  }
};

var identity = function(arg) {
  return arg;
}

toString.state = identity;
toString.country = identity;
toString.album = identity;

module.exports = toString;