var router = require('express').Router();
var Song = require('../models/song');

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

module.exports = router;