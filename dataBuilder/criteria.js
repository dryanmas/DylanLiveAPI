var Count = require('./count');
var Collection = require('./collection');
var ToString = require('./toString');
var ToValue = require('./toValue');
var Song = require('../models/song');
var Show = require('../models/show');
var Setlist = require('../models/setlist');

var criteria = {};

var locations = ['venue', 'city', 'state', 'country']; 
var dates = ['month', 'year', 'decade'];

locations.forEach(function(location) {
  criteria[location] = {
    type: "location"
  }
})

dates.forEach(function(date) {
  criteria[date] = {
    type: "date"
  }
})

criteria.album = {
  type: "album"
}

//adds methods
for (var criterion in criteria) {
  var type = criteria[criterion].type;

  criteria[criterion].getCollection = Collection[criterion];
  criteria[criterion].toString = ToString[criterion];
  criteria[criterion].toValue = ToValue[criterion];
  criteria[criterion].count = Count[criterion] || Count[type];
  criteria[criterion].getSongs = Song[criterion] || Song[type];
  criteria[criterion].getShows = Show[criterion] || Show[type];
  criteria[criterion].getSetlist = Setlist.getOne;
}

module.exports = criteria;
