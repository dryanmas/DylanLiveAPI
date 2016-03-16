var router = require('express').Router();
var Promise = require('bluebird');
var dateRouter = require('./showByDateRouter');
var locationRouter = require('./showByLocationRouter');

var Show = require('../models/show');
var Setlist = require('../models/setlist');

router.use('/byDate', dateRouter);
router.use('/byLocation', locationRouter);

router.get('/', function(req, res) {
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

router.get('byVenue', function(req, res) {

})

module.exports = router;