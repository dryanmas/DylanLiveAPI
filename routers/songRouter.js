var router = require('express').Router();
var dateRouter = require('./songByDateRouter');
var locationRouter = require('./songByLocationRouter');
var Song = require('../models/song');

router.use('/byDate', dateRouter);
router.use('/byLocation', locationRouter);

//get all songs
router.get('/', function(req, res) {
	Song.selectAll()
	.then(function(songs) {
		res.status(200).send({songs: songs});
	})
	.catch(function() {
		console.log('could not get all songs');
		res.sendStatus(400);
	})
})

router.get('/byAlbum', function(req, res) {

})

router.get('/byVenue', function(req, res) {
	
})


module.exports = router;