var router = require('express').Router();
var dateRouter = require('./songByDateRouter');
var locationRouter = require('./songByLocationRouter');
var Song = require('../models/song');

router.use('/date', dateRouter);
router.use('/location', locationRouter);

//get all songs
router.get('/', function(req, res) {
	Song.all().then(function(songs) {
		return Song.addCount(songs)
	})
	.then(function(songs) {
		res.status(200).send({songs: songs});
	})
	.catch(function() {
		console.log('could not get songs');
		res.sendStatus(400);
	})
})

router.get('/album', function(req, res) {
	
})


module.exports = router;