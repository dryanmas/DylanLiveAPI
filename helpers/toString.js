var date = {};

date.decade = function(decade) {
  return decade+'s';
};

date.year = function(year) {
  return year.toString();
};

date.month = function(pair) {
  var month = pair[0];
  var year = pair[1];
  return month+'-'+year;
} 

var location = {};

location.venue = function(location) {
  return location.join(', ');
};

location.city = function(location) {
  var city = location[0];
  var state = location[1];
  var country = location[2];

  if (state) {
    return city + ', ' + state;
  } else {
    return city + ', ' + country;
  }
};

location.state = function(state) {
  return state;
};

location.country = function(country) {
  return country;
};
 
var album = function(album) {
  return album;
}

module.exports = {
  location: location,
  date: date,
  album: album
}