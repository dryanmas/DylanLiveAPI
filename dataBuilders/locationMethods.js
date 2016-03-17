// var Song = require('../models/song');
// var Show = require('../models/show');
// var Count = require('../helpers/count').location;

// var collections = require('../helpers/collections');

// var venueDataType = {
//   song: {
//     genArr: Song.byVenue,
//     total: count.allByVenue,
//     innerTotal: count.byVenue
//   },
//   show: {
//     genArr: Show.byVenue
//   }
// }

// var venue = {
//   collection: collections.venues,
//   toString: function(pair) {
//     return pair.join(', ');
//   },
//   dataType: venueDataType 
// }


// var cityDataType = {
//   song: {
//     genArr: Song.byCity,
//     total: count.allByCity,
//     innerTotal: count.byCity
//   },
//   show: {
//     genArr: Show.byCity
//   }
// }

// var city = {
//   collection: collections.cities,
//   toString: function(location) {
//     var city = location[0];
//     var state = location[1];
//     var country = location[2];

//     if (state) {
//       return city + ', ' + state;
//     } else {
//       return city + ', ' + country;
//     }
//   },
//   dataType: cityDataType
// }

// var stateDataType = {
//   song: {
//     genArr: Song.byState,
//     total: count.allByState,
//     innerTotal: count.byState
//   },
//   show: {
//     genArr: Show.byState
//   }
// }

// var state = {
//   collection: collections.states,
//   toString: function(state) {
//     return state;
//   },
//   dataType: stateDataType 
// }

// var countryDataType = {
//   song: {
//     genArr: Song.byCountry,
//     total: count.allByCountry,
//     innerTotal: count.byCountry
//   },
//   show: {
//     genArr: Show.byCountry
//   }
// }

// var country = {
//   collection: collections.countries,
//   toString: function(country) {
//     return country;
//   },
//   dataType: countryDataType
// }

// var locationType = {
//   venue: venue,
//   city: city,
//   state: state,
//   country: country
// }


// module.exports = {
//   venue: venue,
//   city: city,
//   state, state,
//   country, country
// }

