var location = {}

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

module.exports = {
  location: location
}