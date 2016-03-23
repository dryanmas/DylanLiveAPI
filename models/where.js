var Where = {};

Where.date = function(range, query) {
  //TODO: figure out if this is necessary
  range[1] = range[1] || Math.floor((Date.now()/1000)) + 1000000;
  
  return query.where('date', '>=', range[0])
  .andWhere('date', '<', range[1]);
}

Where.album = function(album, query) {
  return query.where({release: album});
}

Where.venue = function(location, query) {
  return query.where({venue: location[0]})
  .andWhere({city: location[1]});
}

Where.city = function(location, query) {
  return query.where({city: location[0]})
  .andWhere({state: location[1]})
  .andWhere({country: location[2]});
}

Where.state = function(state, query) {
  return query.where({state: state});

}

Where.country = function(country, query) {
  return query.where({country: country});
}

module.exports = Where;