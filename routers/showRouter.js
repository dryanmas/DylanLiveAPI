var router = require('express').Router();
var Promise = require('bluebird');

var Show = require('../models/show');
var Setlist = require('../models/setlist');

router.get('/', function(res, resp) {
	Show.all()
	.then(function(shows) {

		return Promise.all(shows.map(function(show) {
			return Setlist.findByShow(show.id)
		}))
		.then(function(setlists) {
			return shows.map(function(show, i) {
				return show.setlist = setlists[i];
			})
		})
	})
})

module.exports = router;