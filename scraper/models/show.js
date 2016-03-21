var db = require('../../db');
var Promise = require('bluebird');
var Setlist = require('./setlist');
var helpers = require('./helpers');

var Show = {};

/**
  inserts an array of shows and each coresponding setlist
**/
Show.insert = function(shows, setlists) {
  return Show.allUnique(shows)
  .then(function() {
    return db('shows').insert(shows).returning('id')
  })
  .then(function(ids) { 
    return Setlist.insert(setlists, ids);
  })
}

/**
  returns the most recently performed show
**/
Show.mostRecent = function() {
  return db('shows').max('date')
  .then(function(rows) {
    var date = rows[0].max;
    return db('shows').select('*')
    .where({date: date})
  })
  .then(helpers.pluckFirst);
}

/**
  finds a show based on url
**/
Show.byUrl = function(url) {
  return helpers.find(url, 'url', 'shows');
}

/**
  checks that a show is not already in the DB
**/
Show.checkUnique = function(show) {
  return Show.byUrl(show.url)
  .then(function(exists) {
    if (exists) throw 'Duplicate show!';
  })
}

/**
  checks that none of the shows are already in the DB
**/
Show.allUnique = function(shows) {
  return Promise.all(shows.map(Show.checkUnique));
}

module.exports = Show;