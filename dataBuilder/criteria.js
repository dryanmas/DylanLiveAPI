var Count = require('./count');
var Collection = require('./collection');
var ToString = require('./toString');
var ToValue = require('./toValue');
var getSetlist = require('./getSetlist');
var DataBy = require('./getData');

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
  criteria[criterion].count = Count[criterion]; 
  criteria[criterion].getSetlist = getSetlist;
  criteria[criterion].getData = DataBy[criterion];
}

module.exports = criteria;
