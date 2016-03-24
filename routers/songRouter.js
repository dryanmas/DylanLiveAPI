var router = require('express').Router();
var AllSongs = require('../dataBuilder/all').songs;
var SongBuilder = require('../dataBuilder/builder').song;

//get all songs
router.get('/', function(req, res) {
	AllSongs().then(function(songs) {
		res.status(200).send({songs: songs});
	})
	.catch(function() {
		console.log('could not get songs');
		res.sendStatus(400);
	})
})

router.get('/:criterion', function(req, res) {
	SongBuilder(criterion).then(function(data) {
		res.status(200).send(data);
	})
	.catch(function() {
		console.log('could not get songs; improper criterion');
		res.sendStatus(400);	
	})
})


module.exports = router;