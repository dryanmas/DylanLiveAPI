var router = require('express').Router();
var Promise = require('bluebird');
var dateRouter = require('./showByDateRouter');
var locationRouter = require('./showByLocationRouter');

var Show = require('../models/show');
var Setlist = require('../models/setlist');

router.use('/byDate', dateRouter);
router.use('/byLocation', locationRouter);

router.get('/', function(req, res) {

})

router.get('byVenue', function(req, res) {

})

module.exports = router;